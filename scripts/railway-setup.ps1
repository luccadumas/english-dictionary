# Railway deploy helper for English Dictionary monorepo
# Usage:
#   1. railway login
#   2. .\scripts\railway-setup.ps1

$ErrorActionPreference = "Stop"

function Require-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Command '$name' not found. Install it first."
  }
}

Require-Command railway
Require-Command node

Write-Host "Checking Railway auth..." -ForegroundColor Cyan
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run 'railway login' first, then run this script again." -ForegroundColor Yellow
  exit 1
}
Write-Host $whoami

if (-not (Test-Path ".railway")) {
  Write-Host "Linking project (select your Railway project + environment)..." -ForegroundColor Cyan
  railway link
}

$jwtSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host ""
Write-Host "=== dictionary-api ===" -ForegroundColor Green
Write-Host "Link to dictionary-api service when prompted (or run: railway service)" -ForegroundColor Gray
railway service

Write-Host "Setting API variables..." -ForegroundColor Cyan
railway variables set `
  "JWT_SECRET=$jwtSecret" `
  "JWT_EXPIRES_IN=7d" `
  "PORT=3333" `
  "NODE_ENV=production" `
  "CORS_ORIGIN=http://localhost:3000"

Write-Host ""
Write-Host "Set DATABASE_URL and REDIS_URL in Railway UI using:" -ForegroundColor Yellow
Write-Host '  DATABASE_URL=${{Postgres.DATABASE_URL}}'
Write-Host '  REDIS_URL=${{Redis.REDIS_URL}}'
Write-Host ""

Write-Host "Generating public domain for API..." -ForegroundColor Cyan
railway domain 2>$null

Write-Host "Deploying API from repo root (uses railway.toml -> backend/Dockerfile)..." -ForegroundColor Cyan
railway up --detach

Write-Host ""
Write-Host "=== dictionary-web ===" -ForegroundColor Green
Write-Host "Switch service to dictionary-web:" -ForegroundColor Yellow
Write-Host "  railway service"
Read-Host "Press Enter after selecting dictionary-web"

$apiUrl = Read-Host "Paste the API public URL (e.g. https://dictionary-api-production.up.railway.app)"
if ($apiUrl) {
  railway variables set "NEXT_PUBLIC_API_URL=$apiUrl" "NODE_ENV=production" "PORT=3000"
}

Write-Host "Deploying frontend (run from frontend folder)..." -ForegroundColor Cyan
Push-Location frontend
railway up --detach
Pop-Location

Write-Host ""
Write-Host "Done. Update API CORS_ORIGIN with the frontend URL, then redeploy API." -ForegroundColor Green
Write-Host "Import words: railway service (api) && railway run npm run import:words" -ForegroundColor Green
