"use client";

import React, { useState } from "react";
import Link from "next/link";

type Priority = "" | "NICE_TO_HAVE" | "MODERATE" | "HIGH" | "CRITICAL";

export default function FeatureRequestsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [priority, setPriority] = useState<Priority>("");
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
              ⌐ OPERATOR_INTEL ¬
            </p>
            <h1 className="text-4xl font-black tracking-[0.15em] text-accent drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)] mb-4 uppercase">
              Feature Requests
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Have an idea that would make Logic Arena even more legendary? Submit it below.
              Top requests are reviewed every sprint cycle.
            </p>
          </div>
        </div>

        {/* Sprint note */}
        <div className="mb-6 px-4 py-3 border border-accent/20 bg-accent/5 rounded-lg flex items-start gap-2">
          <span className="text-accent mt-0.5 shrink-0">◈</span>
          <p className="text-[10px] text-accent/70 tracking-[0.15em] leading-relaxed font-black uppercase">
            Top requests are reviewed every sprint cycle — the community votes on what gets built next.
          </p>
        </div>

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
                Your feature request has been logged. Our team reviews community submissions every sprint and the best ideas ship in the next release.
              </p>
              <button
                onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setUseCase(""); setPriority(""); }}
                className="mt-4 px-6 py-2.5 text-[10px] tracking-[0.3em] font-black uppercase border border-accent/30 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 hover:border-accent/60 transition-all duration-150"
              >
                SUBMIT ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Feature Title */}
              <div>
                <label htmlFor="feature-title" className={labelClass}>// FEATURE_TITLE</label>
                <input
                  id="feature-title"
                  type="text"
                  className={inputClass}
                  placeholder="What should we build?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="feature-description" className={labelClass}>// DESCRIPTION</label>
                <textarea
                  id="feature-description"
                  className={inputClass}
                  placeholder="Describe the feature in detail. What problem does it solve?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  disabled={loading}
                />
              </div>

              {/* Use Case */}
              <div>
                <label htmlFor="feature-usecase" className={labelClass}>// USE_CASE</label>
                <textarea
                  id="feature-usecase"
                  className={inputClass}
                  placeholder="How would you use this? Walk us through a concrete scenario..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  required
                  rows={3}
                  disabled={loading}
                />
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="feature-priority" className={labelClass}>// PRIORITY</label>
                <select
                  id="feature-priority"
                  className={inputClass + " cursor-pointer"}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  required
                  disabled={loading}
                >
                  <option value="" disabled>SELECT PRIORITY...</option>
                  <option value="NICE_TO_HAVE">NICE TO HAVE — Quality of life improvement</option>
                  <option value="MODERATE">MODERATE — Significantly improves workflow</option>
                  <option value="HIGH">HIGH — Missing feature blocking my strategy</option>
                  <option value="CRITICAL">CRITICAL — Core to the arena experience</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 bg-accent/10 border border-accent/30 text-accent font-black text-[11px] tracking-[0.3em] uppercase rounded-lg hover:bg-accent/20 hover:border-accent/60 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "TRANSMITTING..." : "TRANSMIT FEATURE REQUEST →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
