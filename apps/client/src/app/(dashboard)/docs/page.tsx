"use client";

import React, { useState } from "react";
import { SAMPLE_SCRIPT } from "./constants/docsData";
import { HeroSection } from "./components/HeroSection";
import { QuickReferenceSection } from "./components/QuickReferenceSection";
import { InteractivePlayground } from "./components/InteractivePlayground";
import { BattleTacticsSection } from "./components/BattleTacticsSection";
import { CommandReferenceSection } from "./components/CommandReferenceSection";

export default function DocsPage() {
  const [script, setScript] = useState(SAMPLE_SCRIPT);
  const [parsed, setParsed] = useState<string[]>([]);

  const handleParse = () => {
    const lines = script
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setParsed(lines);
  };

  const loadCodeToPlayground = (code: string) => {
    setScript(code);
    const editor = document.getElementById("aliscript-editor");
    if (editor) {
      window.scrollTo({
        top: editor.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(34,211,238,0.3), 0 0 24px rgba(34,211,238,0.1); }
          50%      { box-shadow: 0 0 16px rgba(34,211,238,0.6), 0 0 48px rgba(34,211,238,0.2); }
        }
        .docs-textarea {
          resize: vertical;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 8px;
          color: #22d3ee;
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          line-height: 1.7;
          padding: 16px;
          width: 100%;
          min-height: 200px;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.05em;
        }
        .docs-textarea:focus {
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 0 2px rgba(34,211,238,0.08), 0 0 20px rgba(34,211,238,0.1);
        }
        .docs-scrollbar::-webkit-scrollbar { width: 4px; }
        .docs-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .docs-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 2px; }
        .cmd-row:hover { background-color: rgba(34,211,238,0.03); }
        .quick-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .quick-card:hover { transform: translateY(-3px); }
      `}</style>

      <div className="min-h-screen bg-[#030712] font-mono text-[#22d3ee]/90 relative overflow-hidden">
        {/* Grid background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8,145,178,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Outer Container */}
        <div className="max-w-[1100px] mx-auto px-6 pt-12 pb-[100px] relative z-10 animate-[fadeIn_0.35s_ease]">
          <HeroSection />
          
          <QuickReferenceSection />

          <InteractivePlayground
            script={script}
            setScript={setScript}
            parsed={parsed}
            onParse={handleParse}
          />

          <BattleTacticsSection onLoadScript={loadCodeToPlayground} />

          <CommandReferenceSection />
        </div>
      </div>
    </>
  );
}
