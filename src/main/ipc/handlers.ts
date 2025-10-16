import { ipcMain, app, dialog } from 'electron';
import { SettingsService } from '../services/SettingsService';
import { FileService } from '../services/FileService';
import { WindowManager } from '../services/WindowManager';
import { TrayManager } from '../services/TrayManager';
import { ErrorService } from '../services/ErrorService';

interface IpcDependencies {
  windowManager: WindowManager;
  trayManager: TrayManager;
  errorService: ErrorService;
}

export function setupIpcHandlers({
  windowManager,
  trayManager,
  errorService
}: IpcDependencies): void {
  const settingsService = SettingsService.getInstance();
  const fileService = new FileService();

  // App info
  ipcMain.handle('app:get-version', () => app.getVersion());

  // Settings
  ipcMain.handle('settings:get', () => errorService.safeExecute(
    () => settingsService.getSettings(),
    'Failed to load settings'
  ));

  ipcMain.handle('settings:save', (_, settings) => errorService.safeExecute(async () => {
    const validation = errorService.validateSettings(settings);
    if (!validation.isValid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }
    return await settingsService.saveSettings(settings);
  }, 'Failed to save settings'));

  // File operations
  ipcMain.handle('file:save-markdown', async (_, content: string, filename?: string) => {
    return await errorService.safeExecute(
      () => fileService.saveMarkdown(content, filename),
      'Failed to save markdown file'
    );
  });

  // Notifications
  ipcMain.handle('app:show-notification', (_, options) =>
    trayManager.showNotification(options.title, options.body)
  );

  // Window controls
  ipcMain.handle('overlay:show', () => windowManager.showOverlay());
  ipcMain.handle('overlay:hide', () => windowManager.hideOverlay());
  ipcMain.handle('settings:show', () => windowManager.showSettings());
  ipcMain.handle('settings:hide', () => windowManager.hideSettings());

  // Dialog operations
  ipcMain.handle('dialog:select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Save Folder'
    });
    return result.filePaths[0];
  });

  console.log('IPC handlers registered successfully');
}
