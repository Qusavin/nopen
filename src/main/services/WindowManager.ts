import { BrowserWindow, screen } from 'electron';
import { join } from 'path';

export class WindowManager {
  private overlayWindow: BrowserWindow | null = null;
  private settingsWindow: BrowserWindow | null = null;
  private overlayLastShownAt = 0;
  private pendingOverlayBlurCheck: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    // Don't create windows on startup, only on demand
    console.log('WindowManager initialized');
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    // IPC handlers are now managed centrally in ipc/handlers.ts
    // This method is kept for potential future window-specific handlers
  }

  async showOverlay(): Promise<void> {
    if (this.overlayWindow) {
      this.overlayLastShownAt = Date.now();
      this.overlayWindow.show();
      setTimeout(() => {
        this.overlayWindow?.focus();
        this.overlayWindow?.webContents.send('show-overlay');
      }, 50);
      return;
    }

    this.overlayWindow = new BrowserWindow({
      width: 600,
      height: 400,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      center: true,
      opacity: 0.95,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, '../preload/index.js')
      }
    });

    try {
      // Load the renderer URL in development, or the built file in production
      if (process.env.NODE_ENV === 'development') {
        await this.overlayWindow.loadURL('http://localhost:5173/index.html?view=overlay');
      } else {
        await this.overlayWindow.loadFile(join(__dirname, '../renderer/index.html'), {
          query: { view: 'overlay' }
        });
      }
    } catch (error) {
      console.error('Failed to load overlay window:', error);
      this.overlayWindow.destroy();
      this.overlayWindow = null;
      return;
    }

    this.overlayWindow.once('ready-to-show', () => {
      this.overlayLastShownAt = Date.now();
      this.overlayWindow?.show();
      setTimeout(() => {
        this.overlayWindow?.focus();
        this.overlayWindow?.webContents.send('show-overlay');
      }, 50);
    });

    this.overlayWindow.on('blur', () => {
      const checkBlur = () => {
        if (!this.overlayWindow) return;
        if (this.overlayWindow.isDestroyed() || this.overlayWindow.isFocused()) {
          return;
        }
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (!focusedWindow) {
          this.pendingOverlayBlurCheck = setTimeout(checkBlur, 100);
          return;
        }
        if (focusedWindow.id === this.overlayWindow.id) {
          return;
        }
        this.hideOverlay();
      };

      // Avoid hiding immediately while the tray menu or shortcut is still releasing focus
      const timeSinceShow = Date.now() - this.overlayLastShownAt;
      if (timeSinceShow < 250) {
        if (this.pendingOverlayBlurCheck) {
          clearTimeout(this.pendingOverlayBlurCheck);
        }
        this.pendingOverlayBlurCheck = setTimeout(checkBlur, 300);
      } else {
        checkBlur();
      }
    });

    this.overlayWindow.on('closed', () => {
      this.overlayWindow = null;
      if (this.pendingOverlayBlurCheck) {
        clearTimeout(this.pendingOverlayBlurCheck);
        this.pendingOverlayBlurCheck = null;
      }
    });

    this.overlayWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Overlay window failed to load:', errorCode, errorDescription);
    });

    console.log('Overlay window created and shown');
  }

  hideOverlay(): void {
    if (this.overlayWindow) {
      this.overlayWindow.hide();
      console.log('Overlay window hidden');
    }
  }

  async showSettings(): Promise<void> {
    if (this.settingsWindow) {
      this.settingsWindow.focus();
      this.settingsWindow.show();
      return;
    }

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    this.settingsWindow = new BrowserWindow({
      width: Math.min(800, width - 100),
      height: Math.min(600, height - 100),
      frame: true,
      alwaysOnTop: false,
      skipTaskbar: false,
      resizable: true,
      center: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, '../preload/index.js')
      }
    });

    try {
      if (process.env.NODE_ENV === 'development') {
        await this.settingsWindow.loadURL('http://localhost:5173/index.html?view=settings');
      } else {
        await this.settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
          query: { view: 'settings' }
        });
      }
    } catch (error) {
      console.error('Failed to load settings window:', error);
      this.settingsWindow.destroy();
      this.settingsWindow = null;
      return;
    }

    this.settingsWindow.once('ready-to-show', () => {
      this.settingsWindow?.show();
      this.settingsWindow?.focus();
    });

    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });

    console.log('Settings window created and shown');
  }

  hideSettings(): void {
    if (this.settingsWindow) {
      this.settingsWindow.hide();
      console.log('Settings window hidden');
    }
  }

  // Getters for window states
  isOverlayVisible(): boolean {
    return this.overlayWindow !== null && this.overlayWindow.isVisible();
  }

  isSettingsVisible(): boolean {
    return this.settingsWindow !== null && this.settingsWindow.isVisible();
  }

  // Close all windows
  closeAllWindows(): void {
    if (this.overlayWindow) {
      this.overlayWindow.close();
      this.overlayWindow = null;
    }
    if (this.settingsWindow) {
      this.settingsWindow.close();
      this.settingsWindow = null;
    }
  }
}
