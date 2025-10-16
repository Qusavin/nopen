# Windows Debugging Guide

## Quick Fix Checklist

The application has been rebuilt with enhanced debugging. Here's how to fix the "no tray icon" issue:

### Step 1: Run the Debug Script
```cmd
# In your project folder
debug-windows.bat
```

### Step 2: Check Console Output
Look for these messages:
- ✅ "Starting initialization..."
- ✅ "Tray manager initialized"
- ✅ "Hotkey manager initialized"
- ✅ "Application initialized successfully"

### Step 3: Test the Hotkey
Even if you don't see the tray icon, try:
- Press `Ctrl+Shift+Space` anywhere
- The overlay should still appear

### Step 4: Manual Testing
```cmd
# Navigate to the built app
cd dist\win-unpacked

# Run with debugging
.\Markdown Capture.exe --enable-logging

# Or run directly
.\Markdown Capture.exe
```

## Common Windows Issues & Solutions

### Issue 1: Icon Not Visible in Tray
**Cause**: Windows hides inactive tray icons by default

**Solution**:
1. Look for the "↑" arrow in the system tray (hidden icons area)
2. Click it to show hidden icons
3. Find "Markdown Capture" and drag it to the main tray area
4. Right-click the tray → "Taskbar settings" → "Select which icons appear on the taskbar"
5. Enable "Markdown Capture"

### Issue 2: Application Crashes on Startup
**Check the console output for**:
- "Failed to initialize application"
- Any error messages about missing dependencies

**Solution**:
```cmd
# Rebuild the application
npm run build

# Check if Node.js is properly installed
node --version

# Run with additional logging
cd dist\win-unpacked
.\Markdown Capture.exe --enable-logging
```

### Issue 3: Hotkey Doesn't Work
**Cause**: Windows security or another application using the hotkey

**Solution**:
1. Try running as Administrator once
2. Check if another app is using Ctrl+Shift+Space
3. Test a different hotkey temporarily

### Issue 4: Windows Defender Blocking
**Solution**:
1. Add the application to Windows Defender exclusions
2. Run the installer instead of the portable version
3. Click "More info" → "Run anyway" if Windows shows a warning

## Manual Workarounds

### If Tray Still Doesn't Show:
1. **Use the hotkey**: `Ctrl+Shift+Space` should still work
2. **Create a desktop shortcut**: Right-click `dist\win-unpacked\Markdown Capture.exe` → Send to Desktop
3. **Add to Startup**: Press Win+R → `shell:startup` → Add shortcut

### Create Desktop Shortcut:
```cmd
# Create a desktop shortcut manually
cd dist\win-unpacked
mkshortcut Markdown Capture.exe
```

## Advanced Debugging

### Check Windows Event Viewer:
1. Press Win+R → `eventvwr.msc`
2. Navigate to Windows Logs → Application
3. Look for errors from "Markdown Capture"

### Run with Remote Debugging:
```cmd
cd dist\win-unpacked
.\Markdown Capture.exe --remote-debugging-port=9222
# Then open Chrome to http://localhost:9222
```

## Testing Checklist

After running the application:

- [ ] Console shows successful initialization
- [ ] Hotkey `Ctrl+Shift+Space` works
- [ ] Overlay window appears when hotkey is pressed
- [ ] Can type in overlay and save files
- [ ] Check Documents/MarkdownCapture folder for saved files
- [ ] Try to find tray icon in hidden icons area

## If Nothing Works

### Create a Simple Test Version:
```cmd
# Create a minimal test
npm run build
cd dist\win-unpacked
.\Markdown Capture.exe --no-sandbox
```

### Contact Support:
1. Note down any error messages from the console
2. Screenshot the Windows Event Viewer errors
3. List your Windows version and Node.js version
4. Try running on a different Windows machine if possible

## Rebuilding from Source

If all else fails:
```cmd
# Clean rebuild
git clean -fdx
npm install
npm run build
npm run dist:win
```

Then test the newly built installer.