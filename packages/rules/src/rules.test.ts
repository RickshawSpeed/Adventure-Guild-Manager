import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  FACILITY_KINDS,
  housingCapacity,
  normaliseGuildName,
  rollInt,
  scriptedRandom,
  storehouseCapacity,
} from "./index.ts";

describe("scriptedRandom", () => {
  it("returns the scripted values in order and then repeats", () => {
    const r = scriptedRandom([0.1, 0.5]);
    expect([r.next(), r.next(), r.next()]).toEqual([0.1, 0.5, 0.1]);
  });

  it("rejects values outside [0, 1)", () => {
    expect(() => scriptedRandom([1])).toThrow();
  });

  it("drives rollInt deterministically at the boundaries", () => {
    expect(rollInt(scriptedRandom([0]), 1, 20)).toBe(1);
    expect(rollInt(scriptedRandom([0.9999]), 1, 20)).toBe(20);
  });
});

describe("Headquarters", () => {
  it("has the eight Facilities", () => {
    expect(FACILITY_KINDS).toHaveLength(8);
  });

  it("grows Capacity with Facility Level", () => {
    expect(housingCapacity(2)).toBeGreaterThan(housingCapacity(1));
    expect(storehouseCapacity(2)).toBeGreaterThan(storehouseCapacity(1));
  });
});

describe("Guild names", () => {
  it("trims and collapses whitespace", () => {
    expect(normaliseGuildName("  The   Iron  Lanterns ")).toBe("The Iron Lanterns");
  });

  it("rejects names that are too short or too long", () => {
    expect(normaliseGuildName("ab")).toBeNull();
    expect(normaliseGuildName("x".repeat(41))).toBeNull();
  });
});

describe("rules purity (ADR 0009)", () => {
  const srcDir = import.meta.dirname;
  const sources = readdirSync(srcDir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => ({ file: f, text: readFileSync(join(srcDir, f), "utf8") }));

  it.each(sources)("$file uses no Math.random, clock or I/O", ({ text }) => {
    expect(text).not.toMatch(/Math\.random/);
    expect(text).not.toMatch(/\bDate\b|performance\.now/);
    expect(text).not.toMatch(/from\s+["'](node:|fs|net|http|pg)/);
  });
});
