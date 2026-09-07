# lean-divida

pnpm monorepo. Vite React SPA + standalone Express backend, linked by tRPC. Types shared by exporting the router type — no codegen.

```
packages/api    Prisma schema + tRPC router + logic; exports AppRouter type
apps/server     Express host; mounts tRPC at /trpc, serves the SPA build in prod
apps/web        Vite React SPA; imports the AppRouter type only
```

## Setup

```bash
cp packages/api/.env.example packages/api/.env   # set DATABASE_URL to your MySQL
pnpm install
pnpm generate                                    # prisma generate
```

The `health.ping` skeleton needs no DB. Real data needs a MySQL:

```bash
pnpm --filter @lean-divida/api migrate           # first migration
```

## Dev

```bash
pnpm dev            # web :5173, server :3000, /trpc proxied to the server
```

Open http://localhost:5173 — Home shows `ok: true` + a timestamp from the backend.

## Checks

```bash
pnpm lint
pnpm typecheck
```

## Stack

TS strict · MySQL (Prisma) · Express · @trpc/server · @trpc/react-query + @tanstack/react-query · react-router-dom · Tailwind v4 · zod · dayjs · superjson. Server runs on `tsx`, no build step.

## Not built yet (hand-coded next)

Auth (JWT/cookie — `protectedProcedure` stub + context `user` slot are ready), schema growth, features, UI.
