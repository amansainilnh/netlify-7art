@echo off
setlocal enabledelayedexpansion
title 7 ART TAILORS - Unlock Wi-Fi & Tailscale (Port 5000)

:: 1. Auto-elevate to Administrator with UAC prompt if not already elevated
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
echo.
echo ====================================================================
echo   7 ART TAILORS - OPENING FIREWALL & WI-FI FOR PHONES / TABLETS
echo ====================================================================
echo.

:: 2. Delete and re-create Inbound TCP Rule for Port 5000 across all profiles
echo [1/3] Configuring Port 5000 Inbound Firewall Rule...
netsh advfirewall firewall delete rule name="7_Art_Studio_Port_5000" >nul 2>&1
netsh advfirewall firewall add rule name="7_Art_Studio_Port_5000" dir=in action=allow protocol=TCP localport=5000 profile=any >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Port 5000 is now ALLOWED on all network profiles!
) else (
    echo       [WARNING] netsh port rule failed.
)

:: 3. Whitelist Python executable in Windows Firewall
echo [2/3] Whitelisting Python runtime in Windows Firewall...
for /f "delims=" %%P in ('where python 2^>nul') do (
    netsh advfirewall firewall delete rule name="7_Art_Studio_Python" >nul 2>&1
    netsh advfirewall firewall add rule name="7_Art_Studio_Python" dir=in action=allow program="%%P" enable=yes profile=any >nul 2>&1
    echo       [OK] Allowed: %%P
)

:: 4. Set Wi-Fi network profile to Private so Windows allows local LAN sharing
echo [3/3] Setting Wi-Fi profile to Private (allowing local device sharing)...
powershell -Command "Get-NetConnectionProfile | Where-Object { $_.InterfaceAlias -like '*Wi-Fi*' -or $_.InterfaceAlias -like '*Wireless*' } | Set-NetConnectionProfile -NetworkCategory Private" >nul 2>&1
echo       [OK] Local network profile updated.

echo.
echo ====================================================================
echo   SUCCESS! In-Shop Wi-Fi and Tailscale Mesh are now UNLOCKED!
echo ====================================================================
echo.
echo   You can now connect devices smoothly:
echo   - Local Wi-Fi Address :  http://192.168.1.86:5000
echo   - Tailscale Address    :  http://100.99.162.118:5000
echo.
echo   Press any key to close this window...
pause >nul
exit /b

