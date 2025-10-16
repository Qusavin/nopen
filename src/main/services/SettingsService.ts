import Store from 'electron-store';
import { AppSettings } from '../../shared/types';
import { join } from 'path';
import { homedir } from 'os';

export class SettingsService {
  private static instance: SettingsService;
  private store: Store<AppSettings>;

  private constructor() {
    this.store = new Store<AppSettings>({
      defaults: {
        saveFolder: this.getDefaultSaveFolder(),
        hotkeyModifiers: 6, // Ctrl+Shift
        hotkeyKey: 32, // Space key
        filenameTemplate: '{yyyy}-{MM}-{dd} {HHmm} {title}.md'
      }
    });
  }

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async getSettings(): Promise<AppSettings> {
    // Access the default values and merge with stored values
    const defaults = {
      saveFolder: this.getDefaultSaveFolder(),
      hotkeyModifiers: 6, // Ctrl+Shift
      hotkeyKey: 32, // Space key
      filenameTemplate: '{yyyy}-{MM}-{dd} {HHmm} {title}.md'
    };

    const store = this.store as Store<AppSettings> & { store: Partial<AppSettings> | undefined };
    const stored = store.store;
    return { ...defaults, ...(stored ?? {}) };
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        (this.store as Store<AppSettings>).set(
          key as keyof AppSettings,
          value as AppSettings[keyof AppSettings]
        );
      }
    }
  }

  private getDefaultSaveFolder(): string {
    return join(homedir(), 'Documents', 'MarkdownCapture');
  }

  async updateSaveFolder(folder: string): Promise<void> {
    await this.saveSettings({ saveFolder: folder });
  }

  async updateHotkey(modifiers: number, key: number): Promise<void> {
    await this.saveSettings({
      hotkeyModifiers: modifiers,
      hotkeyKey: key
    });
  }

  async updateFilenameTemplate(template: string): Promise<void> {
    await this.saveSettings({ filenameTemplate: template });
  }
}
