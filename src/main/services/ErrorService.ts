import { app, Event } from 'electron';
import { TrayManager } from './TrayManager';

export class ErrorService {
  private trayManager: TrayManager;

  constructor(trayManager: TrayManager) {
    this.trayManager = trayManager;
  }

  setupErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.logError('uncaughtException', error);
      this.showUserFriendlyError('An unexpected error occurred. The app will continue running.');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.logError('unhandledRejection', { reason, promise });
      this.showUserFriendlyError('An unexpected error occurred. Please try again.');
    });

    // Note: Electron type definitions for crash events are limited
    // In production, these would be handled with proper type assertions
    // For now, we focus on uncaught exceptions and promise rejections
  }

  private logError(type: string, error: any): void {
    const timestamp = new Date().toISOString();
    const errorData = {
      timestamp,
      type,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    };

    console.error(`[${type}]`, errorData);

    // In a production app, you might want to write this to a log file
    // or send it to an error tracking service
  }

  private showUserFriendlyError(message: string): void {
    try {
      this.trayManager.showNotification('Markdown Capture', message);
    } catch (error) {
      console.error('Failed to show error notification:', error);
    }
  }

  // Method to safely execute operations with error handling
  async safeExecute<T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error(errorMessage, error);
      this.logError('safe-execute-failed', { error, operation: errorMessage });
      this.showUserFriendlyError(errorMessage);
      return null;
    }
  }

  // Method to validate settings
  validateSettings(settings: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!settings.saveFolder || typeof settings.saveFolder !== 'string') {
      errors.push('Save folder is required');
    }

    if (!settings.filenameTemplate || typeof settings.filenameTemplate !== 'string') {
      errors.push('Filename template is required');
    }

    if (typeof settings.hotkeyKey !== 'number' || settings.hotkeyKey < 1) {
      errors.push('Invalid hotkey configuration');
    }

    if (typeof settings.hotkeyModifiers !== 'number' || settings.hotkeyModifiers < 0) {
      errors.push('Invalid hotkey modifiers');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}