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
railway service link dictionary-api

Write-Host "Setting API variables..." -ForegroundColor Cyan
railway variables set `
  "JWT_SECRET=$jwtSecret" `
  "JWT_EXPIRES_IN=7d" `
  "PORT=3333" `
  "NODE_ENV=production" `
  "CORS_ORIGIN=https://english-dictionary-web.vercel.app"

Write-Host ""
Write-Host "Set database variables in Railway (if not set yet):" -ForegroundColor Yellow
Write-Host '  DATABASE_URL=${{Postgres.DATABASE_URL}}'
Write-Host '  REDIS_URL=${{Redis.REDIS_URL}}'
Write-Host ""

Write-Host "Generating public domain for API..." -ForegroundColor Cyan
railway domain 2>$null

Write-Host "Deploying API (root Dockerfile + railway.toml)..." -ForegroundColor Cyan
railway redeploy --from-source -y

Write-Host ""
Write-Host "=== Vercel (frontend) ===" -ForegroundColor Green
Write-Host "Deploy frontend separately:" -ForegroundColor Yellow
Write-Host "  cd frontend"
Write-Host "  vercel link --yes -p english-dictionary-web"
Write-Host '  echo "https://your-api.up.railway.app" | vercel env add NEXT_PUBLIC_API_URL production'
Write-Host "  vercel --prod"
Write-Host ""
Write-Host "Import words: bash scripts/import-words.sh   (or: npm run import:words:remote)" -ForegroundColor Green
