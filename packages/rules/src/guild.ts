export const STARTING_GOLD = 500;

export const GUILD_NAME_MIN_LENGTH = 3;
export const GUILD_NAME_MAX_LENGTH = 40;

/** Normalises a proposed Guild name, or returns null if it is not acceptable. */
export function normaliseGuildName(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < GUILD_NAME_MIN_LENGTH || name.length > GUILD_NAME_MAX_LENGTH) return null;
  return name;
}
