/// <reference path="../../../types/overlay.d.ts" />
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AutoResizeTextarea } from '@/components/ui/auto-resize-textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import '@/globals.css';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Listen for show events from main process
    const cleanup = window.electronAPI.onShowOverlay(() => {
      setOpen(true);
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
    setOpen(false);
    setTimeout(() => {
      window.electronAPI.hideOverlay();
    }, 150); // Allow dialog animation to complete
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6">
            <AutoResizeTextarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your markdown note here..."
              maxHeight={400}
              minHeight={300}
              className="border-0 focus:ring-0 p-0 text-base leading-relaxed font-mono shadow-none"
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center p-6 pt-0">
            <p className="text-sm text-muted-foreground">
              Enter to save • Shift+Enter for new line • Escape to cancel
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!content.trim()}>
                Save Note
              </Button>
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default App;
