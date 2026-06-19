from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
from urllib.parse import parse_qsl, quote, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from io import BytesIO
import base64
import json
import os
import re
import sqlite3
import zipfile
import xml.etree.ElementTree as ET

try:
    import psycopg
    from psycopg.rows import dict_row
except ImportError:
    psycopg = None
    dict_row = None


ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("ITHE_DB_PATH", ROOT / "ithe_app.db")).resolve()
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
POWER_AUTOMATE_SECRET = os.environ.get("POWER_AUTOMATE_SECRET", "").strip()
OUTLOOK_MONITOR_MAILBOX = os.environ.get("OUTLOOK_MONITOR_MAILBOX", "info_order@ithe.co.jp").strip()
MS_TENANT_ID = os.environ.get("MS_TENANT_ID", "").strip()
MS_CLIENT_ID = os.environ.get("MS_CLIENT_ID", "").strip()
MS_CLIENT_SECRET = os.environ.get("MS_CLIENT_SECRET", "").strip()
HOST = os.environ.get("ITHE_HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", os.environ.get("ITHE_PORT", "8000")))
MAIL_KEYWORDS = ["[商品交換依頼]", "[商品回収依頼]"]
XLSX_NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def use_postgres():
    return bool(DATABASE_URL)


def normalized_database_url():
    if not DATABASE_URL:
        return ""
    parts = urlsplit(DATABASE_URL)
    query = [(key, value) for key, value in parse_qsl(parts.query, keep_blank_values=True) if key != "pgbouncer"]
    if not any(key == "sslmode" for key, _ in query):
        query.append(("sslmode", "require"))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def get_connection():
    if use_postgres():
        if psycopg is None:
            raise RuntimeError("DATABASE_URL is set but psycopg is not installed")
        return psycopg.connect(normalized_database_url(), row_factory=dict_row)

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def sql_param():
    return "%s" if use_postgres() else "?"


def row_value(row, key):
    return row[key]


def init_db():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS delivery_checklists (
                case_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS delivery_imports (
                case_id TEXT PRIMARY KEY,
                case_payload TEXT NOT NULL,
                confirmation_payload TEXT NOT NULL,
                raw_payload TEXT NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler):
    length = int(handler.headers.get("Content-Length", "0"))
    if length <= 0:
        return {}
    return json.loads(handler.rfile.read(length).decode("utf-8"))


def require_power_automate_auth(handler):
    if not POWER_AUTOMATE_SECRET:
        json_response(handler, 500, {"error": "POWER_AUTOMATE_SECRET is not configured"})
        return False
    expected = f"Bearer {POWER_AUTOMATE_SECRET}"
    if handler.headers.get("Authorization", "") != expected:
        json_response(handler, 401, {"error": "Unauthorized"})
        return False
    return True


def clean(value):
    return " ".join(str(value or "").split()).strip()


def normalize_case_id(payload):
    raw = clean(payload.get("caseId") or payload.get("id") or payload.get("case_id"))
    if not raw:
        raise ValueError("caseId is required")
    return raw.replace("_", "-")


def normalize_date(value):
    text = clean(value)
    match = re.search(r"(\d{4})[/-](\d{1,2})[/-](\d{1,2})", text)
    if match:
        return f"{match.group(1)}-{match.group(2).zfill(2)}-{match.group(3).zfill(2)}"
    return text


def read_shared_strings(workbook):
    try:
        xml = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return [
        "".join(node.text or "" for node in item.findall(".//main:t", XLSX_NS))
        for item in xml.findall("main:si", XLSX_NS)
    ]


def resolve_sheet_path(workbook, preferred_name="アイザ"):
    workbook_xml = ET.fromstring(workbook.read("xl/workbook.xml"))
    rels_xml = ET.fromstring(workbook.read("xl/_rels/workbook.xml.rels"))
    rels = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels_xml.findall("rel:Relationship", XLSX_NS)}
    sheets = workbook_xml.findall("main:sheets/main:sheet", XLSX_NS)
    selected = next((sheet for sheet in sheets if sheet.attrib.get("name") == preferred_name), sheets[0])
    rel_id = selected.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
    target = rels.get(rel_id, "")
    if target.startswith("/"):
        return target.lstrip("/")
    return f"xl/{target}" if not target.startswith("xl/") else target


def column_index(ref):
    index = 0
    for char in re.sub(r"\d", "", ref):
        index = index * 26 + ord(char.upper()) - 64
    return max(0, index - 1)


def parse_sheet_rows(xlsx_bytes):
    with zipfile.ZipFile(BytesIO(xlsx_bytes)) as workbook:
        shared_strings = read_shared_strings(workbook)
        sheet_xml = ET.fromstring(workbook.read(resolve_sheet_path(workbook)))
        rows = []
        for row in sheet_xml.findall(".//main:sheetData/main:row", XLSX_NS):
            values = []
            for cell in row.findall("main:c", XLSX_NS):
                col = column_index(cell.attrib.get("r", ""))
                value_node = cell.find("main:v", XLSX_NS)
                value = value_node.text if value_node is not None else ""
                if cell.attrib.get("t") == "s" and value:
                    value = shared_strings[int(value)]
                elif cell.attrib.get("t") == "inlineStr":
                    value = "".join(node.text or "" for node in cell.findall(".//main:t", XLSX_NS))
                while len(values) <= col:
                    values.append("")
                values[col] = clean(value)
            rows.append(values)
        return rows


def read_labeled(rows, labels, occurrence=1):
    found = 0
    for row_index, row in enumerate(rows):
        for index, value in enumerate(row):
            cell = clean(value)
            label = next((item for item in labels if item in cell), "")
            if not label:
                continue
            found += 1
            if found != occurrence:
                continue
            inline = clean(cell.replace(label, "").replace(":", "").replace("：", ""))
            if inline:
                return inline
            for offset in range(1, 8):
                if index + offset < len(row) and clean(row[index + offset]):
                    return clean(row[index + offset])
            if row_index + 1 < len(rows) and index < len(rows[row_index + 1]):
                return clean(rows[row_index + 1][index])
    return ""


def read_product(rows):
    for row_index, row in enumerate(rows[:-1]):
        if any(clean(cell) == "品名" for cell in row):
            next_row = rows[row_index + 1]
            name = clean(next_row[1] if len(next_row) > 1 else "")
            model = clean(next_row[12] if len(next_row) > 12 else "")
            color = clean(next_row[22] if len(next_row) > 22 else "")
            qty = clean(next_row[26] if len(next_row) > 26 else "")
            return " / ".join(part for part in [name, model, color, qty] if part)
    return ""


def parse_power_automate_attachment(payload):
    content = payload.get("attachmentContentBytes") or payload.get("contentBytes") or ""
    if not content:
        return {}
    if "," in content:
        content = content.split(",", 1)[1]
    rows = parse_sheet_rows(base64.b64decode(content))
    file_name = clean(payload.get("attachmentName") or payload.get("sourceFileName"))
    all_text = "\n".join(" ".join(cell for cell in row if cell) for row in rows)
    inquiry_number = read_labeled(rows, ["弊社問合番号", "問合番号", "問い合わせ番号"])
    case_id = clean(payload.get("caseId")) or (f"AIZA-{inquiry_number}" if inquiry_number else "")
    if not case_id:
        match = re.search(r"AIZA[-_ ]?\d{6,}", f"{file_name}\n{all_text}", re.I)
        case_id = match.group(0).replace("_", "-") if match else ""
    return {
        "caseId": case_id,
        "requesterName": read_labeled(rows, ["発注元名"]),
        "requesterPhone": read_labeled(rows, ["電話番号"], occurrence=1),
        "requesterAddress": read_labeled(rows, ["住所"], occurrence=1),
        "customerKana": read_labeled(rows, ["お客様カナ名"]),
        "customerName": read_labeled(rows, ["名前"]),
        "customerPhone": read_labeled(rows, ["電話番号"], occurrence=2),
        "customerAddress": read_labeled(rows, ["住所"], occurrence=2),
        "companyInquiryNumber": inquiry_number,
        "visitDate": normalize_date(read_labeled(rows, ["設置訪問日"])),
        "deliveryTimePreference": read_labeled(rows, ["訪問時間連絡"]),
        "product": read_product(rows),
        "worker": read_labeled(rows, ["担当者"]),
        "importError": read_labeled(rows, ["注意事項", "特記事項"]),
        "sourceFileName": file_name,
        "mailSubject": clean(payload.get("mailSubject")),
        "mailFrom": clean(payload.get("mailFrom")),
    }


def compact_raw_payload(payload):
    return {key: value for key, value in payload.items() if key not in {"attachmentContentBytes", "contentBytes"}}


def get_graph_access_token():
    if not MS_TENANT_ID or not MS_CLIENT_ID or not MS_CLIENT_SECRET:
        raise RuntimeError("MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET are not configured")
    data = urlencode(
        {
            "client_id": MS_CLIENT_ID,
            "client_secret": MS_CLIENT_SECRET,
            "scope": "https://graph.microsoft.com/.default",
            "grant_type": "client_credentials",
        }
    ).encode("utf-8")
    request = Request(
        f"https://login.microsoftonline.com/{quote(MS_TENANT_ID)}/oauth2/v2.0/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))["access_token"]


def graph_request(url, token):
    request = Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Prefer": 'outlook.body-content-type="text"',
        },
    )
    with urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def email_address(value):
    if isinstance(value, dict):
        return clean((value.get("emailAddress") or {}).get("address") or value.get("address"))
    return clean(value)


def message_matches_keywords(message):
    subject = clean(message.get("subject"))
    body = clean((message.get("body") or {}).get("content"))
    text = f"{subject}\n{body}"
    return any(keyword in text for keyword in MAIL_KEYWORDS)


def get_graph_attachment(base_url, message_id, attachment, token):
    if attachment.get("contentBytes"):
        return attachment
    attachment_id = attachment.get("id")
    if not attachment_id:
        return attachment
    return graph_request(f"{base_url}/messages/{quote(message_id)}/attachments/{quote(attachment_id)}", token)


def import_outlook_messages_via_graph(limit=25):
    token = get_graph_access_token()
    base_url = f"https://graph.microsoft.com/v1.0/users/{quote(OUTLOOK_MONITOR_MAILBOX)}"
    params = urlencode(
        {
            "$top": str(limit),
            "$orderby": "receivedDateTime desc",
            "$select": "id,subject,body,hasAttachments,receivedDateTime,from",
        }
    )
    messages = graph_request(f"{base_url}/messages?{params}", token).get("value", [])
    imports = []
    skipped = []
    for message in messages:
        if not message.get("hasAttachments") or not message_matches_keywords(message):
            continue
        attachments = graph_request(f"{base_url}/messages/{quote(message['id'])}/attachments", token).get("value", [])
        for attachment in attachments:
            name = clean(attachment.get("name"))
            if not name.lower().endswith(".xlsx"):
                continue
            attachment = get_graph_attachment(base_url, message["id"], attachment, token)
            content = attachment.get("contentBytes")
            if not content:
                skipped.append({"messageId": message["id"], "fileName": name, "reason": "missing contentBytes"})
                continue
            payload = {
                "attachmentName": name,
                "attachmentContentBytes": content,
                "mailSubject": clean(message.get("subject")),
                "mailFrom": email_address(message.get("from")),
                "receivedAt": clean(message.get("receivedDateTime", ""))[:16].replace("T", " "),
                "sourceMailbox": OUTLOOK_MONITOR_MAILBOX,
                "sourceMailId": message["id"],
                "sourceType": "graph_mail_excel",
                "sourceLabel": "Microsoft Graph",
            }
            try:
                case_id, case_item, confirmation = build_import_payload(payload)
                updated_at = upsert_import(case_id, case_item, confirmation, compact_raw_payload(payload))
                imports.append(
                    {
                        "caseId": case_id,
                        "updatedAt": str(updated_at),
                        "caseItem": case_item,
                        "confirmation": confirmation,
                    }
                )
            except Exception as error:
                skipped.append({"messageId": message["id"], "fileName": name, "reason": str(error)})
    return {"mailbox": OUTLOOK_MONITOR_MAILBOX, "imports": imports, "skipped": skipped}


def build_import_payload(payload):
    if isinstance(payload.get("caseItem"), dict):
        case_item = payload["caseItem"]
        case_id = normalize_case_id(case_item)
    else:
        if payload.get("attachmentContentBytes") or payload.get("contentBytes"):
            parsed = parse_power_automate_attachment(payload)
            payload = {**parsed, **{key: value for key, value in payload.items() if value not in ("", None)}}
        case_id = normalize_case_id(payload)
        customer_name = clean(payload.get("customerName")) or "未入力"
        source_label = clean(payload.get("sourceLabel")) or "Power Automate"
        requester = clean(payload.get("requesterName") or payload.get("mailFrom")) or source_label
        visit_date = clean(payload.get("visitDate"))
        source_file_name = clean(payload.get("sourceFileName"))
        case_item = {
            "id": case_id,
            "caseType": "配送",
            "deliveryType": clean(payload.get("deliveryType")) or "ハイアール",
            "workType": clean(payload.get("workType")) or "配送設置",
            "region": clean(payload.get("region")) or "関東",
            "status": "取り込み済み",
            "processState": "処理済み",
            "requesterName": requester,
            "sender": requester,
            "requesterPhone": clean(payload.get("requesterPhone")),
            "requesterAddress": clean(payload.get("requesterAddress")),
            "customerKana": clean(payload.get("customerKana")),
            "customerName": customer_name,
            "customerPhone": clean(payload.get("customerPhone")),
            "customerAddress": clean(payload.get("customerAddress")),
            "siteName": clean(payload.get("siteName")) or f"{requester} / {customer_name}",
            "visitDate": visit_date,
            "deliveryTimePreference": clean(payload.get("deliveryTimePreference")),
            "receivedAt": clean(payload.get("receivedAt")),
            "sourceType": clean(payload.get("sourceType")) or "power_automate",
            "sourceMailId": clean(payload.get("sourceMailId")),
            "sourceFileName": source_file_name,
            "sourceMailbox": clean(payload.get("sourceMailbox")) or "info_order@ithe.co.jp",
            "companyInquiryNumber": clean(payload.get("companyInquiryNumber")),
            "importError": clean(payload.get("importError")),
            "product": clean(payload.get("product")),
            "worker": clean(payload.get("worker")) or "未割当",
            "estimateAmount": int(payload.get("estimateAmount") or 0),
            "history": [f"{source_label} import: {source_file_name or case_id}"],
        }

    confirmation = payload.get("confirmation") if isinstance(payload.get("confirmation"), dict) else None
    if confirmation is None:
        confirmation = {
            "id": f"CNF-PA-{case_id}",
            "caseId": case_id,
            "source": clean(payload.get("sourceLabel")) or "Power Automate",
            "reason": "配送メール取込",
            "rawValue": clean(payload.get("sourceFileName") or payload.get("mailSubject") or case_id),
            "correctedValue": clean(case_item.get("visitDate")) or "案件確定待ち",
            "status": "unchecked",
        }
    else:
        confirmation = {**confirmation, "caseId": case_id}

    case_item = {**case_item, "id": case_id}
    return case_id, case_item, confirmation


def upsert_import(case_id, case_item, confirmation, raw_payload):
    with get_connection() as connection:
        if use_postgres():
            connection.execute(
                """
                INSERT INTO delivery_imports (case_id, case_payload, confirmation_payload, raw_payload, updated_at)
                VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (case_id) DO UPDATE SET
                    case_payload = EXCLUDED.case_payload,
                    confirmation_payload = EXCLUDED.confirmation_payload,
                    raw_payload = EXCLUDED.raw_payload,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    case_id,
                    json.dumps(case_item, ensure_ascii=False),
                    json.dumps(confirmation, ensure_ascii=False),
                    json.dumps(raw_payload, ensure_ascii=False),
                ),
            )
        else:
            connection.execute(
                """
                INSERT INTO delivery_imports (case_id, case_payload, confirmation_payload, raw_payload, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(case_id) DO UPDATE SET
                    case_payload = excluded.case_payload,
                    confirmation_payload = excluded.confirmation_payload,
                    raw_payload = excluded.raw_payload,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    case_id,
                    json.dumps(case_item, ensure_ascii=False),
                    json.dumps(confirmation, ensure_ascii=False),
                    json.dumps(raw_payload, ensure_ascii=False),
                ),
            )
        row = connection.execute(
            f"SELECT updated_at FROM delivery_imports WHERE case_id = {sql_param()}",
            (case_id,),
        ).fetchone()
        connection.commit()
    return row_value(row, "updated_at")


def list_imports():
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT case_payload, confirmation_payload, updated_at
            FROM delivery_imports
            ORDER BY updated_at DESC
            """
        ).fetchall()
    return [
        {
            "caseItem": json.loads(row_value(row, "case_payload")),
            "confirmation": json.loads(row_value(row, "confirmation_payload")),
            "updatedAt": str(row_value(row, "updated_at")),
        }
        for row in rows
    ]


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/imported-deliveries":
            json_response(self, 200, {"imports": list_imports()})
            return

        if parsed.path.startswith("/api/delivery-checklists/"):
            case_id = unquote(parsed.path.rsplit("/", 1)[-1])
            with get_connection() as connection:
                row = connection.execute(
                    f"SELECT payload, updated_at FROM delivery_checklists WHERE case_id = {sql_param()}",
                    (case_id,),
                ).fetchone()
            if row is None:
                json_response(self, 200, {"caseId": case_id, "payload": None, "updatedAt": None})
                return
            json_response(
                self,
                200,
                {
                    "caseId": case_id,
                    "payload": json.loads(row_value(row, "payload")),
                    "updatedAt": str(row_value(row, "updated_at")),
                },
            )
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/api/graph/outlook-import":
                if not require_power_automate_auth(self):
                    return
                payload = read_json(self)
                limit = int(payload.get("limit") or 25)
                json_response(self, 200, import_outlook_messages_via_graph(limit=max(1, min(limit, 50))))
                return

            if parsed.path == "/api/power-automate/delivery-import":
                if not require_power_automate_auth(self):
                    return
                payload = read_json(self)
                case_id, case_item, confirmation = build_import_payload(payload)
                updated_at = upsert_import(case_id, case_item, confirmation, compact_raw_payload(payload))
                json_response(
                    self,
                    200,
                    {
                        "caseId": case_id,
                        "updatedAt": str(updated_at),
                        "caseItem": case_item,
                        "confirmation": confirmation,
                    },
                )
                return

            if parsed.path.startswith("/api/imported-deliveries/"):
                case_id = unquote(parsed.path.rsplit("/", 1)[-1])
                payload = read_json(self)
                case_item = payload.get("caseItem")
                confirmation = payload.get("confirmation")
                if not isinstance(case_item, dict) or not isinstance(confirmation, dict):
                    json_response(self, 400, {"error": "caseItem and confirmation are required"})
                    return
                case_item = {**case_item, "id": case_id}
                confirmation = {**confirmation, "caseId": case_id}
                updated_at = upsert_import(case_id, case_item, confirmation, payload)
                json_response(self, 200, {"caseId": case_id, "updatedAt": str(updated_at)})
                return

            if not parsed.path.startswith("/api/delivery-checklists/"):
                json_response(self, 404, {"error": "Not found"})
                return

            case_id = unquote(parsed.path.rsplit("/", 1)[-1])
            payload = read_json(self)
            with get_connection() as connection:
                if use_postgres():
                    connection.execute(
                        """
                        INSERT INTO delivery_checklists (case_id, payload, updated_at)
                        VALUES (%s, %s, CURRENT_TIMESTAMP)
                        ON CONFLICT (case_id) DO UPDATE SET
                            payload = EXCLUDED.payload,
                            updated_at = CURRENT_TIMESTAMP
                        """,
                        (case_id, json.dumps(payload, ensure_ascii=False)),
                    )
                else:
                    connection.execute(
                        """
                        INSERT INTO delivery_checklists (case_id, payload, updated_at)
                        VALUES (?, ?, CURRENT_TIMESTAMP)
                        ON CONFLICT(case_id) DO UPDATE SET
                            payload = excluded.payload,
                            updated_at = CURRENT_TIMESTAMP
                        """,
                        (case_id, json.dumps(payload, ensure_ascii=False)),
                    )
                row = connection.execute(
                    f"SELECT updated_at FROM delivery_checklists WHERE case_id = {sql_param()}",
                    (case_id,),
                ).fetchone()
                connection.commit()

            json_response(self, 200, {"caseId": case_id, "updatedAt": str(row_value(row, "updated_at"))})
        except json.JSONDecodeError:
            json_response(self, 400, {"error": "Invalid JSON"})
        except ValueError as error:
            json_response(self, 400, {"error": str(error)})
        except HTTPError as error:
            json_response(self, error.code, {"error": error.read().decode("utf-8", errors="ignore")})
        except Exception as error:
            json_response(self, 500, {"error": str(error)})


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Serving on http://{HOST}:{PORT}")
    print("Database: Supabase Postgres" if use_postgres() else f"Database: {DB_PATH}")
    server.serve_forever()
