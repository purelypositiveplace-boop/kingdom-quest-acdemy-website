/** Small deterministic PRNG so puzzles can be reproduced (and tested) from a seed. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffles a question's choices and returns the new index of the right answer. */
export function shuffleChoices(choices: string[], answer: number, rand: () => number = Math.random) {
  const order = shuffle(choices.map((_, i) => i), rand);
  return { choices: order.map((i) => choices[i]), answer: order.indexOf(answer) };
}
