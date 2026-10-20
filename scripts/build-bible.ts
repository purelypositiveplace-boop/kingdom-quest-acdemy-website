/**
 * Converts the public-domain World English Bible (npm: world-english-bible) into:
 *   public/bible/web/<book-id>.json         chapters as arrays of verse strings (for the reader)
 *   data/bible/chapter-counts.generated.json number of chapters per book
 *   data/verses/verse-text.generated.json   exact WEB text for every reference the curriculum uses
 *
 * Run: npm run build:bible   (also runs automatically before `npm run build`)
 * Fails loudly if any curriculum reference does not resolve, so invented verses can't ship.
 */
import fs from "node:fs";
import path from "node:path";
import { BOOKS } from "../data/bible/books";
import { parseRef, sliceVerses } from "../lib/bible/reference";
import { allScriptureRefs } from "../lib/curriculum/scripture-refs";

type Entry = { type: string; chapterNumber?: number; verseNumber?: number; value?: string };

const root = path.resolve(__dirname, "..");
const src = path.join(root, "node_modules", "world-english-bible", "json");
const outDir = path.join(root, "public", "bible", "web");
fs.mkdirSync(outDir, { recursive: true });

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

const allChapters: Record<string, string[][]> = {};
const counts: Record<string, number> = {};

for (const book of BOOKS) {
  const entries: Entry[] = JSON.parse(fs.readFileSync(path.join(src, `${book.file}.json`), "utf8"));
  const chapters: string[][] = [];
  for (const e of entries) {
    if (!e.type.endsWith("text") || !e.chapterNumber || !e.verseNumber || !e.value) continue;
    const ch = (chapters[e.chapterNumber - 1] ??= []);
    ch[e.verseNumber - 1] = ch[e.verseNumber - 1] ? `${ch[e.verseNumber - 1]} ${e.value}` : e.value;
  }
  const tidy = Array.from(chapters, (ch) => {
    const verses = Array.from(ch ?? [], (v) => clean(v ?? ""));
    // a trailing empty slot is a numbering artifact (e.g. Romans 16:25, printed at Romans 14:24–26 in the WEB)
    while (verses.length && !verses[verses.length - 1]) verses.pop();
    return verses;
  });
  allChapters[book.id] = tidy;
  counts[book.id] = tidy.length;
  fs.writeFileSync(
    path.join(outDir, `${book.id}.json`),
    JSON.stringify({ id: book.id, name: book.name, translation: "WEB", chapters: tidy }),
  );
}

fs.writeFileSync(path.join(root, "data", "bible", "chapter-counts.generated.json"), JSON.stringify(counts, null, 1));

const verseText: Record<string, { ref: string; translation: "WEB"; verses: { chapter: number; verse: number; text: string }[] }> = {};
const failures: string[] = [];
for (const ref of allScriptureRefs()) {
  const p = parseRef(ref);
  const verses = p ? sliceVerses(allChapters[p.book.id], p) : null;
  if (!verses) {
    failures.push(ref);
    continue;
  }
  verseText[ref] = { ref, translation: "WEB", verses };
}
fs.mkdirSync(path.join(root, "data", "verses"), { recursive: true });
fs.writeFileSync(path.join(root, "data", "verses", "verse-text.generated.json"), JSON.stringify(verseText, null, 1));

console.log(`WEB: ${BOOKS.length} books written, ${Object.keys(verseText).length} curriculum references resolved.`);
if (failures.length) {
  console.error(`Unresolved references:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
