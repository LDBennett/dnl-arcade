# RetroArcade (dnl-arcade)

A retro-themed arcade built as a set of independent Next.js **Multi-Zone** apps composed
through routing, managed as a **Turborepo** monorepo. Full architecture brief lives in
[`CLAUDE.md`](./CLAUDE.md) — this file is the practical "how do I run/build this" reference.

## Workspace

```
apps/
├── lobby/        # The Shell — gateway, main layout, high scores    [dev port 5000]
├── engine/       # The Sandbox — hosts isolated game modules        [dev port 5001]
└── leaderboard/  # High scores — Postgres/Prisma + API routes       [dev port 5002]
packages/
├── ui/            # Shared design system (CRT scanlines, arcade tokens, Tailwind preset)
└── score-client/  # Thin fetch wrapper for the leaderboard API, shared by engine + lobby
```

- `apps/lobby` is the only app a player visits directly. It reverse-proxies `/play` (to
  `apps/engine`) and `/scores` (to `apps/leaderboard`) via Next.js `rewrites()`, so the browser
  only ever talks to port 5000.
- `apps/engine` is namespaced under `basePath: "/play"`, `apps/leaderboard` under
  `basePath: "/scores"`, so neither's routes collide with the lobby's own. See
  [`apps/engine/README.md`](./apps/engine/README.md) for the games roster and its
  Feature-Sliced Design layer structure, and
  [`apps/leaderboard/README.md`](./apps/leaderboard/README.md) for the scores API/database.
- `packages/ui` is a design-system-only package (tokens, Tailwind preset, CSS) — no domain
  data or game logic lives there. `packages/score-client` owns the score-fetching/submission
  contract and player-identity localStorage helpers shared between `apps/engine` and
  `apps/lobby`.

Each app also has its own README: [`apps/lobby/README.md`](./apps/lobby/README.md),
[`apps/engine/README.md`](./apps/engine/README.md),
[`apps/leaderboard/README.md`](./apps/leaderboard/README.md).

## Prerequisites

- Node.js
- `pnpm` (this repo pins `packageManager: pnpm@11.1.3`)

## Getting started

```bash
pnpm install
pnpm dev     # starts lobby (:5000), engine (:5001), and leaderboard (:5002) via Turborepo
```

The leaderboard app needs a Postgres `DATABASE_URL`/`DIRECT_URL` — see
[`apps/leaderboard/README.md`](./apps/leaderboard/README.md) before running `pnpm dev` for the
first time.

Visit `http://localhost:5000` and click "Enter Arcade" to reach the engine's game dashboard
through the lobby's proxy.

## Other scripts

```bash
pnpm build   # turbo run build — builds all apps/packages, respecting the dependency graph
pnpm lint    # turbo run lint — lints all apps
```

Turborepo scopes and caches each of these per-package automatically based on the workspace's
dependency graph (`package.json` dependencies) — no manual `--filter` needed for a full-repo
run. To target a single app, use `pnpm --filter @dnl-arcade/engine <script>` (or `lobby`).

## Architecture conventions

Both apps organize `src/` as Feature-Sliced Design (FSD) layers (`app → widgets → features →
entities → shared`) with domain logic modeled DDD-style as plain TypeScript under
`entities/*/model`. See `CLAUDE.md` §4 for the full rules, and `apps/engine/src/entities/hack-terminal`
for the reference implementation (Matrix Breach's game logic).
