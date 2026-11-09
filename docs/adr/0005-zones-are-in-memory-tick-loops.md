# Each Zone is an in-memory object with its own tick loop

A Zone's state lives in server memory and advances every 2 seconds in its own loop; what happens is saved to Postgres as an append-only event stream with periodic snapshots, and a Zone is reloaded from its latest snapshot after a restart. We rejected a load-compute-write cycle against the database every tick because database load would scale with ticks × Zones and the live view would have to poll. Keeping each Zone self-contained, with Parties moving between Zones only via Passage handoffs at tick boundaries, is what lets Zones later move to separate processes.

## Consequences

- Encounters are resolved inside the tick by the Adventurers' own decisions; the simulation never waits on Player input. Request changes take effect from the next tick.
- A crash can lose at most the work since the last save; the save frequency is a tunable trade-off.
- The simulation is deliberately **not** seed-reproducible: Adventurer randomness is not replayable. Everything that happens in a tick must therefore be recorded as events, because outcomes cannot be recomputed; Expedition Logs, debugging and crash recovery all rely on the recorded events and snapshots, never on re-simulation.
