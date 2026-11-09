# Single deployable modular monolith in TypeScript

The game ships as one server process backed by one database, written in TypeScript and sharing game-rule code with the client. Target scale is a hobby/learning project (tens to hundreds of Players) that can grow to an indie launch. Module boundaries are kept clean so the Dungeon simulation can later be extracted into its own service per Zone; until then, microservices would cost far more operational effort than they save.

## Consequences

- Code lives in a pnpm monorepo: `packages/rules` (pure game logic), `packages/protocol` (API and message types), `apps/server` (Node, HTTP + WebSocket, Postgres), `apps/client` (React + Vite PWA).
- Postgres is the only datastore; no Redis or message queue until there is more than one server process, since in-memory Zones already hold the hot state.
- Authentication uses a self-hosted library (Better Auth) storing Accounts in our own Postgres, avoiding vendor lock-in and per-user fees while supporting Apple/Google sign-in for the mobile apps.
- Hosting must support a continuously running process (VPS or Fly.io/Railway-style), because Zone tick loops never stop; serverless platforms are ruled out.
- Clients use HTTP (JSON) for all commands and one-off reads, and one WebSocket per connected client for pushed live Zone views and in-app notifications. All message shapes are defined once in `packages/protocol`.
- A notification module owns delivery ("notify this Guild of X"); Web Push is its first channel, with FCM/APNs added alongside the Capacitor apps.
