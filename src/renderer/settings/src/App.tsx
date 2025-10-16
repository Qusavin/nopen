/// <reference path="../../../types/settings.d.ts" />
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [open, setOpen] = useState(true);

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
    setOpen(false);
    setTimeout(() => {
      window.electronAPI.hideSettings();
    }, 150);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle className="text-2xl font-semibold">Settings</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              ✕
            </Button>
          </CardHeader>

          <CardContent className="space-y-8">
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
                <Button onClick={selectFolder} variant="outline">
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
              <p className="text-sm text-muted-foreground">
                Available placeholders: {'{yyyy}'}, {'{MM}'}, {'{dd}'}, {'{HH}'}, {'{mm}'}, {'{ss}'}, {'{title}'}
              </p>
            </div>

            {/* Hotkey Setting */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Hotkey
              </label>
              <div className="p-3 border rounded-md bg-muted/30">
                <p className="font-mono text-sm">Ctrl+Shift+Space</p>
                <p className="text-sm text-muted-foreground mt-1">Customizable in future version</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                onClick={testFileSave}
                variant="outline"
                className="flex-1"
              >
                Test Save File
              </Button>
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className={`p-3 rounded-md text-sm ${
                statusMessage.includes('Failed')
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {statusMessage}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default App;
