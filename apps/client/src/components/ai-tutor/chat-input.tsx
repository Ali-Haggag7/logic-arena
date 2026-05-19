'use client';

import React from 'react';
import { Send, X } from 'lucide-react';
import { MAX_MESSAGE_LENGTH } from './constants';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isActive: boolean;
  onAbort: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  input,
  onInputChange,
  onSend,
  onKeyDown,
  isActive,
  onAbort,
  inputRef,
}: ChatInputProps) {
  return (
    <div className="px-4 py-3 border-t border-accent/10 shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                onInputChange(e.target.value);
                const el = e.target;
                el.style.height = 'auto';
                const scrollH = el.scrollHeight;
                const capped = Math.min(scrollH, 200);
                el.style.height = `${capped}px`;
                el.style.overflowY = scrollH > 200 ? 'auto' : 'hidden';
              }
            }}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about AliScript..."
            rows={1}
            disabled={isActive}
            className="ai-placeholder w-full bg-bg-secondary border border-accent/10 rounded-xl px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-secondary/25 outline-none resize-none leading-relaxed disabled:opacity-50"
            style={{ fontFamily: 'inherit', maxHeight: '200px', overflowY: 'hidden' }}
            aria-label="Chat message input"
          />
        </div>
        <div className="shrink-0 flex flex-col justify-end h-full">
          {isActive ? (
            <button
              type="button"
              onClick={onAbort}
              className="w-[38px] h-[38px] flex items-center justify-center rounded-xl border border-sem-danger/30 bg-sem-danger/8 text-sem-danger hover:bg-sem-danger/15 transition-all cursor-pointer"
              aria-label="Stop generating"
            >
              <X size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSend}
              disabled={!input.trim()}
              className="w-[38px] h-[38px] flex items-center justify-center rounded-xl border border-accent/30 bg-accent/8 text-accent hover:bg-accent/15 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          )}
        </div>
      </div>
      <p className="text-[9px] text-text-secondary/20 mt-1.5 text-center">
        Enter to send &middot; Shift+Enter for new line &middot; {input.length}/{MAX_MESSAGE_LENGTH}
      </p>
    </div>
  );
}
