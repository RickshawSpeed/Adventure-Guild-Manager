import { describe, expect, it } from "vitest";
import { isVersionAtLeast } from "./version.ts";

describe("isVersionAtLeast", () => {
  it.each([
    ["1.2.3", "1.2.3", true],
    ["1.2.4", "1.2.3", true],
    ["1.10.0", "1.9.9", true],
    ["2.0.0", "1.99.99", true],
    ["1.2.2", "1.2.3", false],
    ["0.9.0", "1.0.0", false],
  ])("%s >= %s is %s", (v, min, expected) => {
    expect(isVersionAtLeast(v, min)).toBe(expected);
  });

  it("treats missing or malformed versions as too old", () => {
    expect(isVersionAtLeast(undefined, "0.1.0")).toBe(false);
    expect(isVersionAtLeast("banana", "0.1.0")).toBe(false);
  });
});
