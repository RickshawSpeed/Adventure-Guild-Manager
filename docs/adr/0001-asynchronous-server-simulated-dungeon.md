# Dungeon is simulated asynchronously by the server, with an optional live view

Players do not control Adventurers moment to moment. The server advances the Dungeon in discrete ticks whether or not anyone is watching; Players issue orders and policies, leave, and return to results. A live view lets Players watch Zone activity, but it is read-only spectating, not control. We chose this over a real-time action model because a management game doesn't need twitch control, and a real-time authoritative server (latency, reconnects, position sync) would be far more expensive to build and run for a solo developer.

## Consequences

- The server is the sole authority on all game state; clients never compute outcomes.
- Expeditions continue while the Player is offline, so all progress must be durable server-side.
