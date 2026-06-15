# ithe_app

Static HTML/CSS/JavaScript application served by a small Python HTTP server.

## Development

```powershell
python server.py
```

Open:

```text
http://127.0.0.1:8000
```

## Production-side development

Use environment variables so the production host, port, and database path are not hard-coded.

```powershell
$env:ITHE_HOST = "0.0.0.0"
$env:ITHE_PORT = "8000"
$env:ITHE_DB_PATH = "C:\ithe\ithe_app_data\ithe_app.db"
python server.py
```

For local-only settings, copy `.env.example` to `.env` as a memo. The server reads OS environment variables directly.

## Git policy

Runtime files such as SQLite databases, logs, Playwright videos, and generated screenshots are ignored. Commit source files and documentation only.
