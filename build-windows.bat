@echo off
echo.
echo ========================================
echo  Markdown Capture Windows Build Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check npm version
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

REM Clean previous builds
echo Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist "out" rmdir /s /q "out"
echo Cleaned previous builds
echo.

REM Install dependencies
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully
echo.

REM Build the application
echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Application built successfully
echo.

REM Create Windows distribution
echo Creating Windows distribution...
npm run dist:win
if %errorlevel% neq 0 (
    echo ERROR: Windows distribution failed
    pause
    exit /b 1
)
echo Windows distribution created successfully
echo.

REM Show results
echo.
echo ========================================
echo  BUILD COMPLETE!
echo ========================================
echo.
echo Distribution files created in 'dist' folder:
dir /b dist
echo.
echo To test the application:
echo 1. Run 'dist\Markdown Capture Setup 1.0.0.exe' for installer
echo 2. Or run 'dist\win-unpacked\Markdown Capture.exe' for portable version
echo.
echo Press any key to open the dist folder...
pause >nul
explorer dist
echo.
echo Build process completed successfully!