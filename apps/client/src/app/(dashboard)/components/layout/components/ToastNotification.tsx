import React from "react";

interface ToastNotificationProps {
  toast: { message: string; type: "info" | "error" } | null;
  isMobile: boolean;
}

export function ToastNotification({ toast, isMobile }: ToastNotificationProps) {
  if (!toast) return null;

  return (
    <div
      className="fixed left-1/2 z-[100] font-mono text-[11px] tracking-[0.15em] px-5 py-3 rounded-lg border pointer-events-none whitespace-nowrap"
      style={{
        bottom: isMobile ? "96px" : "24px",
        transform: "translateX(-50%)",
        animation: "fadeInUp 0.25s ease",
        background:
          toast.type === "info"
            ? "rgba(var(--accent-rgb),0.08)"
            : "rgba(var(--color-red-500),0.10)",
        border: `1px solid ${
          toast.type === "info"
            ? "rgba(var(--accent-rgb),0.35)"
            : "rgba(var(--color-red-500),0.35)"
        }`,
        color: toast.type === "info" ? "var(--accent)" : "#fca5a5",
        boxShadow:
          toast.type === "info"
            ? "0 0 20px rgba(var(--accent-rgb),0.1)"
            : "0 0 20px rgba(var(--color-red-500),0.1)",
      }}
    >
      {toast.message}
    </div>
  );
}
