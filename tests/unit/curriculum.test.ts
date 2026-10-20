import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { LESSONS, quizForLevel } from "@/lib/curriculum";
import { validateCurriculum } from "@/lib/curriculum/validate";
import { allScriptureRefs } from "@/lib/curriculum/scripture-refs";
import { parseRef, sliceVerses } from "@/lib/bible/reference";
import { BOOKS } from "@/data/bible/books";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { TRIVIA } from "@/data/questions/trivia";
import { CHARACTERS } from "@/data/characters";
import { VALUES } from "@/data/values";
import { GAMES } from "@/data/games";
import { WORLDS } from "@/data/worlds";
import { PRINTABLES } from "@/data/printables";
import { ACHIEVEMENTS } from "@/data/achievements";
import { GAME_COMPONENT_IDS } from "./game-ids";
import verseText from "@/data/verses/verse-text.generated.json";

const bible = (id: string) => JSON.parse(fs.readFileSync(path.join(__dirname, "../../public/bible/web", `${id}.json`), "utf8")) as { chapters: string[][] };

describe("curriculum content", () => {
  it("meets the minimum starter release", () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(30);
    expect(LESSONS.filter((l) => l.featured).length).toBeGreaterThanOrEqual(3);
    expect(MEMORY_VERSES.length).toBeGreaterThanOrEqual(30);
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(20);
    expect(VALUES.length).toBeGreaterThanOrEqual(10);
    expect(GAMES.length).toBeGreaterThanOrEqual(10);
    expect(PRINTABLES.length).toBeGreaterThanOrEqual(5);
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);
    expect(WORLDS.length).toBe(10);
  });

  it("every lesson passes publishing validation", () => {
    const errors = validateCurriculum().filter((i) => i.level === "error");
    expect(errors).toEqual([]);
  });

  it("has 30 distinct trivia questions per level", () => {
    for (const level of ["disciples", "explorers", "champions"] as const) {
      const qs = TRIVIA.filter((q) => q.level === level);
      expect(qs.length).toBe(30);
      expect(new Set(qs.map((q) => q.q.toLowerCase())).size).toBe(30);
    }
    for (const q of TRIVIA) expect(q.answer).toBeLessThan(q.choices.length);
  });

  it("gives every level enough quiz questions (5 for the sample journey)", () => {
    for (const l of LESSONS) {
      expect(quizForLevel(l, "disciples").length).toBeGreaterThanOrEqual(2);
      expect(quizForLevel(l, "explorers").length).toBeGreaterThanOrEqual(4);
    }
    expect(quizForLevel(LESSONS.find((l) => l.id === "creation")!, "explorers")).toHaveLength(5);
  });

  it("every game in the registry has a component", () => {
    for (const g of GAMES) expect(GAME_COMPONENT_IDS).toContain(g.id);
  });
});

describe("Scripture integrity", () => {
  it("contains all 66 books of the Protestant canon", () => {
    expect(BOOKS).toHaveLength(66);
    expect(BOOKS.filter((b) => b.testament === "OT")).toHaveLength(39);
    for (const b of BOOKS) expect(bible(b.id).chapters.length).toBeGreaterThan(0);
  });

  it("every quoted reference resolves to exact WEB text", () => {
    const vt = verseText as Record<string, { verses: { text: string }[] }>;
    for (const ref of allScriptureRefs()) {
      const p = parseRef(ref);
      expect(p, ref).not.toBeNull();
      const fromBible = sliceVerses(bible(p!.book.id).chapters, p!)!.map((v) => v.text).join(" ");
      expect(vt[ref].verses.map((v) => v.text).join(" "), ref).toBe(fromBible);
    }
  });

  it("every cited passage exists in the Bible", () => {
    const refs = [...LESSONS.flatMap((l) => l.refs), ...CHARACTERS.flatMap((c) => c.passages)];
    for (const r of refs) {
      const p = parseRef(r);
      expect(p, r).not.toBeNull();
      expect(sliceVerses(bible(p!.book.id).chapters, p!), r).not.toBeNull();
    }
  });

  it("spot-checks known verses", () => {
    const vt = verseText as Record<string, { verses: { text: string }[] }>;
    expect(vt["Genesis 1:1"].verses[0].text).toBe("In the beginning, God created the heavens and the earth.");
    expect(vt["Psalm 56:3"].verses[0].text).toBe("When I am afraid, I will put my trust in you.");
  });

  it("parses reference formats", () => {
    expect(parseRef("Genesis 1:1–2:3")).toMatchObject({ chapter: 1, verseStart: 1, endChapter: 2, verseEnd: 3 });
    expect(parseRef("1 John 1:9")?.book.id).toBe("1-john");
    expect(parseRef("Psalm 23")?.book.id).toBe("psalms");
    expect(parseRef("Hezekiah 3:1")).toBeNull();
  });
});
