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

## Render / Supabase / Microsoft Graph

Render uses `render.yaml` and installs Python dependencies from `requirements.txt`.

Set these environment variables in Render:

```text
DATABASE_URL=Supabase Postgres connection string
POWER_AUTOMATE_SECRET=shared bearer token for protected import APIs
OUTLOOK_MONITOR_MAILBOX=info_order@ithe.co.jp
MS_TENANT_ID=Microsoft Entra tenant ID
MS_CLIENT_ID=Microsoft Entra application client ID
MS_CLIENT_SECRET=Microsoft Entra application client secret
```

Microsoft Graph import endpoint:

```text
POST https://<render-service-url>/api/graph/outlook-import
Authorization: Bearer <POWER_AUTOMATE_SECRET>
Content-Type: application/json
```

Request body:

```json
{
  "limit": 25
}
```

The Graph import reads recent Outlook messages from `OUTLOOK_MONITOR_MAILBOX`, finds messages containing `[商品交換依頼]` or `[商品回収依頼]`, parses attached AIZA Excel files, and stores delivery imports in Supabase.

Power Automate compatibility endpoint:

```text
POST https://<render-service-url>/api/power-automate/delivery-import
Authorization: Bearer <POWER_AUTOMATE_SECRET>
Content-Type: application/json
```

For the fixed-format AIZA Excel sheet, send the attachment content and let the Render API parse it:

```json
{
  "attachmentName": "AIZA01143799.xlsx",
  "attachmentContentBytes": "<Power Automate attachment content bytes>",
  "mailSubject": "[商品交換依頼] 配送依頼",
  "mailFrom": "sender@example.com"
}
```

The app reads imported delivery cases from `GET /api/imported-deliveries`. Local development falls back to SQLite when `DATABASE_URL` is not set. Use the Supabase PostgreSQL connection string with SSL enabled.

## Vercel preview while developing

Install and log in to the Vercel CLI once:

```powershell
npm.cmd install
npx.cmd vercel login
```

Create a public preview deployment:

```powershell
npx.cmd vercel
```

Deploy the current state to production:

```powershell
npx.cmd vercel --prod
```

The public Vercel URL can be opened from tablets and phones. The SQLite-backed Python API is for local development only; on Vercel, checklist edits fall back to browser storage so the public preview remains usable.

## GitHub Pages preview while developing

GitHub Pages is the preferred fallback when Vercel is unavailable. After the repository is pushed to GitHub, every push to `master` or `main` deploys `index.html`, `app.js`, and `styles.css` automatically.

Create and push a GitHub repository:

```powershell
gh auth login -h github.com
.\publish-github.ps1
```

To use a different repository name:

```powershell
.\publish-github.ps1 -RepoName your-repo-name
```

For later updates:

```powershell
git add .
git commit -m "Update app"
git push origin master
```

The public URL will be shown in the repository's `Actions` page after the `Deploy static site to GitHub Pages` workflow completes.

## Git policy

Runtime files such as SQLite databases, logs, Playwright videos, and generated screenshots are ignored. Commit source files and documentation only.
