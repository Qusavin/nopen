/// <reference path="../../../types/overlay.d.ts" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AutoResizeTextarea } from '@/components/ui/auto-resize-textarea';
import '@/globals.css';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const focusTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
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

  const handleCancel = useCallback(() => {
    setContent('');
    window.electronAPI.hideOverlay();
  }, []);

  const handleSave = useCallback(async () => {
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
  }, [content, handleCancel]);

  useEffect(() => {
    // Auto-focus textarea when component mounts
    focusTextarea();

    // Listen for show events from main process
    const cleanup = window.electronAPI.onShowOverlay(() => {
      setContent('');
      focusTextarea();
    });

    const handleWindowBlur = () => {
      handleCancel();
    };

    window.addEventListener('blur', handleWindowBlur);

    return () => {
      cleanup?.();
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [focusTextarea, handleCancel]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-background/90 px-6 py-6 text-foreground">
      <Card className="flex w-full max-w-2xl flex-col overflow-hidden border border-border/60 bg-card/95 shadow-[0_24px_70px_-20px_rgba(7,50,33,0.55)] backdrop-blur">
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="flex h-full flex-col">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground/90">Quick Note</h2>
              <p className="text-sm text-muted-foreground">Markdown is supported. Notes save to your configured folder.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AutoResizeTextarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your markdown note here..."
                maxHeight={320}
                minHeight={220}
                className="h-full w-full border-0 bg-transparent p-0 font-mono text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Enter to save • Shift+Enter for new line • Escape or blur to cancel
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!content.trim()} className="w-full sm:w-auto">
              Save Note
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default App;
