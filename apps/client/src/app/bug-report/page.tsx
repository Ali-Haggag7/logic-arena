"use client";

import React, { useState } from "react";
import Link from "next/link";

type Severity = "" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const SEVERITY_COLORS: Record<Exclude<Severity, "">, string> = {
  LOW: "rgba(var(--accent-rgb),0.06)",
  MEDIUM: "rgba(var(--accent-rgb),0.12)",
  HIGH: "rgba(234,179,8,0.12)",
  CRITICAL: "rgba(239,68,68,0.12)",
};

export default function BugReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [severity, setSeverity] = useState<Severity>("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async submit
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
              ⌐ COMMAND_CENTER_REPORT ¬
            </p>
            <h1 className="text-4xl font-black tracking-[0.15em] text-accent drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)] mb-4 uppercase">
              Submit a Bug
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Encountered an issue in the arena? Transmit a full report to our engineering team.
            </p>
          </div>
        </div>

        {/* Form / Success */}
        <div className="bg-card border border-accent/50 rounded-xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full border border-accent/40 bg-accent/5 flex items-center justify-center text-2xl text-accent">
                ✓
              </div>
              <h2 className="text-[14px] font-black tracking-[0.25em] text-accent uppercase">
                REPORT TRANSMITTED TO COMMAND CENTER ✓
              </h2>
              <p className="text-[11px] text-text-secondary max-w-sm leading-relaxed">
                Our engineering team will triage your report within 48 hours. Thank you for keeping the arena clean.
              </p>
              <button
                onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setSteps(""); setSeverity(""); }}
                className="mt-4 px-6 py-2.5 text-[10px] tracking-[0.3em] font-black uppercase border border-accent/30 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 hover:border-accent/60 transition-all duration-150"
              >
                SUBMIT ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Bug Title */}
              <div>
                <label htmlFor="bug-title" className={labelClass}>// BUG_TITLE</label>
                <input
                  id="bug-title"
                  type="text"
                  className={inputClass}
                  placeholder="Short, descriptive title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="bug-description" className={labelClass}>// DESCRIPTION</label>
                <textarea
                  id="bug-description"
                  className={inputClass}
                  placeholder="What happened? What did you expect to happen?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  disabled={loading}
                />
              </div>

              {/* Steps to Reproduce */}
              <div>
                <label htmlFor="bug-steps" className={labelClass}>// STEPS_TO_REPRODUCE</label>
                <textarea
                  id="bug-steps"
                  className={inputClass}
                  placeholder={"1. Open the arena...\n2. Click...\n3. Observe..."}
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  required
                  rows={4}
                  disabled={loading}
                />
              </div>

              {/* Severity */}
              <div>
                <label htmlFor="bug-severity" className={labelClass}>// SEVERITY_LEVEL</label>
                <select
                  id="bug-severity"
                  className={inputClass + " cursor-pointer"}
                  style={{
                    background: severity ? SEVERITY_COLORS[severity as Exclude<Severity, "">] : undefined,
                  }}
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Severity)}
                  required
                  disabled={loading}
                >
                  <option value="" disabled>SELECT SEVERITY...</option>
                  <option value="LOW">LOW — Minor visual glitch, cosmetic issue</option>
                  <option value="MEDIUM">MEDIUM — Feature partially broken</option>
                  <option value="HIGH">HIGH — Combat logic affected, data loss possible</option>
                  <option value="CRITICAL">CRITICAL — Platform crash, security vulnerability</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 bg-accent/10 border border-accent/30 text-accent font-black text-[11px] tracking-[0.3em] uppercase rounded-lg hover:bg-accent/20 hover:border-accent/60 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "TRANSMITTING..." : "TRANSMIT BUG REPORT →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
