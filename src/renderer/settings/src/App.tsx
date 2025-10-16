/// <reference path="../../../types/settings.d.ts" />
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import '@/globals.css';

interface AppSettings {
  saveFolder: string;
  hotkeyModifiers: number;
  hotkeyKey: number;
  filenameTemplate: string;
}

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    saveFolder: '',
    hotkeyModifiers: 6, // Ctrl+Shift
    hotkeyKey: 32, // Space key
    filenameTemplate: '{yyyy}-{MM}-{dd} {HHmm} {title}.md'
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await window.electronAPI.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setStatusMessage('Failed to load settings');
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setStatusMessage('Saving...');

    try {
      await window.electronAPI.saveSettings(settings);
      setStatusMessage('Settings saved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setStatusMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const selectFolder = async () => {
    try {
      const folderPath = await window.electronAPI.selectFolder();
      if (folderPath) {
        setSettings({ ...settings, saveFolder: folderPath });
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
      setStatusMessage('Failed to select folder');
    }
  };

  const testFileSave = async () => {
    try {
      const testContent = `# Test Note\n\nThis is a test note created at ${new Date().toLocaleString()}.`;
      const filename = await window.electronAPI.saveMarkdown(testContent);
      await window.electronAPI.showNotification({
        title: 'Test Successful',
        body: `Test note saved as ${filename}`
      });
      setStatusMessage('Test file saved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save test file:', error);
      setStatusMessage('Failed to save test file');
    }
  };

  const handleClose = () => {
    window.electronAPI.hideSettings();
  };

  return (
    <main className="flex h-full w-full justify-center bg-background text-foreground">
      <div className="flex h-full w-full max-w-3xl flex-col px-6 py-8">
        <Card className="flex h-full flex-col border border-border/60 bg-card/90 text-card-foreground shadow-[0_20px_60px_-25px_rgba(7,50,33,0.55)] backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">Settings</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              type="button"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            {/* Save Folder Setting */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Save Folder
              </label>
              <div className="flex gap-2">
                <Input
                  value={settings.saveFolder}
                  onChange={(e) => setSettings({ ...settings, saveFolder: e.target.value })}
                  readOnly
                  placeholder="Select a folder to save your notes..."
                  className="flex-1"
                />
                <Button onClick={selectFolder} variant="outline" type="button">
                  Browse
                </Button>
              </div>
            </div>

            {/* Filename Template Setting */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Filename Template
              </label>
              <Input
                value={settings.filenameTemplate}
                onChange={(e) => setSettings({ ...settings, filenameTemplate: e.target.value })}
                placeholder="Enter filename template..."
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Available placeholders: {'{yyyy}'}, {'{MM}'}, {'{dd}'}, {'{HH}'}, {'{mm}'}, {'{ss}'}, {'{title}'}
              </p>
            </div>

            {/* Hotkey Setting */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Hotkey
              </label>
              <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                <p className="font-mono text-sm text-foreground/90">Ctrl+Shift+Space</p>
                <p className="mt-1 text-sm text-muted-foreground">Customizable in future version</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border/60 pt-6">
              <Button
                onClick={testFileSave}
                variant="outline"
                className="flex-1"
                type="button"
              >
                Test Save File
              </Button>
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="flex-1"
                type="button"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`rounded-md border p-3 text-sm ${
                  statusMessage.includes('Failed')
                    ? 'border-destructive/20 bg-destructive/10 text-destructive'
                    : 'border-green-200 bg-green-50 text-green-800'
                }`}
              >
                {statusMessage}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default App;
