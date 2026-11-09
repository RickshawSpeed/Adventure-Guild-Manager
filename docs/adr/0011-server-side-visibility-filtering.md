# Players only receive what their Guild can perceive, filtered on the server

The live view shows a Player only what their own Adventurers can currently perceive plus what their Guild has already discovered in that Dungeon. The filtering happens on the server for each subscriber before anything is sent, because any data delivered to a client can be read by a determined Player regardless of what the UI hides.

## Consequences

- Admin tooling lives in the same web client behind an admin role and uses the same live-view stream with filtering bypassed, plus controls such as pause/resume.
