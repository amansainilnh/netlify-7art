@echo off
cd /d "%~dp0"
title Connecting AI Browser Agent...

echo ====================================================================
echo   7 ART TAILORS - AI BROWSER AGENT CONNECTION
echo ====================================================================
echo.
echo Restarting Chrome with AI Agent Remote Debugging on port 9222...

netstat -ano | findstr :5000 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo [*] Starting Studio Server on port 5000...
    start "" /b cmd /c "python backend\server.py 5000"
    ping 127.0.0.1 -n 3 >nul
)

set "CHROME_EXE="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_EXE=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_EXE=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_EXE=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) else (
    set "CHROME_EXE=chrome"
)

echo [*] Resetting Chrome instance for agent attachment...
taskkill /F /IM chrome.exe >nul 2>&1
ping 127.0.0.1 -n 3 >nul

echo [*] Opening Chrome with Remote Debugging on port 9222...
start "" "%CHROME_EXE%" --remote-debugging-port=9222 "http://localhost:5000"
ping 127.0.0.1 -n 3 >nul
exit /b 0
