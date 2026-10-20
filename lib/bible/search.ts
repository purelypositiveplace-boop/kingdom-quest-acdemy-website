import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { BOOKS, type BibleBook, type Testament } from "@/data/bible/books";

type BookJson = { id: string; chapters: string[][] };
const cache = new Map<string, BookJson>();

async function loadBook(id: string): Promise<BookJson> {
  const hit = cache.get(id);
  if (hit) return hit;
  const j = JSON.parse(await fs.readFile(path.join(process.cwd(), "public", "bible", "web", `${id}.json`), "utf8")) as BookJson;
  cache.set(id, j);
  return j;
}

export interface SearchHit {
  book: BibleBook;
  chapter: number;
  verse: number;
  text: string;
}

/** Whole-word-start, case-insensitive search over the whole WEB Bible, in canonical order. */
export async function searchBible(query: string, testament?: Testament, limit = 100): Promise<{ hits: SearchHit[]; total: number }> {
  const q = query.trim().replace(/\s+/g, " ");
  if (q.length < 2) return { hits: [], total: 0 };
  const re = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]")}`, "i");
  const hits: SearchHit[] = [];
  let total = 0;
  for (const book of BOOKS) {
    if (testament && book.testament !== testament) continue;
    const j = await loadBook(book.id);
    j.chapters.forEach((ch, ci) =>
      ch.forEach((text, vi) => {
        if (!text || !re.test(text)) return;
        total++;
        if (hits.length < limit) hits.push({ book, chapter: ci + 1, verse: vi + 1, text });
      }),
    );
  }
  return { hits, total };
}
