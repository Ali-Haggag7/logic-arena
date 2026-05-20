import React from "react";
import dynamic from "next/dynamic";

const AliScriptEditor = dynamic(
  () => import("../../../../../../components/editor/AliScriptEditor").then((module) => module.AliScriptEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[300px] rounded-xl border border-accent/20 bg-bg-primary">
        <div className="h-full min-h-[300px] animate-pulse bg-accent/[0.035]" />
      </div>
    ),
  },
);

interface CampaignScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  isMobile: boolean;
  onRun?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export function CampaignScriptEditor({
  value,
  onChange,
  isMobile,
  onRun,
  readOnly,
  placeholder,
  className,
}: CampaignScriptEditorProps) {
  return (
    <AliScriptEditor
      value={value}
      onChange={onChange}
      isMobile={isMobile}
      onRun={onRun}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className}
    />
  );
}
