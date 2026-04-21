import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import Footer from "../components/Footer";
import { MobileHeader } from "../components/MobileHeader";
import { MobileNav } from "../components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logic Arena",
  description: "AliScript robot combat arena",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {/* Fixed top bar — mobile only (desktop has the sidebar header) */}
          <MobileHeader />

          {/* Page content — dashboard layout manages its own padding internally */}
          <main className="flex-1">{children}</main>

          {/* Global footer — appears on every route including dashboard pages */}
          <Footer />

          {/* Fixed bottom nav dock — mobile only */}
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
