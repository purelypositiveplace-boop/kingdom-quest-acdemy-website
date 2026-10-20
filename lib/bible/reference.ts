import { BOOK_BY_NAME, type BibleBook } from "@/data/bible/books";

/** A parsed Bible reference. Verses are 1-based. A whole chapter has no verse range. */
export interface ParsedRef {
  book: BibleBook;
  chapter: number;
  verseStart?: number;
  /** same-chapter end verse */
  verseEnd?: number;
  /** cross-chapter range end, e.g. Genesis 1:1–2:3 */
  endChapter?: number;
}

const REF_RE = /^\s*((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?)\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?)?\s*$/;

/** Parses "John 3:16", "Galatians 5:22-23", "Genesis 1:1–2:3" or "Psalm 23". Returns null if invalid. */
export function parseRef(ref: string): ParsedRef | null {
  const m = REF_RE.exec(ref);
  if (!m) return null;
  let name = m[1].toLowerCase().replace(/\s+/g, " ").trim();
  if (name === "psalm") name = "psalms";
  if (name === "song of songs") name = "song of solomon";
  const book = BOOK_BY_NAME[name];
  if (!book) return null;
  const chapter = Number(m[2]);
  const out: ParsedRef = { book, chapter };
  if (m[3]) {
    out.verseStart = Number(m[3]);
    if (m[5]) {
      if (m[4]) {
        out.endChapter = Number(m[4]);
        out.verseEnd = Number(m[5]);
      } else {
        out.verseEnd = Number(m[5]);
      }
    }
  }
  return out;
}

/** Canonical key used for lookups and progress storage, e.g. "john-3-16" or "galatians-5-22-23". */
export function refKey(ref: string): string {
  return ref
    .toLowerCase()
    .replace(/[–:]/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Link into the reader for a reference. */
export function refHref(ref: string): string {
  const p = parseRef(ref);
  if (!p) return "/bible";
  return `/bible/${p.book.id}/${p.chapter}${p.verseStart ? `#v${p.verseStart}` : ""}`;
}

/** Extracts verse text for a parsed ref from chapters (chapters[c-1][v-1]). */
export function sliceVerses(chapters: string[][], p: ParsedRef): { chapter: number; verse: number; text: string }[] | null {
  const out: { chapter: number; verse: number; text: string }[] = [];
  const startCh = p.chapter;
  const endCh = p.endChapter ?? p.chapter;
  for (let c = startCh; c <= endCh; c++) {
    const ch = chapters[c - 1];
    if (!ch) return null;
    const from = c === startCh ? (p.verseStart ?? 1) : 1;
    const to = c === endCh ? (p.verseEnd ?? (p.verseStart && !p.endChapter ? p.verseStart : ch.length)) : ch.length;
    for (let v = from; v <= to; v++) {
      const text = ch[v - 1];
      if (text === undefined || text === "") return null;
      out.push({ chapter: c, verse: v, text });
    }
  }
  return out;
}
