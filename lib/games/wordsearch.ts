import { mulberry32, shuffle } from "./random";

export interface WordPlacement {
  word: string;
  r: number;
  c: number;
  dr: number;
  dc: number;
}

export interface WordSearch {
  size: number;
  grid: string[][];
  placements: WordPlacement[];
  skipped: string[];
}

const LETTERS = "ABCDEFGHIJKLMNOPRSTUVWY";

/** Builds a word search. Directions grow with difficulty; every placed word is verifiable. */
export function generateWordSearch(words: string[], size: number, opts: { diagonal?: boolean; backwards?: boolean; seed?: number } = {}): WordSearch {
  const rand = mulberry32(opts.seed ?? Date.now());
  const dirs: [number, number][] = [
    [0, 1],
    [1, 0],
  ];
  if (opts.diagonal) dirs.push([1, 1], [-1, 1]);
  if (opts.backwards) dirs.push([0, -1], [-1, 0], ...(opts.diagonal ? ([[-1, -1], [1, -1]] as [number, number][]) : []));
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placements: WordPlacement[] = [];
  const skipped: string[] = [];
  const clean = [...new Set(words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, "")))].sort((a, b) => b.length - a.length);

  for (const word of clean) {
    if (word.length > size) {
      skipped.push(word);
      continue;
    }
    let placed = false;
    for (let attempt = 0; attempt < 300 && !placed; attempt++) {
      const [dr, dc] = dirs[Math.floor(rand() * dirs.length)];
      const r = Math.floor(rand() * size);
      const c = Math.floor(rand() * size);
      const endR = r + dr * (word.length - 1);
      const endC = c + dc * (word.length - 1);
      if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
      let ok = true;
      for (let k = 0; k < word.length; k++) {
        const cell = grid[r + dr * k][c + dc * k];
        if (cell && cell !== word[k]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let k = 0; k < word.length; k++) grid[r + dr * k][c + dc * k] = word[k];
      placements.push({ word, r, c, dr, dc });
      placed = true;
    }
    if (!placed) skipped.push(word);
  }
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = LETTERS[Math.floor(rand() * LETTERS.length)];
  return { size, grid, placements: shuffle(placements, rand), skipped };
}

/** Returns the placement matching a selection from (r1,c1) to (r2,c2), in either direction. */
export function findSelection(ws: WordSearch, r1: number, c1: number, r2: number, c2: number): WordPlacement | undefined {
  return ws.placements.find((p) => {
    const er = p.r + p.dr * (p.word.length - 1);
    const ec = p.c + p.dc * (p.word.length - 1);
    return (p.r === r1 && p.c === c1 && er === r2 && ec === c2) || (p.r === r2 && p.c === c2 && er === r1 && ec === c1);
  });
}

export function readPlacement(ws: WordSearch, p: WordPlacement): string {
  return Array.from({ length: p.word.length }, (_, k) => ws.grid[p.r + p.dr * k][p.c + p.dc * k]).join("");
}

export const WORD_LISTS: Record<string, { title: string; words: string[] }> = {
  creation: { title: "Creation", words: ["LIGHT", "SKY", "LAND", "SEA", "TREES", "SUN", "MOON", "STARS", "FISH", "BIRDS", "ANIMALS", "REST"] },
  noah: { title: "Noah's Ark", words: ["NOAH", "ARK", "RAIN", "DOVE", "RAINBOW", "PROMISE", "ANIMALS", "OLIVE", "FLOOD", "FAMILY"] },
  christmas: { title: "Birth of Jesus", words: ["JESUS", "MARY", "JOSEPH", "MANGER", "ANGEL", "SHEPHERDS", "STAR", "BETHLEHEM", "GIFTS", "SAVIOUR"] },
  jesus: { title: "Life of Jesus", words: ["DISCIPLES", "PARABLE", "MIRACLE", "STORM", "BREAD", "FISH", "PRAYER", "CROSS", "RISEN", "LOVE"] },
  fruit: { title: "Fruit of the Spirit", words: ["LOVE", "JOY", "PEACE", "PATIENCE", "KINDNESS", "GOODNESS", "FAITH", "GENTLENESS", "SELFCONTROL"] },
};
