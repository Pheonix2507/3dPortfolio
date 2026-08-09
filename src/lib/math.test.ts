import { describe, expect, it } from "vitest";
import { clamp01, lerp, stagger } from "./math";

describe("clamp01", () => {
  it("passes through values already in range", () => {
    expect(clamp01(0)).toBe(0);
    expect(clamp01(0.42)).toBe(0.42);
    expect(clamp01(1)).toBe(1);
  });

  it("clamps outside the range", () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(9)).toBe(1);
  });
});

describe("lerp", () => {
  it("returns the endpoints at 0 and 1", () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("interpolates linearly, with no easing applied", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0.25)).toBe(2.5);
  });

  it("handles a descending range", () => {
    expect(lerp(20, 10, 0.5)).toBe(15);
  });
});

describe("stagger", () => {
  it("is 0 before the threshold and 1 after the window", () => {
    expect(stagger(0, 0.5, 0.1)).toBe(0);
    expect(stagger(0.5, 0.5, 0.1)).toBe(0);
    expect(stagger(0.6, 0.5, 0.1)).toBe(1);
    expect(stagger(1, 0.5, 0.1)).toBe(1);
  });

  it("reports partial progress inside the window", () => {
    expect(stagger(0.55, 0.5, 0.1)).toBeCloseTo(0.5);
  });

  it("degrades to a hard switch when the window is zero", () => {
    expect(stagger(0.49, 0.5, 0)).toBe(0);
    expect(stagger(0.5, 0.5, 0)).toBe(1);
  });
});
