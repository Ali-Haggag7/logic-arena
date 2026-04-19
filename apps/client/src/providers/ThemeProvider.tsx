"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="cyberpunk"
      themes={["cyberpunk", "light", "desert"]}
      enableSystem={false}
    >
      {children}
    </NextThemeProvider>
  );
}
