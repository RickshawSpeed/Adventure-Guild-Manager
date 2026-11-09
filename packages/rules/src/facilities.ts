/** The Facilities every Headquarters is made of. */
export const FACILITY_KINDS = [
  "housing",
  "crafting",
  "training",
  "recreation",
  "medical",
  "nutrition",
  "education",
  "storehouse",
] as const;

export type FacilityKind = (typeof FACILITY_KINDS)[number];

export const STARTING_FACILITY_LEVEL = 1;

/** Maximum Roster size for a given Housing Facility Level. */
export function housingCapacity(level: number): number {
  return 2 + level * 4;
}

/** Number of Items the Storehouse holds at a given Facility Level. */
export function storehouseCapacity(level: number): number {
  return level * 50;
}
