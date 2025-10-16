/// <reference path="../../../types/settings.d.ts" />
import React, { useState, useEffect } from 'react';
import './App.css';

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

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Markdown Capture Settings</h1>
        <button className="close-btn" onClick={() => window.electronAPI.hideSettings()}>
          ✕
        </button>
      </div>

      <div className="settings-content">
        <div className="form-group">
          <label htmlFor="saveFolder">Save Folder:</label>
          <div className="folder-input">
            <input
              id="saveFolder"
              type="text"
              value={settings.saveFolder}
              onChange={(e) => setSettings({ ...settings, saveFolder: e.target.value })}
              readOnly
            />
            <button onClick={selectFolder}>Browse</button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="filenameTemplate">Filename Template:</label>
          <input
            id="filenameTemplate"
            type="text"
            value={settings.filenameTemplate}
            onChange={(e) => setSettings({ ...settings, filenameTemplate: e.target.value })}
          />
          <small className="help-text">
            Available placeholders: {'{yyyy}'}, {'{MM}'}, {'{dd}'}, {'{HH}'}, {'{mm}'}, {'{ss}'}, {'{title}'}
          </small>
        </div>

        <div className="form-group">
          <label>Hotkey:</label>
          <div className="hotkey-display">
            <span>Ctrl+Shift+Space</span>
            <small>(Customizable in future version)</small>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={testFileSave} className="test-btn">
            Test Save File
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="save-btn"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('Failed') ? 'error' : 'success'}`}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;