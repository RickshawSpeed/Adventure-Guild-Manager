# Adventurers exist independently of Guilds and can change Guild

An Adventurer is a game-wide entity whose Guild membership is a changeable relationship, not a property of a Guild's own data. Adventurers move between the shared Recruit Pool and Guilds through Applications, Offers, Trades and Quitting, so ownership changes are frequent and must be atomic: an Adventurer belongs to at most one Guild at a time. Scoping Adventurers inside each Guild would have been simpler but makes every transfer a copy-and-delete.

## Consequences

- An Adventurer on an Expedition cannot be traded or quit until they Return (ADR 0007).
- Concurrent acceptances of the same Applicant must resolve to exactly one winner.
- Adventurers are economic agents: each has a Purse, and every Item is owned either by a Guild or by an Adventurer. Ownership is independent of who is carrying the Item, so Issued Items return to the Guild when an Adventurer leaves, while Personal Items leave with them. On death, everything carried becomes Remains regardless of owner.
