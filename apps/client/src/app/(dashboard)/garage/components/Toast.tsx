"use client";

import React from "react";

export type ToastState = { type: "success" | "error"; message: string } | null;

interface ToastProps {
  toast: ToastState;
  isMobile: boolean;
}

export function Toast({ toast, isMobile }: ToastProps) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";

  return (
    <div
      className="fixed z-50 font-mono text-[11px] tracking-[0.15em] px-5 py-3 rounded-lg border pointer-events-none whitespace-nowrap"
      style={{
        bottom: isMobile ? "110px" : "32px",
        left: "50%",
        transform: "translateX(-50%)",
        animation: "garageSlideUp 0.25s ease",
        background: isSuccess
          ? "rgba(var(--accent-rgb),0.08)"
          : "rgba(239,68,68,0.10)",
        border: `1px solid ${
          isSuccess
            ? "rgba(var(--accent-rgb),0.35)"
            : "rgba(239,68,68,0.35)"
        }`,
        color: isSuccess ? "var(--accent)" : "#fca5a5",
        boxShadow: isSuccess
          ? "0 0 24px rgba(var(--accent-rgb),0.15)"
          : "0 0 24px rgba(239,68,68,0.15)",
      }}
    >
      {isSuccess ? "✓ " : "✗ "}
      {toast.message}
    </div>
  );
}
