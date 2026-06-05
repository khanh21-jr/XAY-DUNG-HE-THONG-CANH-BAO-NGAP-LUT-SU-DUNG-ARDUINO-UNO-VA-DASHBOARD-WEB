param(
  [string]$SerialPort = "COM3"
)

$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$backendDir = Join-Path $projectRoot "backend"
$requirementsFile = Join-Path $backendDir "requirements.txt"

if (-not (Test-Path $backendDir)) {
  throw "Không tìm thấy thư mục backend: $backendDir"
}

if (-not (Test-Path $requirementsFile)) {
  throw "Không tìm thấy file requirements.txt: $requirementsFile"
}

Write-Host "Kiểm tra thư viện Python..." -ForegroundColor Cyan
python -c "import flask, serial" 2>$null

if ($LASTEXITCODE -ne 0) {
  Write-Host "Thiếu thư viện. Đang cài từ backend/requirements.txt..." -ForegroundColor Yellow
  python -m pip install -r $requirementsFile
}

$env:SERIAL_PORT = $SerialPort

Write-Host ""
Write-Host "Đang chạy Flood Warning Dashboard" -ForegroundColor Green
Write-Host "URL: http://127.0.0.1:5001"
Write-Host "Chế độ: Arduino tại cổng $SerialPort"
Write-Host "Nhấn Ctrl+C để dừng server."
Write-Host ""

Set-Location $backendDir
python app.py
