# PowerShell скрипт для развертывания Delfin

Write-Host "🚀 Starting deployment of Delfin website..." -ForegroundColor Cyan

# Проверка наличия node_modules
if (-Not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
}

# Сборка проекта
Write-Host "📦 Building project with standalone mode..." -ForegroundColor Yellow
npm run build:standalone

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Проверка наличия папки public в standalone
if (Test-Path ".next/standalone/public") {
    Write-Host "✅ Public folder copied to standalone build" -ForegroundColor Green
} else {
    Write-Host "⚠️  Public folder not found in standalone build. Copying manually..." -ForegroundColor Yellow
    Copy-Item -Path "public" -Destination ".next/standalone/public" -Recurse -Force
}

# Проверка наличия статических файлов
Write-Host "🔍 Checking static files..." -ForegroundColor Yellow

$staticFiles = @(
    "public/showroom_video.mp4",
    "public/logo-delfin.png",
    "public/catalog.pdf"
)

foreach ($file in $staticFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy .next/standalone/, .next/static/, and public/ to your server"
Write-Host "2. On server, run: NODE_ENV=production node server.js"
Write-Host ""
Write-Host "For more details, see DEPLOYMENT.md" -ForegroundColor Green

