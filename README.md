# Adventure Guild Manager

A multiplayer guild-management game. Design lives in [`GLOSSARY.md`](GLOSSARY.md) and [`docs/adr/`](docs/adr/).

## Layout

| Part | What it is |
|---|---|
| `packages/rules` | Game rules only: no I/O, no clock, no `Math.random` (randomness is passed in) |
| `packages/protocol` | API and WebSocket message shapes, shared by client and server |
| `apps/server` | Node server: HTTP API, WebSocket, Postgres, Better Auth |
| `apps/client` | React + Vite web client, built as a PWA |

## Running locally

Needs Node 24. pnpm is run through corepack, so nothing else needs installing. Postgres runs embedded, so Docker isn't needed.

```bash
corepack pnpm install
```

In three terminals:

```bash
corepack pnpm dev:db
```

```bash
corepack pnpm dev:server
```

```bash
corepack pnpm dev:client
```

Then open http://localhost:5173.

## Checks

```bash
corepack pnpm test
```

```bash
corepack pnpm typecheck
```

Server tests start their own embedded Postgres and drive the real server through HTTP and WebSocket (Seam 1). Only the random source, the tick driver and the wall clock are replaced in tests.
