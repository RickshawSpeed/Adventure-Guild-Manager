/**
 * Wall-clock time, used only by the Headquarters side (ADR 0006).
 * Dungeon time is measured in ticks, never with this clock (ADR 0010).
 */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
