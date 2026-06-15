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

Write-Host "Deploying API from repo root (uses railway.toml -> Dockerfile)..." -ForegroundColor Cyan
railway up --detach

Write-Host ""
Write-Host "=== dictionary-web ===" -ForegroundColor Green
railway service link dictionary-web

$apiUrl = "https://dictionary-api-production-d35d.up.railway.app"
Write-Host "Setting web variables (API: $apiUrl)..." -ForegroundColor Cyan
railway variables set "NEXT_PUBLIC_API_URL=$apiUrl" "NODE_ENV=production" "PORT=3000"

Write-Host "Generating public domain for web..." -ForegroundColor Cyan
railway domain 2>$null

Write-Host "Deploying frontend (frontend/ as archive root)..." -ForegroundColor Cyan
railway up ./frontend --path-as-root --detach -y

Write-Host ""
Write-Host "In Railway UI for dictionary-web (GitHub autodeploy):" -ForegroundColor Yellow
Write-Host "  Settings -> Config file: /railway.web.toml"
Write-Host "  Or Root Directory: frontend + Config file: /frontend/railway.toml"
Write-Host ""
Write-Host "Update API CORS_ORIGIN with the web URL, then redeploy API." -ForegroundColor Green
Write-Host "Import words: railway service (api) && railway run npm run import:words" -ForegroundColor Green
