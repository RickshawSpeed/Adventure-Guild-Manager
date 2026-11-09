# Deploys pause the Dungeon; Dungeon time is measured in ticks

Dungeons run continuously with no gap between them, so there is never a quiet window for maintenance. A deploy freezes all tick loops, snapshots every Zone, restarts on the new code, reloads and resumes; Players see a brief pause and lose nothing. Dungeon time is the tick count rather than wall-clock time, so pauses and crashes never cause time to "jump". Live hand-off between processes was rejected as unjustified complexity at this scale.

## Consequences

- There is one live version of the game rules. A rule change applies immediately to all open Dungeons, including Sealed ones; every snapshot and event is stamped with the rules version that produced it, for auditing.
