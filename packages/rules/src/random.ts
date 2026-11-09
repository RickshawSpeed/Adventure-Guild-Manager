/**
 * The only source of randomness the rules may use (ADR 0009). Production
 * passes an unseeded source; tests pass a scripted one.
 */
export interface RandomSource {
  /** A number in [0, 1). */
  next(): number;
}

/**
 * Returns the given values in order, then repeats from the start.
 * Lets tests dictate every roll.
 */
export function scriptedRandom(values: readonly number[]): RandomSource {
  if (values.length === 0) throw new Error("scriptedRandom needs at least one value");
  for (const v of values) {
    if (!(v >= 0 && v < 1)) throw new Error(`scripted value out of range [0, 1): ${v}`);
  }
  let i = 0;
  return {
    next() {
      const v = values[i % values.length]!;
      i++;
      return v;
    },
  };
}

/** Integer in [min, max], inclusive. */
export function rollInt(random: RandomSource, min: number, max: number): number {
  return min + Math.floor(random.next() * (max - min + 1));
}
