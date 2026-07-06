# @dnl-arcade/leaderboard

The RetroArcade **Leaderboard** — an isolated Next.js zone that owns high-score persistence
(Postgres via Prisma) and exposes it over a small JSON API. It's a Multi-Zone sibling of
`apps/lobby` and `apps/engine`: in normal use it's only ever reached through the lobby's
`/scores` proxy rewrite.

See the root [`CLAUDE.md`](../../CLAUDE.md) for the full architecture brief.

## Routing

- Dev port: `5002` (`next dev --port 5002`)
- `basePath: "/scores"` — every route in this app is namespaced under `/scores/*` so it can't
  collide with the lobby's own routes when proxied.
- Links that cross back into the lobby zone must use a plain `<a>` tag, not `next/link` — same
  cross-zone rule as `apps/engine`.

## Structure

```
src/
├── app/                        # routing + API route handlers only
├── widgets/                    # leaderboard-board (the /scores page content)
├── entities/                   # score (repository, validation, domain types)
└── shared/                     # lib/prisma.ts (client singleton)
```

## Database

Postgres via Prisma. Needs two connection strings in `apps/leaderboard/.env` (see
`.env.example`):

- `DATABASE_URL` — pooled connection (PgBouncer, port `6543`), used at runtime.
- `DIRECT_URL` — direct connection (port `5432`), used only by `prisma migrate`.

```bash
pnpm --filter @dnl-arcade/leaderboard exec prisma migrate dev
```

## Running

From the repo root (starts `lobby`, `engine`, and `leaderboard` together via Turborepo):

```bash
pnpm dev
```

To run just this app:

```bash
pnpm --filter @dnl-arcade/leaderboard dev
```

Other scripts: `pnpm --filter @dnl-arcade/leaderboard build`, `... start`, `... lint`.
