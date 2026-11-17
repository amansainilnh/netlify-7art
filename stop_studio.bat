@echo off
cd /d "%~dp0"
title Stopping 7 Art Studio Suite...

echo ====================================================================
echo   7 ART TAILORS - STOPPING STUDIO ENGINE AND TUNNELS
echo ====================================================================
echo.

echo [*] Closing Studio server processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Closing any open SSH tunnels...
taskkill /F /IM ssh.exe >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *OpenSSH*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *ssh.exe*" >nul 2>&1

echo [*] Closing Studio server console windows...
taskkill /F /FI "WINDOWTITLE eq 7 Art Tailors - Studio Engine*" >nul 2>&1

echo.
echo [OK] 7 Art Studio Engine and SSH Tunnels stopped successfully!
ping 127.0.0.1 -n 3 >nul
exit
