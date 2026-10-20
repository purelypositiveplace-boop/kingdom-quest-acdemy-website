import { describe, expect, it } from "vitest";
import { buildCrossword, validateCrossword, CROSSWORD_SETS } from "@/lib/games/crossword";
import { generateWordSearch, readPlacement, findSelection, WORD_LISTS } from "@/lib/games/wordsearch";
import { generateMaze, solveMaze } from "@/lib/games/maze";
import { shuffleChoices, mulberry32 } from "@/lib/games/random";

describe("crossword generator", () => {
  for (const set of ["easy", "advanced"] as const) {
    it(`builds a valid ${set} puzzle with real intersections`, () => {
      const cw = buildCrossword(CROSSWORD_SETS[set]);
      expect(validateCrossword(cw)).toEqual([]);
      expect(cw.entries.length).toBeGreaterThanOrEqual(6);
      expect(cw.entries.some((e) => e.dir === "across")).toBe(true);
      expect(cw.entries.some((e) => e.dir === "down")).toBe(true);
    });
  }
  it("rejects a corrupted grid", () => {
    const cw = buildCrossword(CROSSWORD_SETS.easy);
    const e = cw.entries[0];
    cw.cells[e.row][e.col] = "Z";
    expect(validateCrossword(cw).length).toBeGreaterThan(0);
  });
});

describe("word search generator", () => {
  it("places every word so it can be read back", () => {
    for (const seed of [1, 2, 3, 99]) {
      for (const list of Object.values(WORD_LISTS)) {
        const ws = generateWordSearch(list.words, 12, { diagonal: true, backwards: true, seed });
        expect(ws.skipped).toEqual([]);
        for (const p of ws.placements) expect(readPlacement(ws, p)).toBe(p.word);
      }
    }
  });
  it("finds a selection in either direction", () => {
    const ws = generateWordSearch(["NOAH"], 8, { seed: 4 });
    const p = ws.placements[0];
    const er = p.r + p.dr * 3;
    const ec = p.c + p.dc * 3;
    expect(findSelection(ws, p.r, p.c, er, ec)?.word).toBe("NOAH");
    expect(findSelection(ws, er, ec, p.r, p.c)?.word).toBe("NOAH");
  });
});

describe("maze generator", () => {
  it("always has a path from start to finish", () => {
    for (const seed of [1, 5, 17, 123]) {
      const m = generateMaze(12, 14, seed);
      const path = solveMaze(m);
      expect(path).not.toBeNull();
      expect(path![0]).toEqual([0, 0]);
      expect(path![path!.length - 1]).toEqual([11, 13]);
    }
  });
});

describe("answer shuffling", () => {
  it("keeps the right answer pointing at the same text", () => {
    const rand = mulberry32(8);
    for (let i = 0; i < 50; i++) {
      const s = shuffleChoices(["God", "A king", "Nobody"], 0, rand);
      expect(s.choices[s.answer]).toBe("God");
    }
  });
});
