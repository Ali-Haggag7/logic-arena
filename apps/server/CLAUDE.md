# Server Rules

## Stack
NestJS 11, Socket.IO, Prisma 5, Redis (Upstash), JWT Auth, Passport (Google + GitHub OAuth)

## Environment
- Dev env file: `apps/server/.env.local` (loaded via dotenv-cli)
- Prod env file: `apps/server/.env`
- NODE_ENV=development → reads .env.local automatically via start:dev script

## Auth
- JWT stored in localStorage as `token` and `jwtToken`
- OAuth callback URLs:
  - Dev: `http://localhost:3001/api/auth/[provider]/callback`
  - Prod: `https://logicarena.dev/api/auth/[provider]/callback`
- Global prefix: `/api`

## Key Modules
- `src/auth/` — JWT + OAuth (Google, GitHub)
- `src/matches/` — Match engine integration
- `src/campaign/` — Campaign levels
- `src/users/` — User profiles + leaderboard
- `src/scripts/` — AliScript storage

## Rules
- Never expose JWT_SECRET or DB credentials
- Always use `@SkipThrottle({ auth: true })` on non-auth controllers
- Prisma schema: `apps/server/prisma/schema.prisma`
- Redis used for online presence + rate limiting