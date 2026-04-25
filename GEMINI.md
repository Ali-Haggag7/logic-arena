# Logic Arena — Gemini Agent Rules

## Project
Competitive real-time robot battle simulator. TypeScript monorepo (pnpm workspaces).

## Terminal
PowerShell only. Use `;` not `&&`. Never use Linux/Mac commands.

## Commands
- Dev: `pnpm run dev:all`
- Build client: `pnpm --filter client run build`
- Build server: `pnpm --filter server run build`
- Install (root): `pnpm add -w <pkg>`
- Install (package): `pnpm --filter <name> add <pkg>`

## Monorepo Structure
apps/client/          # Next.js 15 App Router
apps/server/          # NestJS + Socket.IO
packages/engine/      # Battle engine
packages/logic-parser/ # AliScript parser

## Core Rules
- Never use `npm` or `yarn`, always `pnpm`
- Never hardcode colors — CSS variables only (see client GEMINI.md)
- Never add `useMediaQuery` inside child components — pass `isMobile` as prop from parent page
- Always refactor for clean code, performance, caching, optimization
- Touch only files listed in the task scope
- TypeScript strict — no `any`

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