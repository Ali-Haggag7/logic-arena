import React from 'react';
import { GitHubIcon, LinkedinIcon, PortfolioIcon } from './Icons';

export function BottomBar({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="relative z-10 border-t border-accent/50 bg-bg-secondary/50">
      {isMobile ? (
        <div className="flex flex-col items-center gap-2 px-5 py-5">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-green-500 shrink-0"
              style={{ animation: "status-pulse 2s ease-in-out infinite" }}
            />
            <span className="text-[10px] tracking-[0.22em] text-green-500 font-black uppercase">
              ALL SYSTEMS ONLINE
            </span>
          </div>
          <span className="text-[10px] text-text-secondary tracking-[0.2em]">
            © LOGIC ARENA 2026
          </span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <span className="text-[10px] text-text-secondary tracking-[0.2em]">
            © LOGIC ARENA 2026
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ animation: "status-pulse 2s ease-in-out infinite" }}
            />
            <span className="text-[10px] tracking-[0.2em] text-green-500 font-black uppercase">
              ALL SYSTEMS ONLINE
            </span>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "GitHub", href: "https://github.com/Ali-Haggag7/logic-arena", el: <GitHubIcon size={18} /> },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/ali-haggag7", el: <LinkedinIcon size={18} /> },
              { label: "Portfolio", href: "https://alihaggag.me", el: <PortfolioIcon size={18} /> },
            ].map(({ label, href, el }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-text-secondary hover:text-accent transition-colors duration-150"
                onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 6px var(--accent))")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
              >
                {el}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
