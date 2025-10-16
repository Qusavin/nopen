import React from 'react';
import { createRoot } from 'react-dom/client';
import OverlayApp from '../overlay/src/App';
import SettingsApp from '../settings/src/App';

const container = document.getElementById('root');

if (container) {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  const AppComponent = view === 'settings' ? SettingsApp : OverlayApp;

  const root = createRoot(container);
  root.render(<AppComponent />);
}
