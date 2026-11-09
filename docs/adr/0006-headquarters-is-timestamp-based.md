# Headquarters state is computed from timestamps, not ticked

Facility activity (training, crafting, healing, meals) stores start and end times, and current state is derived when read. Only the Dungeon ticks, because only the Dungeon has Guilds affecting each other in real time; ticking every Guild's Headquarters would burn work on thousands of idle Guilds. A scheduler fires the few things that must happen on time (e.g. notifications).

## Consequences

- Headquarters runs on wall-clock time while the Dungeon runs on ticks (ADR 0010); the two clocks are allowed to drift (e.g. during a deploy pause) and no game rule may depend on them agreeing exactly.
- Adventurers choose their own activities at home (weighing Needs, Traits and the Player's Requests). The decision is made only when an activity ends or something relevant changes, then the next activity's start and end times are stored; there is still no per-tick Headquarters loop.
- The Headquarters is a completely safe place: other Guilds can never raid, sabotage or otherwise affect it. All conflict between Guilds happens in Dungeons, which is what keeps the Headquarters free of real-time interaction between Guilds.
