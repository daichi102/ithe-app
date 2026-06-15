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
gh repo create ithe-app --public --source . --remote origin --push
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
