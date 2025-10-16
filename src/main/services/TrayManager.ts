import { Tray, Menu, app, Notification, nativeImage } from 'electron';
import { join } from 'path';

export class TrayManager {
  private tray: Tray | null = null;

  initialize(): void {
    // Try to load icon from assets, fallback to generated icon
    let icon: Electron.NativeImage;

    try {
      const iconFile = process.platform === 'win32' ? 'icon.ico' : 'iconTemplate.png';
      const candidatePaths: string[] = [];
      const appPath = app.getAppPath();

      candidatePaths.push(join(appPath, 'assets', iconFile));

      if (app.isPackaged) {
        candidatePaths.push(join(process.resourcesPath, 'assets', iconFile));
      }

      let loadedIcon: Electron.NativeImage | null = null;
      for (const candidate of candidatePaths) {
        const nativeImg = nativeImage.createFromPath(candidate);
        if (!nativeImg.isEmpty()) {
          loadedIcon = nativeImg;
          console.log('Loaded tray icon from file:', candidate);
          break;
        }
      }

      if (!loadedIcon) {
        throw new Error('Tray icon file was not found in any candidate path');
      }

      icon = loadedIcon;
    } catch (error) {
      // Create a simple programmatic icon as fallback
      console.log('Creating fallback icon:', error);
      icon = this.createFallbackIcon();
    }

    this.tray = new Tray(icon);

    this.createContextMenu();
    this.setupEventHandlers();

    this.tray.setToolTip('Markdown Capture - Press Ctrl+Shift+Space to capture notes');
    console.log('TrayManager initialized');
  }

  private createContextMenu(): void {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Overlay',
        click: () => {
          console.log('Show overlay clicked');
          setImmediate(() => app.emit('hotkey:show-overlay'));
        }
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          console.log('Settings clicked');
          setImmediate(() => app.emit('show-settings'));
        }
      },
      {
        label: 'Exit',
        click: () => {
          console.log('Exit clicked');
          app.quit();
        }
      }
    ]);

    this.tray?.setContextMenu(contextMenu);
  }

  private setupEventHandlers(): void {
    this.tray?.on('click', () => {
      console.log('Tray clicked');
      setImmediate(() => app.emit('hotkey:show-overlay'));
    });

    this.tray?.on('right-click', () => {
      console.log('Tray right-clicked');
    });
  }

  showNotification(title: string, body: string): void {
    if (!Notification.isSupported()) {
      console.log('Notifications not supported');
      return;
    }

    try {
      const notification = new Notification({
        title,
        body
      });

      notification.show();
      console.log(`Notification shown: ${title} - ${body}`);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  updateTooltip(text: string): void {
    this.tray?.setToolTip(text);
  }

  private createFallbackIcon(): Electron.NativeImage {
    // Create a simple 16x16 icon using a data URL
    // This is a small blue square with white "M" text
    const iconDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFYSURBVDiNpdO9DcIwEAXgLyCioKEHFxcX5RBRFRUFBQUF8B/8FO1dDd1Jd4uQdJKCQkJCQk5OzuLl5eVf9Pv9j7IsK5VKJZPJhEajEV6vV6FQwGw2W8ViMQaDQYlEolEolEohEKhUCgUisUihEIpy7JsL8vyyLKspmmKxWK5XK5UKhUKhUKhUChUKhXy/f7/R9M0WZYlEonFYrFYLJVKpVKpVCqVSiWVSlGpVFqpxLJly7Isi8VisViwWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8Vif8H+8QYy4B0Z6gAAAABJRU5ErkJggg==';

    try {
      return nativeImage.createFromDataURL(iconDataUrl);
    } catch (error) {
      console.log('Data URL fallback failed:', error);
      // Ultimate fallback - empty icon (tray will still work but be invisible)
      return nativeImage.createEmpty();
    }
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}
