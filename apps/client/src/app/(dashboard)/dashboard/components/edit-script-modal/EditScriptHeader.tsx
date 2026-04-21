import React from "react";
import { X } from "lucide-react";

interface EditScriptHeaderProps {
    title: string;
    version: number;
    onClose: () => void;
}

export function EditScriptHeader({ title, version, onClose }: EditScriptHeaderProps) {
    return (
        <div className="em-header">
            <div className="em-header-left">
                <span className="em-title">{title}</span>
                <span className="em-badge">V.{version}</span>
            </div>
            <button onClick={onClose} className="em-close" aria-label="Close editor">
                <X size={15} />
            </button>
        </div>
    );
}
