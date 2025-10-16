import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxHeight?: number;
}

const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ className, maxHeight = 400, onChange, onInput, ...props }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [maxHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Set initial height
      handleResize();

      // Add resize observer to handle content changes
      const resizeObserver = new ResizeObserver(handleResize);

      resizeObserver.observe(textarea);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [handleResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleResize();
    if (onChange) {
      onChange(e);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    handleResize();
    if (onInput) {
      onInput(e);
    }
  };

  return (
    <textarea
      ref={(node) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        textareaRef.current = node;
      }}
      className={cn(
        'resize-none overflow-hidden transition-all duration-200',
        className
      )}
      onChange={handleChange}
      onInput={handleInput}
      style={{
        height: 'auto',
        minHeight: props.minHeight || '120px',
        maxHeight: `${maxHeight}px`
      }}
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export { AutoResizeTextarea };
