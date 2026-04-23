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