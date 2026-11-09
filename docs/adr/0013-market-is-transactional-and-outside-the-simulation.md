# The Market ships at launch as a transactional module outside the Dungeon simulation

Guilds and Adventurers buy and sell Items for Gold on a shared Market from launch, through fixed-price listings with a sale tax that removes Gold from the economy. The Market lives with the Headquarters side of the system, not in Zone tick loops: every purchase is a single Postgres transaction that moves Gold and Item ownership atomically, so an Item can never be sold twice and Gold can never be duplicated. Items or Gold carried on an Expedition are owned by the Zone until Return (ADR 0007) and cannot be listed or used to buy on the Market until then.

## Consequences

- Trades, bribes and purchases that happen inside a Dungeon (between Adventurers, or with NPCs) are a separate mechanism resolved inside the tick, not Market transactions.
- A player-driven economy is the most common source of exploits; Market code needs the strongest test coverage and audit logging in the system.
- Adventurers use the Market autonomously, but only while at home, driven by simple decision rules evaluated on the Headquarters schedule rather than the Dungeon tick.
- Restocking makes Guilds automatic Market buyers: the Headquarters scheduler places purchases on the Player's behalf, so a Facility never stops because the Player was offline.
