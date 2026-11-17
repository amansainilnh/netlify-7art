@echo off
cd /d "%~dp0"
title 7 ART TAILORS - Worldwide Studio & Online Anywhere Tunnel
cls
echo ====================================================================
echo   7 ART TAILORS - WORLDWIDE ONLINE ANYWHERE SUITE
echo   Zero-Password Secure Public HTTPS Tunnel
echo ====================================================================
echo.

:: 1. Ensure the Studio Python server is running on port 5000
netstat -ano | findstr :5000 >nul
if %errorlevel% neq 0 (
    echo [1/2] Starting 7 Art Studio Engine on port 5000...
    start /min "7 Art Studio Server" python backend\server.py 5000
    timeout /t 3 /nobreak >nul
) else (
    echo [1/2] 7 Art Studio Engine is active and ready on port 5000.
)

echo.
echo [2/2] Launching Public HTTPS Web Tunnel...
echo --------------------------------------------------------------------
echo * Zero-Password: No password or signup required.
echo * Worldwide: Open the generated HTTPS link on ANY phone, tablet, or PC!
echo * Keep this black window OPEN in the background while using it.
echo --------------------------------------------------------------------
echo.

python -u backend\tunnel_runner.py
pause
