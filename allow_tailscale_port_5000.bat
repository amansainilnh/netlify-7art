@echo off
setlocal enabledelayedexpansion
title 7 ART TAILORS - Open Windows Firewall for Tailscale & Wi-Fi

:: Auto-elevate to Administrator with UAC prompt if not already elevated
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ====================================================================
    echo   Requesting Administrator Privileges to Unlock Windows Firewall...
    echo ====================================================================
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"
echo ====================================================================
echo   7 ART TAILORS - Open Port 5000 in Windows Firewall
echo ====================================================================
echo.
echo Enabling inbound TCP port 5000 so phones & tablets can connect...
echo.

netsh advfirewall firewall delete rule name="7_Art_Studio_Port_5000" >nul 2>&1
netsh advfirewall firewall add rule name="7_Art_Studio_Port_5000" dir=in action=allow protocol=TCP localport=5000 profile=any >nul 2>&1

for /f "delims=" %%P in ('where python 2^>nul') do (
    netsh advfirewall firewall delete rule name="7_Art_Studio_Python" >nul 2>&1
    netsh advfirewall firewall add rule name="7_Art_Studio_Python" dir=in action=allow program="%%P" enable=yes profile=any >nul 2>&1
)

powershell -Command "Get-NetConnectionProfile | Where-Object { $_.InterfaceAlias -like '*Wi-Fi*' -or $_.InterfaceAlias -like '*Wireless*' } | Set-NetConnectionProfile -NetworkCategory Private" >nul 2>&1

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo [SUCCESS] Windows Firewall is now OPEN for Port 5000!
    echo ================================================================
    echo.
    echo Your devices can now connect smoothly via:
    echo   - Tailscale IP:  http://100.99.162.118:5000
    echo   - Local Wi-Fi:   http://192.168.1.86:5000
    echo.
) else (
    echo [NOTE] Please grant Administrator permission when prompted.
)

pause
