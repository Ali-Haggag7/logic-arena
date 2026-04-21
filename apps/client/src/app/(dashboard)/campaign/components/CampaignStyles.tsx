import React from "react";

export function CampaignStyles() {
    return (
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(var(--accent-rgb),0.5), 0 0 30px rgba(var(--accent-rgb),0.2); }
          50%       { box-shadow: 0 0 24px rgba(var(--accent-rgb),0.9), 0 0 55px rgba(var(--accent-rgb),0.4); }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        .level-node { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .level-node:hover { transform: translateY(-3px); }
      `}</style>
    );
}
