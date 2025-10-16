# Windows Build Guide

This guide explains how to build the Markdown Capture application for Windows.

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Use LTS version recommended
   - Verify installation: `node --version`

2. **Visual Studio Build Tools** (or Visual Studio Community)
   - Download from: https://visualstudio.microsoft.com/downloads/
   - Select "Build Tools for Visual Studio" during installation
   - Required components:
     - C++ build tools
     - Windows SDK
     - MSVC v143 build tools

3. **Git** (optional but recommended)
   - Download from: https://git-scm.com/

### Environment Setup
```powershell
# Verify Node.js installation
node --version  # Should be v18+
npm --version   # Should be 9+

# Set npm registry (optional but recommended for faster builds)
npm config set registry https://registry.npmjs.org/
```

## Build Process

### 1. Get the Source Code
```powershell
# Option A: Clone from Git
git clone <repository-url>
cd markdown-capture

# Option B: Download and extract ZIP file
```

### 2. Install Dependencies
```powershell
# Clean install to avoid conflicts
npm ci
# or if ci is not available
npm install
```

### 3. Build the Application
```powershell
# Option A: Quick build (TypeScript + Vite)
npm run build

# Option B: Full build with linting (requires ESLint setup)
npm run build

# Option C: Development build
npm run dev
```

### 4. Create Windows Distribution
```powershell
# Build Windows installer (x64 and x86)
npm run dist:win

# Build only x64 version
npm run build && electron-builder --win --x64

# Build only x86 version
npm run build && electron-builder --win --ia32

# Build portable version
npm run dist:win:portable
```

## Output Files

After running `npm run dist:win`, you'll find these files in the `dist/` directory:

### Installer
- `Markdown Capture Setup 1.0.0.exe` (x64)
- `Markdown Capture Setup 1.0.0.exe` (x86)

### Portable
- `markdown-capture-1.0.0-win32-x64-portable.exe`

### Unpacked
- `win-unpacked/` folder with the application

## Testing the Build

### Before Distribution
```powershell
# Test the unpacked version
cd dist/win-unpacked
./Markdown Capture.exe

# Test the installer (in a VM or test machine)
# Run the installer and verify:
# - Application launches
# - Global hotkey works (Ctrl+Shift+Space)
# - System tray appears
# - Settings window opens
# - Files are saved correctly
```

### Common Issues & Solutions

#### Issue: Build fails with "MSB8036"
**Solution**: Install Visual Studio Build Tools with C++ components

#### Issue: "electron-builder not found"
**Solution**: Run `npm install -g electron-builder` or use `npx electron-builder`

#### Issue: Hotkey doesn't work on Windows
**Solution**: Run as administrator or check Windows security settings

#### Issue: Icon not displaying
**Solution**: Ensure `assets/icon.ico` exists and is a valid Windows icon file

## Advanced Build Options

### Custom Configuration
You can modify build settings in `package.json` under the `build.win` section:

```json
"win": {
  "target": [
    {
      "target": "nsis",
      "arch": ["x64", "ia32"]
    },
    {
      "target": "portable",
      "arch": ["x64"]
    }
  ],
  "icon": "assets/icon.ico",
  "publisher": "YourName",
  "verifyUpdateCodeSignature": false
}
```

### NSIS Customization
```json
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true,
  "createStartMenuShortcut": true,
  "shortcutName": "Markdown Capture"
}
```

### Code Signing (Production)
```json
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "password",
  "publisherName": "Your Company"
}
```

## Troubleshooting

### Build Environment
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Check Electron version
npx electron --version
```

### Windows Defender Issues
If Windows Defender blocks the application:
1. Add the application to Windows Defender exclusions
2. Sign the application with a code signing certificate
3. Submit to Microsoft SmartScreen

### Performance Optimization
```powershell
# Build with optimization flags
set NODE_ENV=production
npm run build

# Reduce bundle size
npm install --production
npm run build
```

## Distribution

### For End Users
- Distribute the installer: `Markdown Capture Setup 1.0.0.exe`
- User installs with administrator privileges
- Application installs to Program Files
- Creates desktop and Start Menu shortcuts

### For Portable Use
- Distribute the portable version
- No installation required
- Runs from any location
- Settings stored in application folder

### For Developers
- Use the unpacked version for testing
- Source code included in package
- Can be modified and rebuilt

## Support

For build issues:
1. Check the [GitHub Issues](https://github.com/yourusername/markdown-capture/issues)
2. Verify all prerequisites are installed
3. Check Node.js and npm versions
4. Ensure Windows SDK is installed

## Automated Builds

### GitHub Actions (Optional)
You can set up automated builds using GitHub Actions:

```yaml
name: Build Windows
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - run: npm run dist:win
    - uses: actions/upload-artifact@v2
      with:
        name: windows-dist
        path: dist/
```

This will automatically build and package the Windows version whenever you push to the repository.