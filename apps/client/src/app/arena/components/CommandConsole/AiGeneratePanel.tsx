"use client";

import React, { useState, useRef, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api-client";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react";

const MAX_DESC_LENGTH = 500;
const PLACEHOLDER_HINTS = [
    "Attack aggressively, retreat when energy is low…",
    "Sweep with RAYCAST, fire when enemy detected…",
    "Patrol in circles, burst fire when fully charged…",
    "Track enemy positions in memory, predict their path…",
    "Use BROADCAST to coordinate with teammates…",
];

interface AiGeneratePanelProps {
    onInsert: (code: string) => void;
    onInsertAndSwitch?: (code: string) => void;
    isMobile?: boolean;
    isArena?: boolean;
}

export function AiGeneratePanel({ onInsert, onInsertAndSwitch, isMobile = false, isArena = false }: AiGeneratePanelProps) {
    const [description, setDescription] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
    const [copied, setCopied] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const placeholder = PLACEHOLDER_HINTS[0];

    const handleGenerate = useCallback(async () => {
        if (!description.trim() || status === "generating") return;

        abortRef.current?.abort();
        const abort = new AbortController();
        abortRef.current = abort;

        setStatus("generating");
        setGeneratedCode("");

        try {
            const response = await fetch(`${API_BASE_URL}/ai/generate-script`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: description.trim().slice(0, MAX_DESC_LENGTH) }),
                signal: abort.signal,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();
            let buffer = "";
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (typeof parsed === "string") {
                                accumulated += parsed;
                                setGeneratedCode(accumulated);
                            } else if (parsed && typeof parsed === "object" && parsed.error) {
                                throw new Error(parsed.error);
                            }
                        } catch (err) {
                            if (err instanceof Error && !err.message.includes("Unexpected token")) {
                                throw err; // Re-throw to be caught by the outer try-catch
                            }
                            // Otherwise skip malformed JSON chunks
                        }
                    }
                }
            }

            setStatus("done");
        } catch (err) {
            if ((err as Error).name === "AbortError") {
                setStatus("idle");
            } else {
                setStatus("error");
            }
        }
    }, [description, status]);

    const handleInsert = useCallback(() => {
        if (!generatedCode) return;
        if (isMobile && onInsertAndSwitch) {
            onInsertAndSwitch(generatedCode);
        } else {
            onInsert(generatedCode);
        }
    }, [generatedCode, onInsert, onInsertAndSwitch, isMobile]);

    const handleCopy = useCallback(async () => {
        if (!generatedCode) return;
        await navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [generatedCode]);

    const handleAbort = useCallback(() => {
        abortRef.current?.abort();
        setStatus("idle");
    }, []);

    const handleBackToPrompt = useCallback(() => {
        setGeneratedCode("");
        setStatus("idle");
    }, []);

    const isGenerating = status === "generating";
    const hasCode = generatedCode.length > 0;
    const showCodeOverlay = hasCode && (status === "done" || status === "generating");

    return (
        <div style={{ 
            display: "flex", flexDirection: "column", gap: "8px", flex: 1, height: "100%", minHeight: 0,
            "--local-accent-rgb": isArena ? "var(--arena-purple-rgb, 168, 85, 247)" : "var(--accent-rgb)",
            "--scrollbar-accent-rgb": isArena ? "var(--arena-purple-rgb, 168, 85, 247)" : "var(--accent-rgb)",
            "--scrollbar-bg": isArena ? "var(--arena-bg-dark, #020813)" : "var(--bg-primary)",
            "--scrollbar-accent": isArena ? "var(--arena-purple, #a855f7)" : "var(--accent)",
            "--selection-bg": isArena ? "rgba(var(--arena-purple-rgb, 168, 85, 247), 0.82)" : "rgba(var(--accent-rgb), 0.82)",
            "--selection-color": isArena ? "#ffffff" : "var(--bg-primary)"
        } as React.CSSProperties}>
            {/* Description Input — hidden when code is generated */}
            {!showCodeOverlay && (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                    <label
                        htmlFor="aria-strategy-description"
                        style={{ display: "block", fontSize: "8px", color: "rgba(var(--local-accent-rgb),0.6)", marginBottom: "4px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}
                    >
                        Describe your robot&apos;s strategy:
                    </label>
                    <textarea
                        id="aria-strategy-description"
                        className="custom-scrollbar"
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_LENGTH))}
                        placeholder={placeholder}
                        inputMode="text"
                        enterKeyHint="done"
                        dir="auto"
                        spellCheck={false}
                        style={{
                            width: "100%",
                            flex: 1,
                            resize: "none",
                            background: "rgba(var(--local-accent-rgb),0.03)",
                            border: "1px solid rgba(var(--local-accent-rgb),0.15)",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            fontSize: "12.5px",
                            lineHeight: "1.6",
                            color: isArena ? "#ffffff" : "rgba(var(--local-accent-rgb),0.9)",
                            outline: "none",
                            fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
                            boxSizing: "border-box",
                            transition: "all 0.2s ease-in-out",
                            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(var(--local-accent-rgb),0.4)"; e.currentTarget.style.background = "rgba(var(--local-accent-rgb),0.05)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(var(--local-accent-rgb),0.1)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(var(--local-accent-rgb),0.15)"; e.currentTarget.style.background = "rgba(var(--local-accent-rgb),0.03)"; e.currentTarget.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.02)"; }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                        <span style={{ fontSize: "9px", color: "rgba(var(--local-accent-rgb),0.4)", fontWeight: 600 }}>
                            {description.length}/{MAX_DESC_LENGTH}
                        </span>
                    </div>
                </div>
            )}

            {/* Generate Button */}
            {status !== "done" && (
                <button
                    type="button"
                    onClick={isGenerating ? handleAbort : handleGenerate}
                    disabled={!description.trim() && !isGenerating}
                    style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "9px 16px",
                        borderRadius: "8px",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        cursor: (!description.trim() && !isGenerating) ? "not-allowed" : "pointer",
                        opacity: (!description.trim() && !isGenerating) ? 0.4 : 1,
                        transition: "all 0.2s",
                        border: isGenerating
                            ? "1px solid rgba(var(--sem-danger-rgb),0.5)"
                            : "1px solid rgba(var(--local-accent-rgb),0.6)",
                        color: isGenerating ? "var(--sem-danger)" : "rgb(var(--local-accent-rgb))",
                        background: isGenerating
                            ? "rgba(var(--sem-danger-rgb),0.1)"
                            : "rgba(var(--local-accent-rgb),0.12)",
                        marginTop: "0px",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = isGenerating
                            ? "rgba(var(--sem-danger-rgb),0.22)"
                            : "rgba(var(--local-accent-rgb),0.22)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = isGenerating
                            ? "rgba(var(--sem-danger-rgb),0.1)"
                            : "rgba(var(--local-accent-rgb),0.12)";
                    }}
                >
                    {isGenerating ? (
                        <>
                            <span style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                border: "1.5px solid var(--sem-danger)",
                                borderTopColor: "transparent",
                                animation: "spin 0.7s linear infinite",
                                display: "inline-block",
                            }} />
                            Stop Generating
                        </>
                    ) : (
                        <>
                            <Sparkles style={{ width: "11px", height: "11px" }} aria-hidden="true" />
                            Generate AliScript
                        </>
                    )}
                </button>
            )}

            {/* Error State */}
            {status === "error" && (
                <p style={{ fontSize: "10px", color: "var(--sem-danger)", margin: 0, flexShrink: 0 }}>
                    ⚠️ Generation failed — check your connection and try again.
                </p>
            )}

            {/* Generated Code Preview */}
            {hasCode && (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: "6px" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}>
                        <span style={{ fontSize: "8.5px", color: "rgba(var(--local-accent-rgb),0.6)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
                            Generated Code
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button
                                type="button"
                                onClick={handleBackToPrompt}
                                aria-label="Back to prompt editor"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "3px 8px",
                                    borderRadius: "5px",
                                    fontSize: "8px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    border: "1px solid rgba(var(--local-accent-rgb),0.3)",
                                    color: "rgba(var(--local-accent-rgb),0.7)",
                                    background: "rgba(var(--local-accent-rgb),0.08)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(var(--local-accent-rgb),0.18)";
                                    e.currentTarget.style.border = "1px solid rgba(var(--local-accent-rgb),0.5)";
                                    e.currentTarget.style.color = "rgb(var(--local-accent-rgb))";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(var(--local-accent-rgb),0.08)";
                                    e.currentTarget.style.border = "1px solid rgba(var(--local-accent-rgb),0.3)";
                                    e.currentTarget.style.color = "rgba(var(--local-accent-rgb),0.7)";
                                }}
                            >
                                <RotateCcw style={{ width: "9px", height: "9px" }} aria-hidden="true" />
                                New Prompt
                            </button>
                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="Copy generated code"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "3px 8px",
                                    borderRadius: "5px",
                                    fontSize: "8px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    border: "1px solid rgba(var(--local-accent-rgb),0.2)",
                                    color: copied ? "#10b981" : "rgba(var(--local-accent-rgb),0.6)",
                                    background: "rgba(var(--local-accent-rgb),0.04)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(var(--local-accent-rgb),0.12)";
                                    e.currentTarget.style.border = "1px solid rgba(var(--local-accent-rgb),0.3)";
                                    if (!copied) e.currentTarget.style.color = "rgba(var(--local-accent-rgb),0.9)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(var(--local-accent-rgb),0.04)";
                                    e.currentTarget.style.border = "1px solid rgba(var(--local-accent-rgb),0.2)";
                                    if (!copied) e.currentTarget.style.color = "rgba(var(--local-accent-rgb),0.6)";
                                }}
                            >
                                {copied
                                    ? <><Check style={{ width: "9px", height: "9px" }} aria-hidden="true" />Copied</>
                                    : <><Copy style={{ width: "9px", height: "9px" }} aria-hidden="true" />Copy</>
                                }
                            </button>
                        </div>
                    </div>

                    <div
                        className="custom-scrollbar"
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            overflowX: "auto",
                            background: "rgba(var(--local-accent-rgb),0.03)",
                            border: "1px solid rgba(var(--local-accent-rgb),0.15)",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
                        }}
                    >
                        <pre style={{
                            margin: 0,
                            fontFamily: "monospace",
                            fontSize: "10.5px",
                            lineHeight: "1.65",
                            color: "rgba(var(--local-accent-rgb),0.9)",
                            whiteSpace: "pre",
                        }}>
                            {generatedCode.split("\n").map((line, i) => {
                                const trimmed = line.trimStart();
                                const indent = line.length - trimmed.length;
                                if (trimmed.startsWith("--") || trimmed.startsWith("//")) {
                                    return (
                                        <span key={i} style={{ display: "block", paddingLeft: `${indent * 7}px` }}>
                                            <span style={{ color: "rgba(var(--local-accent-rgb),0.5)", fontStyle: "italic" }}>{trimmed}</span>
                                        </span>
                                    );
                                }
                                const kwRe = /\b(IF|THEN|ELSE|END|WHILE|DO|FOR|FROM|TO|FUNCTION|CALL|SET|RETURN|BREAK|CONTINUE|AND|OR|NOT|TRUE|FALSE)\b/g;
                                const cmdRe = /\b(MOVE|MOVE_FAST|BACKUP|FIRE|BURST_FIRE|SCAN|PATHFIND|STOP|WAIT|SHIELD|CLOAK|DASH|MINE|TELEPORT|TAUNT|BROADCAST|RECEIVE)\b/g;
                                const html = trimmed
                                    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                                    .replace(kwRe, '<span style="color:rgb(var(--local-accent-rgb));font-weight:700">$1</span>')
                                    .replace(cmdRe, '<span style="color:rgb(var(--local-accent-rgb));font-weight:600">$1</span>');
                                return (
                                    <span key={i} style={{ display: "block", paddingLeft: `${indent * 7}px` }}
                                        dangerouslySetInnerHTML={{ __html: html }} />
                                );
                            })}
                            {isGenerating && (
                                <span style={{
                                    display: "inline-block",
                                    width: "2px", height: "14px",
                                    background: "rgb(var(--arena-purple-rgb))",
                                    animation: "blink 1s step-end infinite",
                                    verticalAlign: "text-bottom",
                                    marginLeft: "2px",
                                }} />
                            )}
                        </pre>
                    </div>

                    {/* Insert Button */}
                    <button
                        type="button"
                        onClick={handleInsert}
                        style={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "9px 16px",
                            borderRadius: "8px",
                            fontSize: "9.5px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            border: "1px solid rgba(var(--local-accent-rgb),0.6)",
                            color: "rgb(var(--local-accent-rgb))",
                            background: "rgba(var(--local-accent-rgb),0.1)",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(var(--local-accent-rgb),0.22)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(var(--local-accent-rgb),0.1)"; }}
                    >
                        {isMobile ? "Insert & Open Editor" : "Insert into Editor"}
                    </button>
                </div>
            )}
        </div>
    );
}
