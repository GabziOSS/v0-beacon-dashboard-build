/**
 * Mulberry32 seeded PRNG — all randomness flows through this.
 * No bare Math.random() calls anywhere outside this file.
 */

export function createRng(seed: number) {
  let s = seed
  return function (): number {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Global RNG seeded with project start date — keeps data stable across runs */
export const rng = createRng(20250307)

/** Random integer in [min, max] inclusive */
export function randInt(min: number, max: number, r = rng): number {
  return Math.floor(r() * (max - min + 1)) + min
}

/** Random float in [min, max) */
export function randFloat(min: number, max: number, r = rng): number {
  return r() * (max - min) + min
}

/** Pick a random item from an array */
export function randItem<T>(arr: readonly T[], r = rng): T {
  return arr[Math.floor(r() * arr.length)]
}

/** Pick a random item using weighted probabilities */
export function randWeighted<T>(items: readonly T[], weights: readonly number[], r = rng): T {
  const total = weights.reduce((sum, w) => sum + w, 0)
  let roll = r() * total
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return items[i]
  }
  return items[items.length - 1]
}

/** Approximate normal distribution via Box-Muller transform */
export function randNormal(mean: number, sd: number, r = rng): number {
  const u1 = r()
  const u2 = r()
  const z = Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2)
  return mean + z * sd
}

/** Shuffle an array in place using Fisher-Yates */
export function shuffle<T>(arr: T[], r = rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
