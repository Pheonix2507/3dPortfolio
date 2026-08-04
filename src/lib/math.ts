/**
 * Small numeric helpers shared by the scenes.
 *
 * These live here rather than inside the components that use them so they can be
 * tested directly. The scene code is otherwise only reachable through a WebGL
 * context, which makes the arithmetic effectively unverifiable.
 */

/** Clamps to the 0..1 range. */
export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Linear interpolation. No easing: the design deliberately avoids curves. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/**
 * Stride for sampling `wanted` items out of `count`.
 *
 * Guarded to at least 1. Without that guard, a source smaller than the target
 * yields Math.floor(count / wanted) === 0, and any `for (i += step)` loop using
 * it never terminates. That is a real bug this codebase shipped in the
 * letter-morph point sampler, hence the explicit floor and the tests around it.
 */
export function sampleStep(count: number, wanted: number): number {
  if (!Number.isFinite(count) || !Number.isFinite(wanted) || wanted <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(count / wanted));
}

/**
 * Progress of a staggered item through its own window, as 0..1.
 *
 * Used by the spine to work out how far a given block is through detaching, from
 * the section's overall scroll progress.
 */
export function stagger(
  progress: number,
  threshold: number,
  window: number,
): number {
  if (window <= 0) return progress >= threshold ? 1 : 0;
  if (progress <= threshold) return 0;

  /*
   * Both ends are checked explicitly rather than clamping the ratio, because
   * float subtraction does not land on 1 at the end of the window:
   * (0.6 - 0.5) / 0.1 is 0.9999999999999998, not 1. Comparing against
   * threshold + window instead keeps the boundary exact.
   */
  if (progress >= threshold + window) return 1;

  return (progress - threshold) / window;
}
