# Zones are tile grids and combat is tactical

Inside a Zone, positions are tracked on a fine-grained tile grid, and combat is tactical with positioning, range and movement, using complex tabletop-RPG-style rules. We rejected abstract room graphs and abstract combat rounds because how Adventurers choose to position themselves is a core part of their agency, and it is what makes movement Skills and ranged weapons meaningful.

## Consequences

- Each tick costs much more than in an abstract model: pathfinding, line of sight and per-Adventurer tactical decisions. This is the main performance risk in the system and the strongest reason Zones may need to move to separate processes (ADR 0004, 0005).
- Visibility filtering (ADR 0011) becomes line-of-sight based per tile, not per room.
- The live view must render a grid, which raises client effort on small phone screens.
- Zones are 2D grids of square Tiles (~5 ft, diagonal movement), joined at their edges by Passages. Rooms are named areas of Tiles used for reference only; movement and combat are per Tile.
- One combat round happens per 2-second tick, with each combatant taking an initiative-ordered turn (move, action, possible reaction). Outside combat, movement is a number of Tiles per tick based on speed.
- Each Zone is sized for roughly 20 Parties and 200 active Monsters at peak. Monsters far from any Party sleep and are skipped by the tick, and line of sight is recomputed only for things that moved. The Dungeon generator uses this budget to decide how many Zones to create.

## Considered Options

- **Using the SRD 5.1 rules directly** (CC-BY-4.0, commercially usable with attribution). Rejected because it is built on six ability scores and classes, which would require replacing our Skill-based, classless Adventurer model. We write our own d20-style rules inspired by tabletop RPGs instead, with no licence dependency. The "Dungeons & Dragons" name and setting are trademarks and are never used.
