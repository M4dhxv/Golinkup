// Deterministic seeded RNG (mulberry32) so mock data is stable across renders/reloads.
export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private rand: () => number;

  constructor(seed: number) {
    this.rand = mulberry32(seed);
  }

  float(min = 0, max = 1) {
    return min + this.rand() * (max - min);
  }

  int(min: number, max: number) {
    return Math.floor(this.float(min, max + 1));
  }

  bool(pTrue = 0.5) {
    return this.rand() < pTrue;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  pickN<T>(arr: readonly T[], n: number): T[] {
    const pool = [...arr];
    const out: T[] = [];
    for (let i = 0; i < n && pool.length > 0; i++) {
      const idx = this.int(0, pool.length - 1);
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }

  weighted<T>(entries: [T, number][]): T {
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = this.float(0, total);
    for (const [item, w] of entries) {
      if (r < w) return item;
      r -= w;
    }
    return entries[entries.length - 1][0];
  }
}
