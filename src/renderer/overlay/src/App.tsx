/// <reference path="../../../types/overlay.d.ts" />
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Listen for show events from main process
    const cleanup = window.electronAPI.onShowOverlay(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    });

    return cleanup;
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
    // Allow Shift+Enter for new lines
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    try {
      const savedFilename = await window.electronAPI.saveMarkdown(content, '');
      await window.electronAPI.showNotification({
        title: 'Note Saved',
        body: `Saved as ${savedFilename}`
      });
      handleCancel();
    } catch (error) {
      console.error('Failed to save:', error);
      // Could show an error notification here
      await window.electronAPI.showNotification({
        title: 'Error',
        body: 'Failed to save note'
      });
    }
  };

  const handleCancel = () => {
    setContent('');
    window.electronAPI.hideOverlay();
  };

  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your markdown note here..."
          className="markdown-input"
          autoFocus
        />
        <div className="overlay-footer">
          <span className="help-text">
            Enter to save • Shift+Enter for new line • Escape to cancel
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;