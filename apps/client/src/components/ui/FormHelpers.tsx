"use client";

import React from "react";

const LABEL_CLASS = "block text-[9px] font-black tracking-[0.35em] uppercase mb-2" as const;

const INPUT_CLASS =
  "w-full rounded-xl p-3.5 text-[13px] outline-none transition-all duration-200 font-mono resize-none" as const;

function baseStyle() {
  return {
    background: "rgba(var(--bg-primary,#030712),0.8)" as const,
    border: "1px solid rgba(var(--accent-rgb),0.25)" as const,
    color: "var(--text-primary)" as const,
  };
}

function focusStyle(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.6)";
  e.currentTarget.style.background = "rgba(var(--accent-rgb),0.04)";
}

function blurStyle(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.25)";
  e.currentTarget.style.background = "rgba(var(--bg-primary,#030712),0.8)";
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className={LABEL_CLASS}
      style={{ color: "rgba(var(--accent-rgb),0.55)", fontFamily: "var(--font-mono)" }}
    >
      {children}
    </label>
  );
}

export function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={INPUT_CLASS}
      style={{ ...baseStyle(), ...(props.style || {}) }}
      onFocus={(e) => { focusStyle(e); props.onFocus?.(e); }}
      onBlur={(e) => { blurStyle(e); props.onBlur?.(e); }}
    />
  );
}

export function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={INPUT_CLASS}
      style={{ ...baseStyle(), ...(props.style || {}) }}
      onFocus={(e) => { focusStyle(e); props.onFocus?.(e); }}
      onBlur={(e) => { blurStyle(e); props.onBlur?.(e); }}
    />
  );
}
