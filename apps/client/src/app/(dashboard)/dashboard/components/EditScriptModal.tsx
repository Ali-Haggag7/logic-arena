"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../../../lib/api-client";
import { RobotScript } from "./ScriptCard";

interface EditScriptModalProps {
    script: RobotScript;
    onClose: () => void;
    onOptimisticUpdate: (updated: RobotScript) => void;
    onRevert: (original: RobotScript) => void;
}

type FooterStatus = "idle" | "success" | "error";

export const EditScriptModal = ({
    script,
    onClose,
    onOptimisticUpdate,
    onRevert,
}: EditScriptModalProps) => {
    const [content, setContent] = useState(script.content ?? "");
    const [footerStatus, setFooterStatus] = useState<FooterStatus>("idle");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const isSaving = useRef(false);

    /* ── Escape key ── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    /* ── Auto-focus ── */
    useEffect(() => { textareaRef.current?.focus(); }, []);

    /* ── Sync line-number scroll with textarea scroll ── */
    const syncScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    /* ── Line numbers ── */
    const lineCount = Math.max(content.split("\n").length, 1);

    /* ── Overlay click ── */
    const handleOverlayClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
        },
        [onClose]
    );

    /* ── Tab key ── */
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

    /* ── Save ── */
    const handleSave = async () => {
        if (isSaving.current) return;
        isSaving.current = true;

        const optimistic: RobotScript = { ...script, content, version: script.version + 1 };
        onOptimisticUpdate(optimistic);
        setFooterStatus("idle");

        try {
            await apiClient.put(`/scripts/${script.id}`, { content });
            setFooterStatus("success");
            setTimeout(() => onClose(), 1500);
        } catch {
            onRevert(script);
            setContent(script.content ?? "");
            setFooterStatus("error");
        } finally {
            isSaving.current = false;
        }
    };

    const formattedDate = new Date(script.createdAt).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
    });

    return (
        <>
            {/* ── Scoped styles ── */}
            <style>{`
                .em-overlay {
                    position: fixed;
                    inset: 0;
                    height: 100dvh;
                    background: rgba(0,0,0,0.75);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                }

                /* KEY FIX: give the container an explicit height so flex children can fill it */
                .em-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 56rem;
                    height: min(90dvh, 700px);   /* ← explicit height */
                    background: var(--color-bg-secondary, #0d1117);
                    border: 1px solid rgba(var(--accent-rgb), 0.25);
                    border-radius: 0.875rem;
                    overflow: hidden;
                    box-shadow:
                        0 0 0 1px rgba(var(--accent-rgb), 0.06),
                        0 32px 64px rgba(0,0,0,0.7),
                        0 0 80px rgba(var(--accent-rgb), 0.07);
                    animation: emIn 0.2s cubic-bezier(0.16,1,0.3,1) both;
                }
                @keyframes emIn {
                    from { opacity:0; transform: scale(0.95) translateY(12px); }
                    to   { opacity:1; transform: scale(1)    translateY(0); }
                }

                /* corner brackets */
                .em-corner {
                    position: absolute;
                    font-family: monospace;
                    font-size: 1rem;
                    line-height: 1;
                    color: rgba(var(--accent-rgb), 0.3);
                    pointer-events: none;
                    user-select: none;
                }
                .em-corner-tl { top:8px;    left:12px; }
                .em-corner-tr { top:8px;    right:12px; transform: scaleX(-1); }
                .em-corner-bl { bottom:8px; left:12px;  transform: scaleY(-1); }
                .em-corner-br { bottom:8px; right:12px; transform: scale(-1); }

                /* header */
                .em-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    padding: 0.875rem 1.25rem;
                    border-bottom: 1px solid rgba(var(--accent-rgb), 0.12);
                    flex-shrink: 0;
                    background: rgba(var(--accent-rgb), 0.02);
                }
                .em-header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    min-width: 0;
                }
                .em-title {
                    font-family: monospace;
                    font-size: 0.9rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    color: var(--color-accent, #00ff88);
                    text-shadow: 0 0 14px rgba(var(--accent-rgb), 0.45);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .em-badge {
                    font-family: monospace;
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    color: var(--color-accent, #00ff88);
                    background: rgba(var(--accent-rgb), 0.12);
                    border: 1px solid rgba(var(--accent-rgb), 0.3);
                    padding: 0.15rem 0.5rem;
                    border-radius: 9999px;
                    flex-shrink: 0;
                }
                .em-close {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 0.375rem;
                    border: 1px solid transparent;
                    color: var(--color-text-secondary, #8b9499);
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.15s;
                    flex-shrink: 0;
                }
                .em-close:hover {
                    color: var(--color-accent, #00ff88);
                    border-color: rgba(var(--accent-rgb), 0.3);
                    background: rgba(var(--accent-rgb), 0.08);
                }

                /* body — this is the KEY: flex:1 + min-height:0 */
                .em-body {
                    display: flex;
                    flex: 1 1 0;
                    min-height: 0;          /* ← critical for flex children shrink */
                    overflow: hidden;
                    margin: 0.75rem;
                    border: 1px solid rgba(var(--accent-rgb), 0.1);
                    border-radius: 0.5rem;
                    background: var(--color-bg-primary, #060b10);
                }

                /* line numbers */
                .em-linenos {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    padding: 1rem 0.6rem 1rem 0.75rem;
                    border-right: 1px solid rgba(var(--accent-rgb), 0.07);
                    overflow: hidden;       /* hides scroll bar, scroll synced via JS */
                    flex-shrink: 0;
                    min-width: 2.75rem;
                    background: rgba(var(--accent-rgb), 0.015);
                }
                .em-lineno {
                    font-family: monospace;
                    font-size: 0.75rem;
                    line-height: 1.5rem;    /* must match textarea line-height */
                    color: rgba(var(--accent-rgb), 0.22);
                    text-align: right;
                    white-space: nowrap;
                    height: 1.5rem;
                }

                /* textarea */
                .em-textarea {
                    flex: 1 1 0;
                    min-width: 0;
                    resize: none;
                    background: transparent;
                    border: none;
                    outline: none;
                    padding: 1rem;
                    font-family: monospace;
                    font-size: 0.8125rem;
                    line-height: 1.5rem;    /* matches lineno height */
                    color: var(--color-text-primary, #dce8e0);
                    caret-color: var(--color-accent, #00ff88);
                    tab-size: 2;
                    overflow-y: auto;
                    overflow-x: auto;
                    white-space: pre;
                }
                .em-textarea::selection {
                    background: rgba(var(--accent-rgb), 0.2);
                }
                .em-textarea::-webkit-scrollbar { width: 4px; height: 4px; }
                .em-textarea::-webkit-scrollbar-track { background: transparent; }
                .em-textarea::-webkit-scrollbar-thumb {
                    background: rgba(var(--accent-rgb), 0.2);
                    border-radius: 2px;
                }

                /* footer */
                .em-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    padding: 0.75rem 1.25rem;
                    border-top: 1px solid rgba(var(--accent-rgb), 0.1);
                    flex-shrink: 0;
                    flex-wrap: wrap;
                    background: rgba(var(--accent-rgb), 0.02);
                }
                .em-footer-left { flex: 1; min-width: 0; }
                .em-footer-right { display: flex; gap: 0.5rem; flex-shrink: 0; }

                .em-meta {
                    font-family: monospace;
                    font-size: 0.625rem;
                    letter-spacing: 0.15em;
                    color: var(--color-text-secondary, #8b9499);
                    opacity: 0.7;
                }
                .em-feedback {
                    font-family: monospace;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    animation: feedIn 0.2s ease both;
                }
                @keyframes feedIn {
                    from { opacity:0; transform: translateY(3px); }
                    to   { opacity:1; transform: translateY(0); }
                }
                .em-feedback--ok  { color: #4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.5); }
                .em-feedback--err { color: #f87171; text-shadow: 0 0 10px rgba(248,113,113,0.4); }

                .em-btn {
                    font-family: monospace;
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    padding: 0.5rem 1.25rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.15s;
                }
                .em-btn-cancel {
                    border: 1px solid rgba(var(--accent-rgb), 0.15);
                    background: transparent;
                    color: var(--color-text-secondary, #8b9499);
                }
                .em-btn-cancel:hover {
                    border-color: rgba(var(--accent-rgb), 0.35);
                    color: var(--color-text-primary, #dce8e0);
                    background: rgba(var(--accent-rgb), 0.05);
                }
                .em-btn-save {
                    border: 1px solid rgba(var(--accent-rgb), 0.35);
                    background: rgba(var(--accent-rgb), 0.1);
                    color: var(--color-accent, #00ff88);
                }
                .em-btn-save:hover {
                    background: rgba(var(--accent-rgb), 0.2);
                    border-color: rgba(var(--accent-rgb), 0.65);
                    box-shadow: 0 0 18px rgba(var(--accent-rgb), 0.22);
                }

                /* mobile: full screen */
                @media (max-width: 640px) {
                    .em-overlay  { padding: 0; align-items: stretch; }
                    .em-container {
                        max-width: 100%;
                        height: 100dvh;
                        border-radius: 0;
                        border: none;
                    }
                    .em-textarea { font-size: 0.875rem; }
                }
            `}</style>

            {/* ── Overlay ── */}
            <div
                className="em-overlay"
                onClick={handleOverlayClick}
                role="dialog"
                aria-modal="true"
                aria-label={`Edit script: ${script.title}`}
            >
                {/* ── Container ── */}
                <div className="em-container">
                    <span className="em-corner em-corner-tl">⌐</span>
                    <span className="em-corner em-corner-tr">¬</span>
                    <span className="em-corner em-corner-bl">⌐</span>
                    <span className="em-corner em-corner-br">¬</span>

                    {/* Header */}
                    <div className="em-header">
                        <div className="em-header-left">
                            <span className="em-title">{script.title}</span>
                            <span className="em-badge">V.{script.version}</span>
                        </div>
                        <button onClick={onClose} className="em-close" aria-label="Close editor">
                            <X size={15} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="em-body">
                        {/* Line numbers — scroll synced to textarea */}
                        <div className="em-linenos" ref={lineNumbersRef} aria-hidden="true">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i} className="em-lineno">{i + 1}</div>
                            ))}
                        </div>

                        {/* Textarea */}
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

                    {/* Footer */}
                    <div className="em-footer">
                        <div className="em-footer-left">
                            {footerStatus === "idle" && (
                                <span className="em-meta">LAST MODIFIED: {formattedDate}</span>
                            )}
                            {footerStatus === "success" && (
                                <span className="em-feedback em-feedback--ok">✓ PROTOCOL UPDATED</span>
                            )}
                            {footerStatus === "error" && (
                                <span className="em-feedback em-feedback--err">✗ SYNC FAILED — CHANGES REVERTED</span>
                            )}
                        </div>
                        <div className="em-footer-right">
                            <button onClick={onClose} className="em-btn em-btn-cancel">CANCEL</button>
                            <button onClick={handleSave} className="em-btn em-btn-save">SAVE CHANGES</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
