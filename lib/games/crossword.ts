/**
 * Crossword builder with validated intersections. Words only cross where letters agree, never
 * touch side-by-side, and the result is one connected puzzle. `validateCrossword` re-checks this.
 */
export interface ClueWord {
  answer: string;
  clue: string;
}

export interface Entry extends ClueWord {
  row: number;
  col: number;
  dir: "across" | "down";
  number: number;
}

export interface Crossword {
  rows: number;
  cols: number;
  entries: Entry[];
  /** null = black square */
  cells: (string | null)[][];
  dropped: string[];
}

type Placed = { answer: string; clue: string; row: number; col: number; dir: "across" | "down" };

const key = (r: number, c: number) => `${r},${c}`;

function canPlace(grid: Map<string, string>, w: string, row: number, col: number, dir: "across" | "down"): number {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;
  // cells before and after must be empty
  if (grid.has(key(row - dr, col - dc)) || grid.has(key(row + dr * w.length, col + dc * w.length))) return -1;
  let crossings = 0;
  for (let k = 0; k < w.length; k++) {
    const r = row + dr * k;
    const c = col + dc * k;
    const existing = grid.get(key(r, c));
    if (existing) {
      if (existing !== w[k]) return -1;
      crossings++;
      continue;
    }
    // new letter: neighbours perpendicular to the word must be empty (no accidental words)
    if (grid.has(key(r + dc, c + dr)) || grid.has(key(r - dc, c - dr))) return -1;
  }
  return crossings;
}

export function buildCrossword(words: ClueWord[]): Crossword {
  const list = [...words].map((w) => ({ ...w, answer: w.answer.toUpperCase().replace(/[^A-Z]/g, "") })).sort((a, b) => b.answer.length - a.answer.length);
  const grid = new Map<string, string>();
  const placed: Placed[] = [];
  const dropped: string[] = [];
  const put = (p: Placed) => {
    const dr = p.dir === "down" ? 1 : 0;
    const dc = p.dir === "across" ? 1 : 0;
    for (let k = 0; k < p.answer.length; k++) grid.set(key(p.row + dr * k, p.col + dc * k), p.answer[k]);
    placed.push(p);
  };

  let pending = list;
  if (pending.length) {
    put({ ...pending[0], row: 0, col: 0, dir: "across" });
    pending = pending.slice(1);
  }
  // multiple passes so words that couldn't fit early get another chance
  for (let pass = 0; pass < 3 && pending.length; pass++) {
    const still: typeof pending = [];
    for (const w of pending) {
      let best: Placed | null = null;
      let bestScore = 0;
      for (const p of placed) {
        const pdr = p.dir === "down" ? 1 : 0;
        const pdc = p.dir === "across" ? 1 : 0;
        for (let i = 0; i < p.answer.length; i++) {
          for (let j = 0; j < w.answer.length; j++) {
            if (p.answer[i] !== w.answer[j]) continue;
            const dir = p.dir === "across" ? "down" : "across";
            const r = p.row + pdr * i - (dir === "down" ? j : 0);
            const c = p.col + pdc * i - (dir === "across" ? j : 0);
            const score = canPlace(grid, w.answer, r, c, dir);
            if (score > bestScore) {
              bestScore = score;
              best = { ...w, row: r, col: c, dir };
            }
          }
        }
      }
      if (best) put(best);
      else still.push(w);
    }
    pending = still;
  }
  dropped.push(...pending.map((p) => p.answer));

  const minR = Math.min(...placed.map((p) => p.row));
  const minC = Math.min(...placed.map((p) => p.col));
  const maxR = Math.max(...placed.map((p) => p.row + (p.dir === "down" ? p.answer.length - 1 : 0)));
  const maxC = Math.max(...placed.map((p) => p.col + (p.dir === "across" ? p.answer.length - 1 : 0)));
  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;
  const cells: (string | null)[][] = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => grid.get(key(r + minR, c + minC)) ?? null));

  // standard numbering: left-to-right, top-to-bottom
  const norm = placed.map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }));
  const starts = [...new Set(norm.map((p) => key(p.row, p.col)))].sort((a, b) => {
    const [ar, ac] = a.split(",").map(Number);
    const [br, bc] = b.split(",").map(Number);
    return ar - br || ac - bc;
  });
  const entries: Entry[] = norm
    .map((p) => ({ ...p, number: starts.indexOf(key(p.row, p.col)) + 1 }))
    .sort((a, b) => (a.dir === b.dir ? a.number - b.number : a.dir === "across" ? -1 : 1));
  return { rows, cols, entries, cells, dropped };
}

/** Independent checker used by tests: every entry reads correctly and every letter is used. */
export function validateCrossword(cw: Crossword): string[] {
  const errors: string[] = [];
  const used = new Set<string>();
  for (const e of cw.entries) {
    let s = "";
    for (let k = 0; k < e.answer.length; k++) {
      const r = e.row + (e.dir === "down" ? k : 0);
      const c = e.col + (e.dir === "across" ? k : 0);
      s += cw.cells[r]?.[c] ?? "#";
      used.add(key(r, c));
    }
    if (s !== e.answer) errors.push(`${e.answer} reads as ${s}`);
  }
  cw.cells.forEach((row, r) => row.forEach((ch, c) => ch && !used.has(key(r, c)) && errors.push(`orphan letter at ${r},${c}`)));
  return errors;
}

export const CROSSWORD_SETS: Record<"easy" | "advanced", ClueWord[]> = {
  easy: [
    { answer: "RAINBOW", clue: "The sign of God's promise to Noah" },
    { answer: "ARK", clue: "The big boat Noah built" },
    { answer: "LIGHT", clue: "What God made on the first day" },
    { answer: "DAVID", clue: "Shepherd boy who faced Goliath" },
    { answer: "MANGER", clue: "Where baby Jesus was laid" },
    { answer: "JONAH", clue: "He was swallowed by a great fish" },
    { answer: "STAR", clue: "The wise men followed it" },
    { answer: "MOSES", clue: "He led God's people out of Egypt" },
    { answer: "LIONS", clue: "Daniel was safe in their den" },
    { answer: "SHEEP", clue: "The shepherd searched for one that was lost" },
  ],
  advanced: [
    { answer: "BETHLEHEM", clue: "Town where Jesus was born" },
    { answer: "GENESIS", clue: "First book of the Bible" },
    { answer: "PHARAOH", clue: "Title of Egypt's king" },
    { answer: "GOLIATH", clue: "Philistine giant" },
    { answer: "PENTECOST", clue: "Day the Holy Spirit came (Acts 2)" },
    { answer: "ZACCHAEUS", clue: "Tax collector who climbed a sycamore tree" },
    { answer: "NAZARETH", clue: "Town where Jesus grew up" },
    { answer: "SAMARITAN", clue: "The neighbour who helped in Jesus' parable" },
    { answer: "COVENANT", clue: "A serious promise, like God's with Noah" },
    { answer: "JERICHO", clue: "City whose walls fell down" },
    { answer: "DAMASCUS", clue: "City Saul was travelling to" },
    { answer: "ESTHER", clue: "Brave queen of Persia" },
  ],
};
