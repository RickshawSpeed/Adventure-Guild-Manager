export * from "./random.ts";
export * from "./facilities.ts";
export * from "./guild.ts";

/**
 * Version of the game rules. Stamped on every saved Zone event and snapshot
 * (ADR 0010). Bump whenever a rule change alters outcomes.
 */
export const RULES_VERSION = 1;
