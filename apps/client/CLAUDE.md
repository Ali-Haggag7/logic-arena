# Client Rules

## Stack
Next.js 16 App Router, Tailwind CSS v4, React Three Fiber, Socket.IO client

## Theme System (3 themes — NEVER hardcode colors)
CSS variable classes ONLY:
- Backgrounds: `bg-bg-primary` / `bg-bg-secondary` / `bg-card`
- Text: `text-text-primary` / `text-text-secondary` / `text-accent`
- Borders: `border-accent/50` / `border-accent`
- Opacity variants: `rgba(var(--accent-rgb), 0.X)`
- Themes: cyberpunk (default dark), light, desert

## Mobile Pattern
- Hook location: `src/hooks/useMediaQuery.ts`
- Pages: calculate `isMobile` ONCE at top, pass as prop to children
- Standalone components (Footer, MobileNav): calculate `isMobile` internally
- CSS transitions only on mobile, max 200ms ease, NO Framer Motion
- Touch targets minimum 44x44px

## Layout Structure
- Dashboard layout: `src/app/(dashboard)/layout.tsx` — has sidebar, MobileNav, MobileHeader
- Root layout: `src/app/layout.tsx` — global Footer, global MobileNav, global MobileHeader
- Static pages: Server Components unless they have forms (`'use client'`)

## Key Components
- `src/components/Footer.tsx` — global footer
- `src/components/MobileNav.tsx` — bottom navigation
- `src/components/MobileHeader.tsx` — top bar with ThemeSwitcher
- `src/hooks/useMediaQuery.ts` — SSR-safe media query hook
- `src/lib/api-client.ts` — axios instance, exports `apiClient` and `API_BASE_URL`

## Performance Rules
- No Framer Motion on mobile
- `will-change: transform` only on actively animating elements
- Lazy load non-critical components with `dynamic()`
- Inline SVGs or lucide-react for icons only