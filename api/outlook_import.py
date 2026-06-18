from http.server import BaseHTTPRequestHandler
from io import BytesIO
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import base64
import json
import os
import re
import zipfile
import xml.etree.ElementTree as ET


MAILBOX = os.environ.get("OUTLOOK_MONITOR_MAILBOX", "info_order@ithe.co.jp")
KEYWORDS = ["[商品交換依頼]", "[商品回収依頼]"]
NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def graph_request(url, token):
    request = Request(url, headers={"Authorization": f"Bearer {token}", "Prefer": 'outlook.body-content-type="text"'})
    with urlopen(request, timeout=25) as response:
        return json.loads(response.read().decode("utf-8"))


def get_access_token():
    tenant_id = os.environ.get("MS_TENANT_ID")
    client_id = os.environ.get("MS_CLIENT_ID")
    client_secret = os.environ.get("MS_CLIENT_SECRET")
    if not tenant_id or not client_id or not client_secret:
        raise RuntimeError("MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET が未設定です")

    data = urlencode(
        {
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": "https://graph.microsoft.com/.default",
            "grant_type": "client_credentials",
        }
    ).encode("utf-8")
    request = Request(
        f"https://login.microsoftonline.com/{quote(tenant_id)}/oauth2/v2.0/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urlopen(request, timeout=25) as response:
        return json.loads(response.read().decode("utf-8"))["access_token"]


def clean(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def normalize_date(value):
    text = clean(value)
    match = re.search(r"(\d{4})[/-](\d{1,2})[/-](\d{1,2})", text)
    if match:
        return f"{match.group(1)}-{match.group(2).zfill(2)}-{match.group(3).zfill(2)}"
    return ""


def read_shared_strings(workbook):
    try:
        xml = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    values = []
    for item in xml.findall("main:si", NS):
        values.append("".join(node.text or "" for node in item.findall(".//main:t", NS)))
    return values


def resolve_aiza_sheet(workbook):
    workbook_xml = ET.fromstring(workbook.read("xl/workbook.xml"))
    rels_xml = ET.fromstring(workbook.read("xl/_rels/workbook.xml.rels"))
    rels = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels_xml.findall("rel:Relationship", NS)}
    for sheet in workbook_xml.findall("main:sheets/main:sheet", NS):
        if sheet.attrib.get("name") == "アイザ":
            rel_id = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
            target = rels.get(rel_id, "")
            if target.startswith("/"):
                return target.lstrip("/")
            return f"xl/{target}" if not target.startswith("xl/") else target
    raise RuntimeError("Excel内に「アイザ」シートがありません")


def parse_sheet_rows(xlsx_bytes):
    with zipfile.ZipFile(BytesIO(xlsx_bytes)) as workbook:
        shared_strings = read_shared_strings(workbook)
        sheet_path = resolve_aiza_sheet(workbook)
        sheet_xml = ET.fromstring(workbook.read(sheet_path))
        rows = []
        for row in sheet_xml.findall(".//main:sheetData/main:row", NS):
            values = []
            for cell in row.findall("main:c", NS):
                ref = cell.attrib.get("r", "")
                col = 0
                for char in re.sub(r"\d", "", ref):
                    col = col * 26 + ord(char.upper()) - 64
                col = max(0, col - 1)
                value_node = cell.find("main:v", NS)
                value = value_node.text if value_node is not None else ""
                if cell.attrib.get("t") == "s" and value:
                    value = shared_strings[int(value)]
                while len(values) <= col:
                    values.append("")
                values[col] = clean(value)
            rows.append(values)
        return rows


def read_labeled(rows, labels):
    for row in rows:
        for index, value in enumerate(row):
            cell = clean(value)
            label = next((item for item in labels if item in cell), "")
            if not label:
                continue
            inline = clean(cell.replace(label, "").replace(":", "").replace("：", ""))
            if inline:
                return inline
            for offset in range(1, 4):
                if index + offset < len(row) and clean(row[index + offset]):
                    return clean(row[index + offset])
    return ""


def make_payload(file_name, rows, message):
    full_text = "\n".join(" ".join(cell for cell in row if cell) for row in rows)
    case_id = (
        read_labeled(rows, ["案件番号", "受付番号", "管理番号", "問い合わせ番号", "問合せ番号"])
        or (re.search(r"AIZA[-_ ]?\d{6,}", full_text, re.I).group(0).replace("_", "-") if re.search(r"AIZA[-_ ]?\d{6,}", full_text, re.I) else "")
        or f"AIZA-{message['id'][-8:]}"
    )
    customer_name = read_labeled(rows, ["お客様名", "顧客名", "氏名", "名前"]) or "未入力"
    visit_raw = read_labeled(rows, ["配送日", "訪問設置日", "設置日", "希望日", "納品日"])
    visit_date = normalize_date(visit_raw)
    requester = read_labeled(rows, ["依頼主", "送信元", "販売店", "会社名"]) or "Outlook"
    case_item = {
        "id": case_id,
        "caseType": "配送",
        "deliveryType": "ハイアール",
        "workType": "配送設置",
        "region": "関東",
        "status": "取り込み済み",
        "processState": "処理済み",
        "requesterName": requester,
        "sender": message.get("from", {}).get("emailAddress", {}).get("address", "Outlook"),
        "requesterPhone": "",
        "requesterAddress": "",
        "customerKana": "",
        "customerName": customer_name,
        "customerPhone": read_labeled(rows, ["お客様電話", "電話番号", "TEL", "携帯"]),
        "customerAddress": read_labeled(rows, ["お客様住所", "住所", "配送先", "納品先"]),
        "siteName": f"{requester} / {customer_name}",
        "visitDate": visit_date,
        "receivedAt": (message.get("receivedDateTime") or "")[:16].replace("T", " "),
        "sourceType": "mail_excel",
        "sourceMailId": message["id"],
        "sourceFileName": file_name,
        "sourceMailbox": MAILBOX,
        "companyInquiryNumber": "",
        "importError": "",
        "product": read_labeled(rows, ["商品情報", "商品名", "型番", "品名"]),
        "worker": "未割当",
        "estimateAmount": 0,
        "history": [f"Outlook Excel取り込み: {file_name}"],
    }
    confirmation = {
        "id": f"CNF-GRAPH-{message['id'][-10:]}",
        "caseId": case_id,
        "source": "Outlookメール",
        "reason": "本文キーワード一致・アイザシート取込",
        "rawValue": file_name,
        "correctedValue": visit_date or "配送日未設定",
        "status": "unchecked",
    }
    return {"caseItem": case_item, "confirmation": confirmation}


def import_messages():
    token = get_access_token()
    base = f"https://graph.microsoft.com/v1.0/users/{quote(MAILBOX)}"
    params = urlencode(
        {
            "$top": "25",
            "$orderby": "receivedDateTime desc",
            "$select": "id,subject,body,hasAttachments,receivedDateTime,from",
        }
    )
    messages = graph_request(f"{base}/messages?{params}", token).get("value", [])
    imports = []
    for message in messages:
        body = clean((message.get("body") or {}).get("content", ""))
        if not message.get("hasAttachments") or not any(keyword in body for keyword in KEYWORDS):
            continue
        attachments = graph_request(f"{base}/messages/{quote(message['id'])}/attachments", token).get("value", [])
        for attachment in attachments:
            name = attachment.get("name", "")
            if not name.lower().endswith(".xlsx"):
                continue
            if not attachment.get("contentBytes"):
                attachment = graph_request(f"{base}/messages/{quote(message['id'])}/attachments/{quote(attachment['id'])}", token)
            if not attachment.get("contentBytes"):
                continue
            rows = parse_sheet_rows(base64.b64decode(attachment["contentBytes"]))
            imports.append(make_payload(name, rows, message))
    return imports


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            json_response(self, 200, {"mailbox": MAILBOX, "imports": import_messages()})
        except HTTPError as error:
            json_response(self, error.code, {"error": error.read().decode("utf-8", errors="ignore")})
        except Exception as error:
            json_response(self, 500, {"error": str(error)})
