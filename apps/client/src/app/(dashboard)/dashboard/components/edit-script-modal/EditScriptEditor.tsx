"use client";

import React, { useRef, useEffect } from "react";

interface EditScriptEditorProps {
    content: string;
    setContent: (content: string) => void;
}

export function EditScriptEditor({ content, setContent }: EditScriptEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => { textareaRef.current?.focus(); }, []);

    const syncScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const ta = e.currentTarget;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const next = content.substring(0, start) + "  " + content.substring(end);
            setContent(next);
            requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
        }
    };

    const lineCount = Math.max(content.split("\n").length, 1);

    return (
        <div className="flex flex-1 min-h-0 overflow-hidden m-3 border border-accent/10 rounded-lg bg-bg-primary">
            <div className="flex flex-col items-end py-4 pr-2.5 pl-3 border-r border-accent/10 overflow-hidden shrink-0 min-w-[2.75rem] bg-accent/5" ref={lineNumbersRef} aria-hidden="true">
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="font-mono text-[0.8125rem] leading-6 text-accent/20 text-right whitespace-nowrap h-6">{i + 1}</div>
                ))}
            </div>

            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={syncScroll}
                className="flex-1 min-w-0 resize-none bg-transparent border-none outline-none p-4 font-mono text-[0.8125rem] leading-6 text-text-primary caret-accent whitespace-pre overflow-auto max-sm:text-sm selection:bg-accent/20 custom-scrollbar"
                style={{ tabSize: 2 }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label="Script content editor"
            />
        </div>
    );
}
