@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo     ZX CLI Installer for Windows
echo ========================================
echo.

REM Check Node.js installation and version
echo [1/2] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is not installed.
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version for Windows.
    echo.
    echo After installation, run this script again.
    goto :exit
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [✓] Node.js is installed: !NODE_VERSION!

REM Check if version is adequate (Node 14+)
set NODE_MAJOR=!NODE_VERSION:~1,2!
if !NODE_MAJOR! lss 14 (
    echo [X] Node.js version !NODE_VERSION! is too old. Please upgrade to Node.js 14 or higher.
    echo Download from: https://nodejs.org/
    goto :exit
)

echo [✓] Node.js version is compatible.
echo.

REM Check if ZX CLI is installed
echo [2/2] Checking ZX CLI installation...
where zx >nul 2>&1
if errorlevel 1 goto :install_zx

echo [✓] ZX CLI is already installed.
goto :check_updates

:install_zx
echo [ ] ZX CLI is not installed.
echo Installing ZX CLI...
echo.

REM Install ZX CLI globally
echo Running: npm install -g zxcli
call npm install -g zxcli
if errorlevel 1 goto :install_failed

echo.
echo [✓] ZX CLI installed successfully!
goto :success

:install_failed
echo [X] Failed to install ZX CLI.
echo.
echo This might happen if:
echo - The package is not yet published to NPM
echo - You have network connectivity issues
echo - You need to run this as Administrator
echo.
echo You can try installing manually with: npm install -g zxcli
goto :exit

:check_updates
REM Check if it's the latest version
echo Checking for updates...
npm view zxcli version >nul 2>&1
if errorlevel 1 (
    echo [i] Cannot check for updates (package may not be published yet).
    goto :success
)

for /f "tokens=*" %%i in ('npm view zxcli version') do set LATEST_VERSION=%%i
for /f "tokens=*" %%i in ('zx --version 2^>nul') do set CURRENT_VERSION=%%i

REM Simple version comparison (this is basic, could be improved)
if "!CURRENT_VERSION!"=="!LATEST_VERSION!" (
    echo [✓] ZX CLI is up to date ^(!CURRENT_VERSION!^).
    goto :success
) else (
    echo [ ] Updating ZX CLI from !CURRENT_VERSION! to !LATEST_VERSION!...
    npm install -g zxcli
    if %errorlevel% neq 0 (
        echo [X] Failed to update ZX CLI.
        goto :success
    ) else (
        echo [✓] ZX CLI updated successfully!
        goto :success
    )
)

:success
echo.
echo ========================================
echo     Installation Complete!
echo ========================================
echo.
echo You can now use ZX CLI with these commands:
echo.
echo   zx hello          - Test the installation
echo   zx --help         - Show available commands
echo   zx --version      - Show version information
echo.
echo For npm script delegation in projects with package.json:
echo   zx build          - Runs: npm run build
echo   zx test           - Runs: npm run test
echo.
echo Happy coding! 🚀
echo.

:exit
echo Press any key to exit...
pause >nul
endlocal
