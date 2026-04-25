"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const THEME_COLORS: Record<string, string> = {
  cyberpunk: "#030712",
  light: "#ffffff",
  desert: "#fdf6e3",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProviderInner>{children}</ThemeProviderInner>;
}

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="cyberpunk"
      themes={["cyberpunk", "light", "desert"]}
      enableSystem={false}
    >
      <ThemeMetaSync />
      {children}
    </NextThemeProvider>
  );
}

/** Keeps <meta name="theme-color"> AND body background in sync */
function ThemeMetaSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const color = THEME_COLORS[resolvedTheme ?? "cyberpunk"] ?? "#030712";

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);

    document.body.style.backgroundColor = color;
  }, [resolvedTheme]);

  return null;
}