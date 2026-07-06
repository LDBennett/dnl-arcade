# @dnl-arcade/lobby

The RetroArcade **Lobby** — the Multi-Zone shell/gateway app. This is the only app a player
visits directly; it owns the main layout and high scores display, and reverse-proxies game
traffic to `apps/engine` and score data to `apps/leaderboard`.

See the root [`CLAUDE.md`](../../CLAUDE.md) for the full architecture brief.

## Routing

- Dev port: `5000` (`next dev --port 5000`)
- `next.config.ts` rewrites `/play` and `/play/:path*` to `ENGINE_ORIGIN` (defaults to
  `http://localhost:5001`), and `/scores` and `/scores/:path*` to `LEADERBOARD_ORIGIN`
  (defaults to `http://localhost:5002`) — override either via env var in other environments.
  The browser only ever talks to this app's origin; the proxying happens server-side.
- Any link from this app into the engine zone (e.g. "Enter Arcade" → `/play`) must be a plain
  `<a>` tag, not `next/link`. A `next/link` soft navigation across a zone boundary loads the
  target content but keeps running it under *this* app's JS runtime, which has no `basePath`
  — that silently breaks every link rendered inside the borrowed content. See
  `src/widgets/gateway-hero/ui/GatewayHero.tsx` for the concrete example.

## Structure

Source is organized as Feature-Sliced Design (FSD) layers under `src/`, with `src/app/`
reserved for Next.js routing only:

```
src/
├── app/                          # routing only — thin page.tsx composing the widgets below
├── widgets/
│   ├── gateway-hero/              # title + Enter Arcade
│   ├── leaderboard-panel/         # top-5 scores (server component, fetches apps/leaderboard)
│   ├── continue-playing-rail/     # recently-scored games for the current player
│   └── profile-menu/              # click-to-edit player name, corner-fixed
├── features/
│   └── continue-playing/          # composes entities/player + entities/score
├── entities/
│   ├── player/                    # client-stored display name (no auth)
│   └── score/                     # read-side hooks + ScoreTable over @dnl-arcade/score-client
└── shared/
    └── config/leaderboardOrigin.ts # LEADERBOARD_ORIGIN, for server-to-server fetches
```

Full layering rules (what may import what) are documented in CLAUDE.md §4.

## Current state

High Scores is built: scores persist in Postgres via `apps/leaderboard`, `packages/score-client`
is the shared fetch/submit contract with `apps/engine`, and the home page composes
`gateway-hero` alongside `leaderboard-panel`, `continue-playing-rail`, and `profile-menu`.
"Continue Playing" is derived from actual score submissions — a game appears once the player
has won it at least once, not merely visited it.

## Running

From the repo root (starts both `lobby` and `engine` together via Turborepo):

```bash
pnpm dev
```

To run just this app (note: `/play` will 404 unless `apps/engine`'s dev server is also
running on port 5001):

```bash
pnpm --filter @dnl-arcade/lobby dev
```

Other scripts: `pnpm --filter @dnl-arcade/lobby build`, `... start`, `... lint`.
