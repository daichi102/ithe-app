param(
  [string]$RepoName = "ithe-app",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is not installed. Install gh first."
}

gh auth status | Out-Null

$remote = git remote get-url origin 2>$null

if (-not $remote) {
  gh repo create $RepoName --$Visibility --source . --remote origin --push
} else {
  git push -u origin (git branch --show-current)
}

Write-Host ""
Write-Host "Repository:"
gh repo view --web

