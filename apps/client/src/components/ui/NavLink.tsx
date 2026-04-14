"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: string;
}

export default function NavLink({ href, label, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "6px",
        borderLeft: isActive
          ? "2px solid #22d3ee"
          : "2px solid transparent",
        backgroundColor: isActive
          ? "rgba(34, 211, 238, 0.08)"
          : "transparent",
        color: isActive ? "#22d3ee" : "rgba(34, 211, 238, 0.4)",
        textDecoration: "none",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "0.18em",
        fontFamily: "var(--font-geist-mono), monospace",
        transition: "all 0.2s ease",
        position: "relative",
        ...(isActive && {
          boxShadow: "-4px 0 12px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.04)",
          textShadow: "0 0 10px rgba(34, 211, 238, 0.7)",
        }),
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = "rgba(34, 211, 238, 0.85)";
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(34, 211, 238, 0.05)";
          (e.currentTarget as HTMLAnchorElement).style.borderLeftColor = "rgba(34, 211, 238, 0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = "rgba(34, 211, 238, 0.4)";
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.borderLeftColor = "transparent";
        }
      }}
    >
      {icon && (
        <span
          style={{
            fontSize: "13px",
            width: "16px",
            textAlign: "center",
            flexShrink: 0,
            opacity: isActive ? 1 : 0.6,
          }}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
      {isActive && (
        <span
          style={{
            marginLeft: "auto",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#22d3ee",
            boxShadow: "0 0 8px #22d3ee",
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}
