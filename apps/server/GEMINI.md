# Server Rules

## Stack
NestJS 11, Socket.IO, Prisma 5, Redis (Upstash), JWT Auth, Passport (Google + GitHub OAuth)

## Environment
- Dev env file: `apps/server/.env.local` (loaded via dotenv-cli)
- Prod env file: `apps/server/.env`
- NODE_ENV=development → reads .env.local via start:dev script

## Auth
- JWT stored in localStorage as `token` and `jwtToken`
- OAuth callback URLs:
  - Dev: `http://localhost:3001/api/auth/[provider]/callback`
  - Prod: `https://logicarena.dev/api/auth/[provider]/callback`
- Global prefix: `/api`

## Key Modules
- `src/modules/auth/` — JWT + OAuth (Google, GitHub)
- `src/modules/matches/` — Match engine + gateway
- `src/modules/matches/gateway/` — match.state, match.loop, match.lobby, match.social
- `src/modules/campaign/` — Campaign levels
- `src/modules/users/` — User profiles + leaderboard
- `src/modules/scripts/` — AliScript storage

## Rules
- Never expose JWT_SECRET or DB credentials
- Prisma schema: `apps/server/prisma/schema.prisma`
- Redis used for online presence + rate limiting
- Socket.IO URL must be origin only — no /api suffix