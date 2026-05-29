"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PortraitGuard() {
  const pathname = usePathname() || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAllowedLandscape = pathname.startsWith("/arena");

    // Attempt to lock to portrait natively on Android for non-arena pages
    if (!isAllowedLandscape) {
      try {
        interface ExtendedScreenOrientation extends ScreenOrientation {
          lock?: (orientation: string) => Promise<void>;
        }
        
        const orientation = screen?.orientation as ExtendedScreenOrientation | undefined;
        
        if (typeof orientation?.lock === "function") {
          orientation.lock("portrait").catch(() => {
            // Ignore errors (iOS, unsupported, or user hasn't interacted)
          });
        }
      } catch (e) {}
    }

    const checkOrientation = () => {
      // Don't apply if we are in an allowed page (like /arena)
      if (pathname.startsWith("/arena")) {
        document.documentElement.classList.remove("lock-portrait");
        return;
      }

      // We lock phones in landscape.
      // Phones in landscape typically have a very small innerHeight (e.g. < 600px).
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      const isShortScreen = window.innerHeight < 600;

      if (isLandscape && isShortScreen) {
        document.documentElement.classList.add("lock-portrait");
      } else {
        document.documentElement.classList.remove("lock-portrait");
      }
    };

    // Check immediately
    checkOrientation();

    // Listen for orientation/resize changes
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    mediaQuery.addEventListener("change", checkOrientation);
    window.addEventListener("resize", checkOrientation);

    return () => {
      document.documentElement.classList.remove("lock-portrait");
      mediaQuery.removeEventListener("change", checkOrientation);
      window.removeEventListener("resize", checkOrientation);
    };
  }, [pathname]);

  return null;
}
