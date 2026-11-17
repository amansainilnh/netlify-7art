# 7 ART TAILORS - Studio Background Launcher
$ErrorActionPreference = "SilentlyContinue"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
Set-Location -Path $scriptDir

# Ensure logs directory exists inside logs/ folder so root is clean
$logsDir = Join-Path $scriptDir "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

# 1. Check if server is already running on port 5000
$isListening = $false
try {
    $conn = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
    if ($conn) { $isListening = $true }
} catch {
    $isListening = $false
}

# 2. If not running, start Python server completely hidden
if (-not $isListening) {
    $env:PYTHONIOENCODING = "utf-8"
    $pythonCmd = (Get-Command python -ErrorAction SilentlyContinue).Source
    if (-not $pythonCmd) { $pythonCmd = "python" }

    $stdoutFile = Join-Path $logsDir "server.log"
    $stderrFile = Join-Path $logsDir "server_error.log"

    Start-Process -FilePath $pythonCmd `
        -ArgumentList "-u backend\server.py 5000" `
        -WorkingDirectory $scriptDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdoutFile `
        -RedirectStandardError $stderrFile

    # Brief warm-up to let HTTP and Tunnel initialize
    Start-Sleep -Seconds 2
}

# 3. Launch Chrome / Edge / default browser to localhost:5000
$url = "http://localhost:5000"
$browsers = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$launched = $false
foreach ($b in $browsers) {
    if (Test-Path $b) {
        Start-Process -FilePath $b -ArgumentList $url
        $launched = $true
        break
    }
}

if (-not $launched) {
    Start-Process -FilePath $url
}

