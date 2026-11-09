# Adventurers decide by coded rules, and the Adventurer is the unit of simulation

Adventurers have agency: Player Requests are only guidance, and a Party's choices (including when to return and how to handle Encounters) are made by its Party Leader, influenced by the other members' traits, needs and mood. These decisions are made by rules written in code (utility scoring / decision trees) inside the tick, not by an LLM, because an LLM call per Adventurer every 2 seconds is far too slow and costly. Inside a Zone the simulated entity is the individual Adventurer and a Party is a grouping of them, so that Parties splitting mid-Expedition can be added later without a rewrite.

## Consequences

- Rules code never calls `Math.random()` or reads the clock directly; randomness is passed in as an input. Production passes an unseeded source (outcomes are not reproducible, per ADR 0005), while tests pass scripted sources so Adventurer decisions can be tested reliably.
