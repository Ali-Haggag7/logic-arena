# Client Rules

## Stack
Next.js 16 App Router, Tailwind CSS v4, React Three Fiber, Socket.IO client

## Theme System (3 themes — NEVER hardcode colors)
CSS variable classes ONLY:
- Backgrounds: `bg-bg-primary` / `bg-bg-secondary` / `bg-card`
- Text: `text-text-primary` / `text-text-secondary` / `text-accent`
- Borders: `border-accent/50` / `border-accent`
- Opacity variants: `rgba(var(--accent-rgb), 0.X)`
- Semantic tokens: `var(--sem-success)` / `var(--sem-danger)` / `var(--sem-warning)` / `var(--sem-info)`
- Neon glows: `[data-theme='cyberpunk']` block in globals.css only — never inline
- Themes: cyberpunk (default dark), violet-sovereign (light), obsidian-ember (dark warm)

## Mobile Pattern
- Hook location: `src/hooks/useMediaQuery.ts`
- Pages: calculate `isMobile` ONCE at top, pass as prop to children
- Standalone components (Footer, MobileNav): calculate `isMobile` internally
- CSS transitions only on mobile, max 200ms ease, NO Framer Motion
- Touch targets minimum 44x44px

## Layout Structure
- Dashboard layout: `src/app/(dashboard)/layout.tsx` — has sidebar, MobileNav, MobileHeader
- Root layout: `src/app/layout.tsx` — global Footer, global MobileNav, global MobileHeader
- Route groups: `(auth)`, `(dashboard)`, `(public)` — never add Footer inside dashboard/arena
- Static pages: Server Components unless they have forms (`'use client'`)
- Footer suppressed on: `/arena` and all `(dashboard)` routes via `FOOTER_SUPPRESSED_PATHS`

## Key Components
- `src/components/Footer.tsx` — global footer
- `src/components/MobileNav.tsx` — bottom navigation (5th item = floating SYSTEM hub)
- `src/components/MobileHeader.tsx` — top bar with ThemeSwitcher
- `src/hooks/useMediaQuery.ts` — SSR-safe, defaults to `false` on server
- `src/lib/api-client.ts` — axios instance, exports `apiClient` and `API_BASE_URL`

## Three.js / R3F Rules
- Always `SkeletonUtils.clone()` for GLB models — never share scene between instances
- Never create textures/geometries inside render cycle — use `useMemo`
- Always dispose geometry and materials on unmount via `useEffect` cleanup
- `frameloop="demand"` on all non-game Canvas instances (Garage, etc.)
- Robot body orientation → `rotation` only. FOV cone orientation → `fovDirection` only. Never mix.
- Speech bubbles must be children of robot's local 3D group (not SceneOverlay)
- Obstacle animations → GPU shader via `onBeforeCompile`, never per-frame `useFrame`
- Static obstacles → `InstancedMesh` grouped by type (one draw call per obstacle type)

## WebSocket Rules
- Never hardcode socket URLs — always use `API_BASE_URL` utility
- Always strip `/api` suffix when constructing WebSocket URL
- Always cleanup `.off()` listeners on unmount
- Never recreate socket inside `useMemo` — use `useRef`
- Gate socket init behind token existence check

## Performance Rules
- No Framer Motion on mobile
- `will-change: transform` only on actively animating elements
- Lazy load non-critical components with `dynamic()`
- Inline SVGs or lucide-react for icons only — no emoji icons (cross-platform inconsistency)
- Obstacles array: populate `obstaclesRef` once from initial payload, strip from all delta updates
- Wrap `Scene3D` in `React.memo` — never let HUD updates re-render the 3D canvas

## Strict Code Quality Rules

### TypeScript
- NEVER use `any` type — always use proper interfaces or types
- If a type doesn't exist yet, create it in the nearest types.ts file
- Use `unknown` instead of `any` when type is genuinely uncertain
- All function parameters and return types must be explicitly typed

### Accessibility
- Every `<button>` must have `type="button"` or `type="submit"` explicitly
- Every `<button>` without visible text must have `aria-label` or `title`
- Every `<input>` must have a corresponding `label` or `aria-label`
- Every `<img>` must have `alt` attribute
- Never use `onClick` on non-interactive elements (div, span) — use button instead

### General
- No inline magic numbers — extract to named constants
- No hardcoded colors — CSS variables only (`var(--accent)` etc.)
- No commented-out code blocks left in files
- Three.js light colors → hardcoded hex only (`#22d3ee`) — never CSS variables