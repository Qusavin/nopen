import { contextBridge, ipcRenderer } from 'electron';
import type { AppSettings, NotificationOptions } from '../shared/types';

const electronAPI = {
  // Version info
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get') as Promise<AppSettings>,
  saveSettings: (settings: Partial<AppSettings>) => ipcRenderer.invoke('settings:save', settings),

  // File operations
  saveMarkdown: (content: string, filename?: string) =>
    ipcRenderer.invoke('file:save-markdown', content, filename) as Promise<string>,

  // Notifications
  showNotification: (options: NotificationOptions) => ipcRenderer.invoke('app:show-notification', options),

  // Window controls
  hideOverlay: () => ipcRenderer.invoke('overlay:hide'),
  hideSettings: () => ipcRenderer.invoke('settings:hide'),

  // Dialog operations
  selectFolder: () => ipcRenderer.invoke('dialog:select-folder') as Promise<string | undefined>,

  // Events
  onShowOverlay: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('show-overlay', handler);
    return () => {
      ipcRenderer.removeListener('show-overlay', handler);
    };
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
