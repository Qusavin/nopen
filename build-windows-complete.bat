@echo off
echo.
echo ========================================
echo  Markdown Capture Windows Build Complete
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js:
node --version
echo npm:
npm --version
echo.

REM Clean previous builds
echo Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist "out" rmdir /s /q "out"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
echo Cleaned previous builds
echo.

REM Install dependencies
echo Installing dependencies...
npm ci
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully
echo.

REM Build application
echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Application built successfully
echo.

REM Check if out directory exists
if not exist "out" (
    echo ERROR: Build output directory not found
    pause
    exit /b 1
)

REM Show build results
echo Build output:
dir /s out\*.js | findstr /C:"bytes"
echo.

REM Create Windows distributions
echo Creating Windows distributions...
echo.

echo 1. Building Windows x64 installer...
npm run dist:win
if %errorlevel% neq 0 (
    echo ERROR: Windows x64 build failed
    pause
    exit /b 1
)
echo Windows x64 installer created
echo.

echo 2. Building Windows x86 installer...
npx electron-builder --win --ia32
if %errorlevel% neq 0 (
    echo WARNING: Windows x86 build failed (optional)
)
echo.

echo 3. Building Windows portable...
npm run dist:win:portable
if %errorlevel% neq 0 (
    echo WARNING: Portable build failed
)
echo.

REM Check if dist directory exists and show results
if exist "dist" (
    echo ========================================
    echo  BUILD COMPLETE!
    echo ========================================
    echo.
    echo Distribution files created:
    dir /b dist
    echo.

    REM Show file sizes
    echo File sizes:
    for %%f in (dist\*.exe) do (
        echo   %%~nxf: %%~zf bytes
    )
    echo.

    REM Test the unpacked version
    if exist "dist\win-unpacked\Markdown Capture.exe" (
        echo Testing unpacked application...
        start "" /wait "dist\win-unpacked\Markdown Capture.exe" --enable-logging --version
        echo Test completed
        echo.
    )

    echo ========================================
    echo  Installation Instructions:
    echo ========================================
    echo.
    echo For End Users:
    echo   - Use: "Markdown Capture Setup 1.0.0.exe" (x64)
    echo   - Or: "Markdown Capture Setup 1.0.0.exe" (x86)
    echo.
    echo For Portable Use:
    echo   - Use: "markdown-capture-1.0.0-win32-x64-portable.exe"
    echo.
    echo For Testing:
    echo   - Use: "dist\win-unpacked\Markdown Capture.exe"
    echo.

    REM Ask to open folder
    set /p answer="Open distribution folder? (y/n): "
    if /i "%answer%"=="y" (
        explorer dist
    )

    echo.
    echo Build process completed successfully!
    echo The application is ready for Windows distribution.

) else (
    echo ERROR: No distribution files created
    pause
    exit /b 1
)

pause