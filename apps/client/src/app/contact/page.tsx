"use client";

import React, { useState } from "react";
import Link from "next/link";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: <GitHubIcon />, label: "GitHub", href: "#" },
  { icon: <DiscordIcon />, label: "Discord", href: "#" },
  { icon: <TwitterXIcon />, label: "Twitter / X", href: "#" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const inputClass =
    "w-full bg-bg-primary/80 border border-accent/50 rounded-lg p-3.5 text-text-primary text-[12px] placeholder:text-text-secondary/40 outline-none focus:border-accent/60 focus:bg-accent/5 transition-all duration-150 font-mono resize-none";

  const labelClass =
    "block text-[9px] font-black tracking-[0.35em] text-accent/60 uppercase mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-bg-primary font-mono relative overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(var(--accent-rgb),0.012) 3px, rgba(var(--accent-rgb),0.012) 4px)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-accent hover:text-accent/70 uppercase mb-10 transition-colors duration-150"
        >
          ← BACK
        </Link>

        {/* Hero */}
        <div className="mb-12 relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br" />
          <div className="px-6 py-8">
            <p className="text-[10px] font-black tracking-[0.45em] text-accent/60 uppercase mb-3">
              ⌐ SECURE_CHANNEL ¬
            </p>
            <h1 className="text-4xl font-black tracking-[0.15em] text-accent drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)] mb-4 uppercase">
              Contact Us
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Open a secure channel to the Logic Arena command center. We respond within 24–48 hours.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-card border border-accent/50 rounded-xl p-6 mb-6" style={{ boxShadow: "var(--card-shadow)" }}>
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full border border-accent/40 bg-accent/5 flex items-center justify-center text-2xl text-accent">
                ✓
              </div>
              <h2 className="text-[14px] font-black tracking-[0.25em] text-accent uppercase">
                MESSAGE RECEIVED BY COMMAND CENTER ✓
              </h2>
              <p className="text-[11px] text-text-secondary max-w-sm leading-relaxed">
                Your message has been securely transmitted. Expect a response within 24–48 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                className="mt-4 px-6 py-2.5 text-[10px] tracking-[0.3em] font-black uppercase border border-accent/30 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 hover:border-accent/60 transition-all duration-150"
              >
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className={labelClass}>// OPERATOR_NAME</label>
                  <input
                    id="contact-name"
                    type="text"
                    className={inputClass}
                    placeholder="Your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className={labelClass}>// EMAIL_ADDRESS</label>
                  <input
                    id="contact-email"
                    type="email"
                    className={inputClass}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" className={labelClass}>// SUBJECT</label>
                <input
                  id="contact-subject"
                  type="text"
                  className={inputClass}
                  placeholder="Brief subject line..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className={labelClass}>// MESSAGE</label>
                <textarea
                  id="contact-message"
                  className={inputClass}
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 bg-accent/10 border border-accent/30 text-accent font-black text-[11px] tracking-[0.3em] uppercase rounded-lg hover:bg-accent/20 hover:border-accent/60 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "TRANSMITTING..." : "OPEN SECURE CHANNEL →"}
              </button>
            </form>
          )}
        </div>

        {/* Social row */}
        <div className="bg-card border border-accent/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ boxShadow: "var(--card-shadow)" }}>
          <p className="text-[10px] font-black tracking-[0.25em] text-text-secondary uppercase">
            OR REACH US ON
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-accent/50 hover:border-accent/50 bg-bg-secondary/50 hover:bg-accent/10 text-text-secondary hover:text-accent transition-all duration-150 text-[10px] tracking-[0.2em] font-black uppercase"
                style={{ minHeight: "44px" }}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
