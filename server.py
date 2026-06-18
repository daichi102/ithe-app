from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
import json
import os
import sqlite3


ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("ITHE_DB_PATH", ROOT / "ithe_app.db")).resolve()
HOST = os.environ.get("ITHE_HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", os.environ.get("ITHE_PORT", "8000")))


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS delivery_checklists (
            case_id TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        )
        """
    )
    return connection


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/delivery-checklists/"):
            case_id = unquote(parsed.path.rsplit("/", 1)[-1])
            with get_connection() as connection:
                row = connection.execute(
                    "SELECT payload, updated_at FROM delivery_checklists WHERE case_id = ?",
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
                    "payload": json.loads(row["payload"]),
                    "updatedAt": row["updated_at"],
                },
            )
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/delivery-checklists/"):
            json_response(self, 404, {"error": "Not found"})
            return

        case_id = unquote(parsed.path.rsplit("/", 1)[-1])
        length = int(self.headers.get("Content-Length", "0"))
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except json.JSONDecodeError:
            json_response(self, 400, {"error": "Invalid JSON"})
            return

        with get_connection() as connection:
            connection.execute(
                """
                INSERT INTO delivery_checklists (case_id, payload, updated_at)
                VALUES (?, ?, datetime('now', 'localtime'))
                ON CONFLICT(case_id) DO UPDATE SET
                    payload = excluded.payload,
                    updated_at = datetime('now', 'localtime')
                """,
                (case_id, json.dumps(payload, ensure_ascii=False)),
            )
            row = connection.execute(
                "SELECT updated_at FROM delivery_checklists WHERE case_id = ?",
                (case_id,),
            ).fetchone()

        json_response(self, 200, {"caseId": case_id, "updatedAt": row["updated_at"]})


if __name__ == "__main__":
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection():
        pass
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Serving on http://{HOST}:{PORT}")
    print(f"Database: {DB_PATH}")
    server.serve_forever()
