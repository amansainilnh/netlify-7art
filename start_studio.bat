@echo off
if "%1"=="open_browser" (
    timeout /t 2 /nobreak >nul
    if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
        start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:5000"
        exit /b
    )
    if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
        start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://localhost:5000"
        exit /b
    )
    if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
        start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "http://localhost:5000"
        exit /b
    )
    if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
        start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "http://localhost:5000"
        exit /b
    )
    if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
        start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "http://localhost:5000"
        exit /b
    )
    start explorer.exe "http://localhost:5000"
    exit /b
)

if not "%1"=="min" (
    start /min "" "%~f0" min
    exit /b
)

cd /d "%~dp0"
title 7 Art Tailors - Studio Engine

:: Launch Chrome / Edge in background after 2 seconds warm-up
start "" /b "%~f0" open_browser

:: Start Studio Python Server
python -u backend\server.py 5000

if %errorlevel% neq 0 (
    pause
)
