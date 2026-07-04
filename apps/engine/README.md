# @dnl-arcade/engine

The RetroArcade **Engine** — an isolated Next.js "sandbox" zone that hosts the arcade's game
modules. It's a Multi-Zone sibling of `apps/lobby` (the shell/gateway app), not a standalone
site: in normal use it's only ever reached through the lobby's `/play` proxy rewrite, never
visited directly by a player.

See the root [`CLAUDE.md`](../../CLAUDE.md) for the full architecture brief.

## Routing

- Dev port: `5001` (`next dev --port 5001`)
- `basePath: "/play"` — every route in this app is namespaced under `/play/*` so it can't
  collide with the lobby's own routes when proxied. Next.js auto-prepends this basePath to
  every `next/link` href rendered by this app, so internal links should be written *without*
  the `/play` prefix (e.g. `href="/matrix-breach"`, not `href="/play/matrix-breach"`).
- Links that cross back into the lobby zone must use a plain `<a>` tag, not `next/link` — a
  `next/link` soft navigation across a zone boundary runs the target content under the
  *wrong* app's JS runtime and silently breaks basePath handling for anything rendered inside it.

## Structure

Source is organized as Feature-Sliced Design (FSD) layers under `src/`, with `src/app/`
reserved for Next.js routing only (thin pages that render one widget each):

```
src/
├── app/                        # routing only — one thin page per route
├── widgets/                    # page-level compositions (engine-dashboard, matrix-breach-terminal)
├── features/                   # a single user interaction (crack-terminal)
├── entities/                   # domain nouns as plain TypeScript (game, hack-terminal)
└── shared/                     # cross-slice primitives — empty until a second consumer needs one
```

Full layering rules (what may import what) are documented in CLAUDE.md §4.

## Games roster

| Game | Status |
| --- | --- |
| Matrix Breach | Playable — see `entities/hack-terminal`, `features/crack-terminal`, `widgets/matrix-breach-terminal` |
| Neon Snake | Stub (`app/neon-snake/page.tsx`) |
| SoundWave | Stub (`app/soundwave/page.tsx`) |
| ComboBreaker | Stub (`app/combo-breaker/page.tsx`) |

## Running

From the repo root (starts both `lobby` and `engine` together via Turborepo):

```bash
pnpm dev
```

To run just this app:

```bash
pnpm --filter @dnl-arcade/engine dev
```

Then visit the lobby at `http://localhost:5000` and click through — this app isn't meant to
be browsed directly at `:5001` outside of debugging the zone in isolation.

Other scripts: `pnpm --filter @dnl-arcade/engine build`, `... start`, `... lint`.
