# Markdown Capture Windows Build Script (PowerShell)
# Usage: .\build-windows.ps1 [Options]

param(
    [switch]$Clean,
    [switch]$SkipTests,
    [switch]$InstallOnly,
    [string]$Architecture = "all", # all, x64, ia32
    [switch]$Portable
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Markdown Capture Windows Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: npm is not available" -ForegroundColor Red
    exit 1
}

Write-Host

# Clean previous builds
if ($Clean -or $args -contains "--clean") {
    Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    Write-Host "✓ Cleaned previous builds" -ForegroundColor Green
    Write-Host
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
if ($args -contains "--ci") {
    npm ci
} else {
    npm install
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
Write-Host

if ($InstallOnly) {
    Write-Host "Installation completed. Skipping build." -ForegroundColor Green
    exit 0
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Application built successfully" -ForegroundColor Green
Write-Host

# Run tests (unless skipped)
if (-not $SkipTests -and -not $args -contains "--skip-tests") {
    Write-Host "Running tests..." -ForegroundColor Yellow
    npm test

    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ Tests failed, but continuing with build..." -ForegroundColor Yellow
    } else {
        Write-Host "✓ Tests passed" -ForegroundColor Green
    }
    Write-Host
}

# Create distribution
Write-Host "Creating Windows distribution..." -ForegroundColor Yellow

if ($Portable) {
    Write-Host "Building portable version..." -ForegroundColor Yellow
    npm run dist:win:portable
} elseif ($Architecture -eq "x64") {
    Write-Host "Building x64 version..." -ForegroundColor Yellow
    npm run build
    electron-builder --win --x64
} elseif ($Architecture -eq "ia32") {
    Write-Host "Building x86 version..." -ForegroundColor Yellow
    npm run build
    electron-builder --win --ia32
} else {
    Write-Host "Building all Windows versions..." -ForegroundColor Yellow
    npm run dist:win
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Windows distribution failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Windows distribution created successfully" -ForegroundColor Green
Write-Host

# Show results
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " BUILD COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host

if (Test-Path "dist") {
    Write-Host "Distribution files in 'dist' folder:" -ForegroundColor Yellow
    Get-ChildItem "dist" | ForEach-Object {
        $size = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.Name) ($size MB)" -ForegroundColor White
    }
    Write-Host
}

Write-Host "To test the application:" -ForegroundColor Yellow
Write-Host "  1. Run 'dist\Markdown Capture Setup 1.0.0.exe' for installer" -ForegroundColor White
Write-Host "  2. Or run 'dist\win-unpacked\Markdown Capture.exe' for portable" -ForegroundColor White
Write-Host

# Ask to open folder
$answer = Read-Host "Open distribution folder? (y/n)"
if ($answer -eq 'y' -or $answer -eq 'yes') {
    Start-Process explorer "dist"
}

Write-Host "Build process completed successfully!" -ForegroundColor Green
Write-Host

# Show build info
Write-Host "Build Information:" -ForegroundColor Yellow
Write-Host "  Date: $(Get-Date)" -ForegroundColor White
Write-Host "  Node.js: $nodeVersion" -ForegroundColor White
Write-Host "  npm: $npmVersion" -ForegroundColor White
Write-Host "  Architecture: $Architecture" -ForegroundColor White
Write-Host