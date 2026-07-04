# @dnl-arcade/lobby

The RetroArcade **Lobby** — the Multi-Zone shell/gateway app. This is the only app a player
visits directly; it owns the main layout and (eventually) high scores, and reverse-proxies
game traffic to `apps/engine`.

See the root [`CLAUDE.md`](../../CLAUDE.md) for the full architecture brief.

## Routing

- Dev port: `5000` (`next dev --port 5000`)
- `next.config.ts` rewrites `/play`, `/play/:path*`, `/ladders`, and `/ladders/:path*` to
  `ENGINE_ORIGIN` (defaults to `http://localhost:5001`, the engine app's dev port — override
  via the `ENGINE_ORIGIN` env var in other environments). The browser only ever talks to this
  app's origin; the proxying happens server-side.
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
├── app/                        # routing only — thin page.tsx
├── widgets/
│   └── gateway-hero/            # the home screen (title + Enter Arcade)
├── features/, entities/, shared/  # empty for now — populated once High Scores is built
```

Full layering rules (what may import what) are documented in CLAUDE.md §4.

## Current state

Only the gateway screen exists today. High Scores (persistence, score submission, a
leaderboard widget) is this app's next responsibility per CLAUDE.md, and is intentionally not
yet designed — `widgets/` is structured so a future `widgets/high-scores-board` can sit
alongside `gateway-hero` without reshaping `app/page.tsx` again.

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
