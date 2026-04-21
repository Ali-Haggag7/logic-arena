"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../../../../lib/api-client";
import { RobotScript } from "./ScriptCard";

import { EditScriptModalStyles } from "./edit-script-modal/EditScriptModalStyles";
import { EditScriptHeader } from "./edit-script-modal/EditScriptHeader";
import { EditScriptEditor } from "./edit-script-modal/EditScriptEditor";
import { EditScriptFooter, FooterStatus } from "./edit-script-modal/EditScriptFooter";

interface EditScriptModalProps {
    script: RobotScript;
    onClose: () => void;
    onOptimisticUpdate: (updated: RobotScript) => void;
    onRevert: (original: RobotScript) => void;
}

export const EditScriptModal = ({
    script,
    onClose,
    onOptimisticUpdate,
    onRevert,
}: EditScriptModalProps) => {
    const [content, setContent] = useState(script.content ?? "");
    const [footerStatus, setFooterStatus] = useState<FooterStatus>("idle");
    const isSaving = useRef(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
        },
        [onClose]
    );

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
            <EditScriptModalStyles />
            <div
                className="em-overlay"
                onClick={handleOverlayClick}
                role="dialog"
                aria-modal="true"
                aria-label={`Edit script: ${script.title}`}
            >
                <div className="em-container">
                    <span className="em-corner em-corner-tl">⌐</span>
                    <span className="em-corner em-corner-tr">¬</span>
                    <span className="em-corner em-corner-bl">⌐</span>
                    <span className="em-corner em-corner-br">¬</span>

                    <EditScriptHeader 
                        title={script.title} 
                        version={script.version} 
                        onClose={onClose} 
                    />

                    <EditScriptEditor 
                        content={content} 
                        setContent={setContent} 
                    />

                    <EditScriptFooter 
                        status={footerStatus}
                        formattedDate={formattedDate}
                        onClose={onClose}
                        onSave={handleSave}
                    />
                </div>
            </div>
        </>
    );
};
