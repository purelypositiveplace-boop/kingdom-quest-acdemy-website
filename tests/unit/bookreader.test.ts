import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { paginate } from "@/components/bible/BookReader";

const genesis = JSON.parse(fs.readFileSync(path.join(__dirname, "../../public/bible/web/genesis.json"), "utf8")) as { chapters: string[][] };

describe("book reader pagination", () => {
  it("keeps every verse once, in order, and never splits one", () => {
    const verses = genesis.chapters[0].map((t, i) => ({ v: i + 1, t }));
    for (const budget of [400, 650, 900, 2000]) {
      const pages = paginate(verses, budget);
      expect(pages.flat().map((x) => x.v)).toEqual(verses.map((x) => x.v));
      expect(pages.every((p) => p.length > 0)).toBe(true);
    }
  });

  it("uses more pages for smaller budgets (bigger text)", () => {
    const verses = genesis.chapters[0].map((t, i) => ({ v: i + 1, t }));
    expect(paginate(verses, 400).length).toBeGreaterThan(paginate(verses, 900).length);
  });
});
