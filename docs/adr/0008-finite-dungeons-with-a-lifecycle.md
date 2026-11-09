# Dungeons are finite, procedurally generated, and replaced when completed

Each Dungeon is generated from a seed, its contents never respawn, and it ends when a Party completes the event deep inside it, at which point a new Dungeon opens. This makes the shared world genuinely competitive (being first matters, and depletion is real) and gives the game a natural season-like rhythm. If population grows, several Dungeons may be open at once rather than relying on a single ever-growing world.

## Consequences

- Completing the Core seals the Dungeon rather than destroying it: no new Expeditions enter, but Parties already inside continue until they leave, and the Dungeon is retired once empty. Its in-memory Zones therefore outlive the moment of completion.
- The next Dungeon opens immediately, with no gap, so Dungeons are generated ahead of time and held ready to open.
- Dungeon is no longer a singleton: Zones belong to a specific Dungeon, and Expeditions target a specific Dungeon.
- A background job in the server keeps a buffer of two ready Dungeons (seed plus generated layout); when a Core is completed the next one opens at once and a replacement is generated.
- When a Sealed Dungeon is empty and retired, Expedition Logs and a Dungeon summary are kept permanently; raw Zone events are deleted 30 days after retirement.
