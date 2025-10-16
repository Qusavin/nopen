import { app } from 'electron';
import { WindowManager } from './services/WindowManager';
import { TrayManager } from './services/TrayManager';
import { HotkeyManager } from './services/HotkeyManager';
import { ErrorService } from './services/ErrorService';
import { setupIpcHandlers } from './ipc/handlers';

class Application {
  private windowManager: WindowManager;
  private trayManager: TrayManager;
  private hotkeyManager: HotkeyManager;
  private errorService: ErrorService;

  constructor() {
    this.windowManager = new WindowManager();
    this.trayManager = new TrayManager();
    this.hotkeyManager = new HotkeyManager();
    this.errorService = new ErrorService(this.trayManager);
  }

  async initialize(): Promise<void> {
    // Setup error handling first
    this.errorService.setupErrorHandlers();

    await app.whenReady();

    // Enforce single instance
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
      return;
    }

    // Safe initialization with error handling
    const initializationSuccess = await this.errorService.safeExecute(async () => {
      console.log('Starting initialization...');

      this.setupEventHandlers();
      console.log('Event handlers set up');

      setupIpcHandlers({
        windowManager: this.windowManager,
        trayManager: this.trayManager,
        errorService: this.errorService
      });
      console.log('IPC handlers set up');

      await this.windowManager.initialize();
      console.log('Window manager initialized');

      this.trayManager.initialize();
      console.log('Tray manager initialized');

      await this.hotkeyManager.initialize();
      console.log('Hotkey manager initialized');

      // Add a small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('All components initialized successfully');
      return true;
    }, 'Failed to initialize application');

    if (initializationSuccess) {
      console.log('Application initialized successfully');
    } else {
      console.error('Application initialization failed');
      app.quit();
    }
  }

  private setupEventHandlers(): void {
    app.on('window-all-closed', () => {
      // Don't quit on Windows/Linux when tray is active
      console.log('All windows closed, but keeping app running due to tray');
    });

    app.on('before-quit', (event) => {
      console.log('App before quit - cleaning up...');
      this.hotkeyManager.unregisterAll();
      this.trayManager.destroy();
      this.windowManager.closeAllWindows();
    });

    app.on('will-quit', () => {
      console.log('App will quit');
    });

    app.on('second-instance', () => {
      console.log('Second instance detected, focusing existing overlay');
      this.windowManager.showOverlay();
    });

    // Handle custom events
    app.on('hotkey:show-overlay' as any, () => {
      console.log('Hotkey event received, showing overlay');
      this.windowManager.showOverlay();
    });

    app.on('show-settings' as any, () => {
      console.log('Show settings event received');
      this.windowManager.showSettings();
    });
  }
}

const application = new Application();
application.initialize().catch((error) => {
  console.error('Failed to initialize application:', error);
  app.quit();
});
