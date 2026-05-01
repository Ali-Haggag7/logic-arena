"use client";

import React from "react";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

export type SectionId =
  | "identity"
  | "security"
  | "appearance"
  | "arena"
  | "notifications";

export const SECTIONS: { id: SectionId; label: string; shortLabel: string }[] = [
  { id: "identity", label: "MY PROFILE", shortLabel: "PROFILE" },
  { id: "security", label: "SECURITY", shortLabel: "SECURITY" },
  { id: "appearance", label: "APPEARANCE", shortLabel: "APPEARANCE" },
  { id: "arena", label: "ARENA PREFERENCES", shortLabel: "ARENA" },
  { id: "notifications", label: "NOTIFICATIONS", shortLabel: "NOTIFS" },
];

export interface FeedbackState {
  status: "idle" | "success" | "error";
  message?: string;
}

export function useFeedback() {
  const [state, setState] = React.useState<FeedbackState>({ status: "idle" });
  const flash = React.useCallback((status: "success" | "error", message?: string) => {
    setState({ status, message });
    setTimeout(() => setState({ status: "idle" }), 2500);
  }, []);
  return { state, flash };
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-accent/60 -mb-1" />
      <span className="text-[10px] font-black tracking-[0.4em] uppercase text-accent">
        {children}
      </span>
      <div className="w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-accent/60 mt-1" />
    </div>
  );
}

export function SettingsInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  isGuest,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  disabled?: boolean;
  isGuest?: boolean;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isDisabledOrGuest = disabled || isGuest;
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] tracking-[0.22em] text-accent/50 font-bold uppercase">
        {label} {isGuest && "(GUEST LOCKED)"}
      </label>
      <div className="relative">
        <input
          type={actualType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabledOrGuest}
          readOnly={isDisabledOrGuest}
          className={`w-full bg-bg-secondary border border-accent/10 rounded-lg px-4 py-3 text-text-primary focus:border-accent/70 focus:outline-none focus:ring-1 focus:ring-accent/70 transition-colors font-mono text-[12px] placeholder:text-text-secondary/40 ${isDisabledOrGuest ? "opacity-50 cursor-not-allowed" : ""
            } ${isGuest ? "border-dashed" : ""} ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isDisabledOrGuest}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-accent/50 hover:text-accent transition-colors ${isDisabledOrGuest ? "opacity-50 cursor-not-allowed cursor-pointer" : "cursor-pointer"}`}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function SaveButton({
  onClick,
  loading,
  feedback,
  label = "SAVE CHANGES",
  disabled,
  isGuest,
}: {
  onClick: () => void;
  loading: boolean;
  feedback: FeedbackState;
  label?: string;
  disabled?: boolean;
  isGuest?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => !isGuest && onClick()}
        disabled={loading || isGuest || disabled}
        className={`rounded-lg px-6 py-2 text-[10px] tracking-widest font-bold font-mono transition-all duration-150 ${loading ? "opacity-50 cursor-wait" : (isGuest || disabled) ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/20"
          } ${isGuest
            ? "bg-accent/5 border border-accent/10 text-accent/40"
            : "bg-accent/10 border border-accent/30 text-accent"
          } ${(disabled && !loading && !isGuest) ? "opacity-40" : ""}`}
      >
        {loading ? "PROCESSING..." : label}
      </button>
      {feedback.status === "success" && (
        <span className="text-[10px] text-green-400 tracking-[0.12em] animate-pulse flex items-center gap-1" aria-live="polite" role="status">
          <CheckCircle className="w-3 h-3" /> {feedback.message ?? "UPDATED"}
        </span>
      )}
      {feedback.status === "error" && (
        <span className="text-[10px] text-red-400 tracking-[0.12em] flex items-center gap-1" aria-live="polite" role="status">
          <XCircle className="w-3 h-3" /> {feedback.message ?? "ERROR"}
        </span>
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled,
  isGuest,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  ariaLabel?: string;
  disabled?: boolean;
  isGuest?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center min-w-[44px] min-h-[44px] justify-center ${disabled || isGuest ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${isGuest ? "grayscale" : ""}`}
    >
      <input
        aria-label={ariaLabel || id}
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => !disabled && !isGuest && onChange(e.target.checked)}
        disabled={disabled || isGuest}
      />
      <div
        className={`w-11 h-6 rounded-full border transition-all duration-200 relative ${checked
          ? "bg-accent/20 border-accent/60"
          : "bg-bg-secondary border-accent/10"
          } ${isGuest ? "border-dashed opacity-40" : ""}`}
      >
        <div
          className={`absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200 ${checked ? "left-[22px] bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]" : "left-[3px] bg-text-secondary/30"
            }`}
        />
      </div>
    </label>
  );
}

function calcStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

export const STRENGTH_LABELS = ["WEAK", "POOR", "FAIR", "GOOD", "STRONG", "MAX"];
export const STRENGTH_COLORS = [
  "var(--sem-danger)",
  "var(--sem-warning)",
  "var(--sem-warning)",
  "var(--sem-success)",
  "var(--sem-success)",
  "var(--accent)",
];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const strength = calcStrength(password);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? "" : "bg-bg-secondary border border-accent/10"}`}
            style={i < strength ? { backgroundColor: STRENGTH_COLORS[strength] } : undefined}
          />
        ))}
      </div>
      <span className="text-[9px] tracking-[0.2em] text-accent/50 font-bold">
        {STRENGTH_LABELS[strength]}
      </span>
    </div>
  );
}
