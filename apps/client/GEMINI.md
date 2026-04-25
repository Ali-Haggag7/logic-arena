# Client Rules

## Stack
Next.js 15 App Router, Tailwind CSS v4, React Three Fiber, Socket.IO client

## Theme System (3 themes — NEVER hardcode colors)
CSS variable classes ONLY:
- Backgrounds: `bg-bg-primary` / `bg-bg-secondary` / `bg-card`
- Text: `text-text-primary` / `text-text-secondary` / `text-accent`
- Borders: `border-border` / `border-accent`
- Opacity variants: `rgba(var(--accent-rgb), 0.X)`
- Themes: cyberpunk (default dark), light, desert

## Mobile Pattern
- Hook location: `src/hooks/useMediaQuery.ts`
- Pages: calculate `isMobile` ONCE at top, pass as prop to children
- Standalone components: calculate `isMobile` internally
- CSS transitions only on mobile, max 200ms ease, NO Framer Motion
- Touch targets minimum 44x44px

## Layout Structure
- Root layout: `src/app/layout.tsx` — global Footer, MobileNav, MobileHeader
- Dashboard layout: `src/app/(dashboard)/layout.tsx` — sidebar, desktop header, challenge modal, toast
- Static pages: Server Components unless they have forms (`'use client'`)

## Footer Suppressed Routes
/arena, /dashboard, /leaderboard, /lobby, /campaign,
/profile, /garage, /docs, /tournaments, /replay, /settings

## Key Components
- `src/components/Footer.tsx` — global footer with FOOTER_SUPPRESSED_PATHS
- `src/components/MobileNav.tsx` — bottom navigation
- `src/components/MobileHeader.tsx` — top bar with ThemeSwitcher + auth button
- `src/hooks/useMediaQuery.ts` — SSR-safe media query hook
- `src/lib/api-client.ts` — axios instance, exports `apiClient` and `API_BASE_URL`

## Performance Rules
- No Framer Motion on mobile
- CSS transitions only on mobile, max 200ms ease
- Lazy load non-critical components with `dynamic()`
- Inline SVGs or lucide-react for icons only

## Strict Code Quality Rules

### TypeScript
- NEVER use `any` type — always use proper interfaces or types
- If a type doesn't exist yet, create it in the nearest types.ts file
- Use `unknown` instead of `any` when type is genuinely uncertain
- All function parameters and return types must be explicitly typed

### Accessibility
- Every <button> must have type="button" or type="submit" explicitly
- Every <button> without visible text must have aria-label or title
- Every <input> must have a corresponding label or aria-label
- Every <img> must have alt attribute
- Never use onClick on non-interactive elements (div, span) — use button instead

### General
- No inline magic numbers — extract to named constants
- No hardcoded colors — CSS variables only (var(--accent) etc.)
- No commented-out code blocks left in files