import { AppSettings, NotificationOptions } from '../shared/types';

declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getSettings: () => Promise<AppSettings>;
      saveSettings: (settings: Partial<AppSettings>) => Promise<void>;
      saveMarkdown: (content: string, filename?: string) => Promise<string>;
      showNotification: (options: NotificationOptions) => Promise<void>;
      hideOverlay: () => Promise<void>;
      hideSettings: () => Promise<void>;
      selectFolder: () => Promise<string | undefined>;
      onShowOverlay?: (callback: () => void) => (() => void);
    };
  }
}

export {};
