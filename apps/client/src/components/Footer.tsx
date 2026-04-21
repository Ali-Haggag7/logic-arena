"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "../hooks/useMediaQuery";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Campaigns", href: "/campaign" },
  { label: "Replay Theater", href: "/replay" },
  { label: "Docs", href: "/docs" },
];

const ARENA_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "AliScript Language", href: "/docs#aliscript" },
  { label: "Robot Builder", href: "/garage" },
  { label: "Join Tournament", href: "/tournaments" },
  { label: "Practice Mode", href: "/arena" },
  { label: "Patch Notes", href: "/patch-notes" },
];

const COMMUNITY_LINKS = [
  { label: "Discord Server", href: "#" },
  { label: "GitHub Repository", href: "#" },
  { label: "Hall of Fame", href: "/leaderboard#hall-of-fame" },
  { label: "Submit a Bug", href: "/bug-report" },
  { label: "Feature Requests", href: "/feature-requests" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Contact Us", href: "/contact" },
];

const ACCORDION_SECTIONS = [
  { title: "Navigate", links: NAV_LINKS },
  { title: "Arena", links: ARENA_LINKS },
  { title: "Community", links: COMMUNITY_LINKS },
  { title: "Legal", links: LEGAL_LINKS },
] as const;

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function PortfolioIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Desktop SectionHeader ────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-accent/40 text-xs font-mono select-none">⌐</span>
      <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-accent">{children}</h3>
      <span className="text-accent/40 text-xs font-mono select-none">¬</span>
    </div>
  );
}

// ─── Desktop FooterLink ───────────────────────────────────────────────────────

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-[12px] text-text-secondary hover:text-accent py-1 transition-colors duration-150 leading-relaxed"
    >
      {children}
    </Link>
  );
}

// ─── Desktop Social Icons ─────────────────────────────────────────────────────

function DesktopSocialIcons() {
  const icons = [
    { label: "GitHub", el: <GitHubIcon size={18} /> },
    { label: "LinkedIn", el: <LinkedinIcon size={18} /> },
    { label: "Portfolio", el: <PortfolioIcon size={18} /> },
  ];
  return (
    <div className="flex items-center gap-3 mt-4">
      {icons.map(({ label, el }) => (
        <a
          key={label}
          href="#"
          aria-label={label}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-accent/50 hover:border-accent/50 bg-bg-secondary/50 hover:bg-accent/10 text-text-secondary hover:text-accent transition-all duration-150"
          onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 6px var(--accent))")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
        >
          {el}
        </a>
      ))}
    </div>
  );
}

// ─── Mobile Social Icons (48×48 touch targets) ───────────────────────────────

function MobileSocialIcons() {
  const icons = [
    { label: "GitHub", el: <GitHubIcon size={22} /> },
    { label: "LinkedIn", el: <LinkedinIcon size={22} /> },
    { label: "Portfolio", el: <PortfolioIcon size={22} /> },
  ];
  return (
    <div className="flex items-center gap-3 mt-5">
      {icons.map(({ label, el }) => (
        <a
          key={label}
          href="#"
          aria-label={label}
          className="flex items-center justify-center rounded-xl border border-accent/50 bg-bg-secondary/60 text-text-secondary hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-colors duration-150"
          style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
          onTouchStart={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 6px var(--accent))")}
          onTouchEnd={(e) => (e.currentTarget.style.filter = "")}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 6px var(--accent))")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
        >
          {el}
        </a>
      ))}
    </div>
  );
}

// ─── Mobile Accordion Card ────────────────────────────────────────────────────

function AccordionCard({
  title,
  links,
  isOpen,
  onToggle,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  // Each link row is 44px, plus 8px top + bottom padding inside content
  const contentHeight = links.length * 44 + 16;

  return (
    <div
      className="border-t border-accent/50 w-full"
      style={{
        boxShadow: isOpen ? "inset 3px 0 0 var(--accent)" : "none",
        transition: "box-shadow 200ms ease",
      }}
    >
      {/* Tap target — full width, min 44px tall */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between bg-transparent text-left"
        style={{ minHeight: 44, padding: "0 20px" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-accent/40 text-xs font-mono select-none">⌐</span>
          <span className="text-[10px] font-black tracking-[0.38em] uppercase text-accent">
            {title}
          </span>
          <span className="text-accent/40 text-xs font-mono select-none">¬</span>
        </div>
        <span className="text-accent/60 shrink-0">
          <ChevronIcon expanded={isOpen} />
        </span>
      </button>

      {/* Animated content panel */}
      <div
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : "0px",
          overflow: "hidden",
          transition: "max-height 300ms ease",
        }}
      >
        <div className="flex flex-col" style={{ padding: "8px 0 8px 0" }}>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center text-[13px] text-text-secondary hover:text-accent transition-colors duration-150"
              style={{ minHeight: 44, padding: "0 20px" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Accordion Layout (single-open) ────────────────────────────────────

function MobileAccordionLayout() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (title: string) =>
    setOpenSection((prev) => (prev === title ? null : title));

  return (
    <div className="relative z-10 w-full">
      {/* Brand section — always visible, never collapsible */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 border border-accent/40 rounded-lg flex items-center justify-center bg-accent/5">
            <span className="text-accent">⬡</span>
          </div>
          <h2 className="footer-brand-name text-[16px] font-black tracking-[0.2em] text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)] cursor-default select-none">
            LOGIC ARENA
          </h2>
        </div>
        <p className="text-[9px] font-black tracking-[0.38em] text-accent/60 uppercase mb-3">
          WHERE CODE MEETS COMBAT
        </p>
        <p className="text-[12px] text-text-secondary leading-relaxed max-w-[340px]">
          The competitive programming arena where your algorithms fight to the death.
        </p>
        <MobileSocialIcons />
      </div>

      {/* Accordion sections — only one open at a time */}
      {ACCORDION_SECTIONS.map((section) => (
        <AccordionCard
          key={section.title}
          title={section.title}
          links={section.links}
          isOpen={openSection === section.title}
          onToggle={() => toggle(section.title)}
        />
      ))}
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <style>{`
        @keyframes footer-glitch {
          0%, 100% { clip-path: none; transform: none; }
          92%       { clip-path: none; transform: none; }
          93%       { clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); transform: translateX(-3px); }
          94%       { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); transform: translateX(3px); }
          95%       { clip-path: none; transform: none; }
          97%       { clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%); transform: translateX(-2px); }
          98%       { clip-path: none; transform: none; }
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(34,197,94,0); }
        }
        .footer-brand-name:hover {
          animation: footer-glitch 0.6s steps(1) forwards;
        }
      `}</style>

      <footer
        className="relative border-t border-accent/50 bg-bg-primary font-mono overflow-hidden w-full"
        aria-label="Site footer"
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(var(--accent-rgb),0.015) 3px, rgba(var(--accent-rgb),0.015) 4px)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── DESKTOP LAYOUT ── */}
        {!isMobile && (
          <div className="relative z-10 max-w-7xl mx-auto px-8 py-14">
            <div className="grid grid-cols-5 gap-10">
              {/* Brand */}
              <div className="col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border border-accent/40 rounded-lg flex items-center justify-center bg-accent/5 shadow-[0_0_12px_rgba(var(--accent-rgb),0.15)]">
                    <span className="text-accent text-sm">⬡</span>
                  </div>
                  <h2 className="footer-brand-name text-[15px] font-black tracking-[0.2em] text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)] cursor-default select-none">
                    LOGIC ARENA
                  </h2>
                </div>
                <p className="text-[9px] font-black tracking-[0.35em] text-accent/60 uppercase mb-3">
                  WHERE CODE MEETS COMBAT
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
                  The competitive programming arena where your algorithms fight to the death.
                </p>
                <DesktopSocialIcons />
              </div>

              {/* Navigate */}
              <div>
                <SectionHeader>Navigate</SectionHeader>
                <div className="flex flex-col">
                  {NAV_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
                </div>
              </div>

              {/* Arena */}
              <div>
                <SectionHeader>Arena</SectionHeader>
                <div className="flex flex-col">
                  {ARENA_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
                </div>
              </div>

              {/* Community */}
              <div>
                <SectionHeader>Community</SectionHeader>
                <div className="flex flex-col">
                  {COMMUNITY_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
                </div>
              </div>

              {/* Legal */}
              <div>
                <SectionHeader>Legal</SectionHeader>
                <div className="flex flex-col">
                  {LEGAL_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MOBILE LAYOUT ── */}
        {isMobile && (
          <MobileAccordionLayout />
        )}

        {/* ── BOTTOM BAR ── */}
        <div className="relative z-10 border-t border-accent/50 bg-bg-secondary/50">
          {isMobile ? (
            /* Mobile: stack status + copyright, centered */
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
            /* Desktop: three-column row */
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
                  { label: "GitHub", el: <GitHubIcon size={18} /> },
                  { label: "LinkedIn", el: <LinkedinIcon size={18} /> },
                  { label: "Portfolio", el: <PortfolioIcon size={18} /> },
                ].map(({ label, el }) => (
                  <a
                    key={label}
                    href="#"
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
      </footer>
    </>
  );
}
