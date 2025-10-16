import { globalShortcut, app } from 'electron';
import { SettingsService } from './SettingsService';
import { AppSettings } from '../../shared/types';

export class HotkeyManager {
  private registeredHotkeys = new Map<string, string>();
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = SettingsService.getInstance();
  }

  async initialize(): Promise<void> {
    // Enable Wayland compatibility
    app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal');

    const settings = await this.settingsService.getSettings();
    this.registerHotkey('show-overlay', this.buildAccelerator(settings), () => {
      this.onHotkeyPressed();
    });
  }

  private buildAccelerator(settings: AppSettings): string {
    const modifiers: string[] = [];

    if (settings.hotkeyModifiers & 1) modifiers.push('Alt');
    if (settings.hotkeyModifiers & 2) modifiers.push('CommandOrControl'); // Use CommandOrControl for cross-platform
    if (settings.hotkeyModifiers & 4) modifiers.push('Shift');
    if (settings.hotkeyModifiers & 8) modifiers.push('Super'); // Use Super for Win/Cmd key

    // Handle special keys like Space
    let key: string;
    if (settings.hotkeyKey === 32) {
      key = 'Space';
    } else {
      key = String.fromCharCode(settings.hotkeyKey);
    }

    return `${modifiers.join('+')}+${key}`;
  }

  registerHotkey(id: string, accelerator: string, callback: () => void): boolean {
    try {
      const success = globalShortcut.register(accelerator, callback);
      if (success) {
        this.registeredHotkeys.set(id, accelerator);
        console.log(`Registered hotkey ${id}: ${accelerator}`);
      } else {
        console.error(`Failed to register hotkey ${id}: ${accelerator}`);
      }
      return success;
    } catch (error) {
      console.error(`Failed to register hotkey ${id}:`, error);
      return false;
    }
  }

  unregisterAll(): void {
    for (const [id, accelerator] of this.registeredHotkeys) {
      globalShortcut.unregister(accelerator);
      console.log(`Unregistered hotkey ${id}: ${accelerator}`);
    }
    this.registeredHotkeys.clear();
  }

  private onHotkeyPressed(): void {
    // Emit event or call window manager
    console.log('Hotkey pressed - showing overlay');
    app.emit('hotkey:show-overlay');
  }

  async updateHotkey(settings: AppSettings): Promise<boolean> {
    // Unregister existing hotkey
    this.unregisterAll();

    // Register new hotkey
    const accelerator = this.buildAccelerator(settings);
    return this.registerHotkey('show-overlay', accelerator, () => {
      this.onHotkeyPressed();
    });
  }
}