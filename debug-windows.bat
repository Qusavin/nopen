@echo off
echo.
echo ========================================
echo  Debug Windows Application
echo ========================================
echo.

echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Running application with debug output...
echo.
echo Look for these messages:
echo - "Starting initialization..."
echo - "Tray manager initialized"
echo - "Hotkey manager initialized"
echo - "Application initialized successfully"
echo.
echo If you see these messages but no tray icon, it's a Windows display issue
echo If you see errors, note them down for troubleshooting
echo.

cd dist\win-unpacked
.\Markdown Capture.exe --enable-logging --remote-debugging-port=9222

echo.
echo Debug session ended.
pause