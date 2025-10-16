export interface AppSettings {
  saveFolder: string;
  hotkeyModifiers: number; // Bit flags: 1=Alt, 2=Ctrl, 4=Shift, 8=Win
  hotkeyKey: number; // Virtual key code
  filenameTemplate: string;
}

export interface NotificationOptions {
  title: string;
  body: string;
}

export interface IPCChannels {
  'app:get-version': () => Promise<string>;
  'app:show-notification': (options: NotificationOptions) => Promise<void>;
  'settings:get': () => Promise<AppSettings>;
  'settings:save': (settings: Partial<AppSettings>) => Promise<void>;
  'settings:hide': () => Promise<void>;
  'overlay:show': () => Promise<void>;
  'overlay:hide': () => Promise<void>;
  'file:save-markdown': (content: string, filename: string) => Promise<string>;
  'dialog:select-folder': () => Promise<string | undefined>;
}

// Global interface for electronAPI exposed to renderer
export interface ElectronAPI {
  // Version info
  getVersion: () => Promise<string>;

  // Settings
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // File operations
  saveMarkdown: (content: string, filename: string) => Promise<string>;

  // Notifications
  showNotification: (options: NotificationOptions) => Promise<void>;

  // Window controls
  hideOverlay: () => Promise<void>;
  hideSettings: () => Promise<void>;

  // Dialog operations
  selectFolder: () => Promise<string | undefined>;

  // Events
  onShowOverlay: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
