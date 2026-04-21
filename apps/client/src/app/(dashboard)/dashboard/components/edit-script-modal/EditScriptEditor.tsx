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
        <div className="em-body">
            <div className="em-linenos" ref={lineNumbersRef} aria-hidden="true">
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="em-lineno">{i + 1}</div>
                ))}
            </div>

            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={syncScroll}
                className="em-textarea"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label="Script content editor"
            />
        </div>
    );
}
