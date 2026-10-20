import { LESSONS } from "@/lib/curriculum";
import { CHARACTERS } from "@/data/characters";
import { GAMES } from "@/data/games";
import { BOOKS } from "@/data/bible/books";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { VALUES } from "@/data/values";
import { PLACES } from "@/data/places";
import { PRINTABLES } from "@/data/printables";
import verseText from "@/data/verses/verse-text.generated.json";
import type { AgeLevel, Testament } from "@/lib/curriculum/types";

export type ResultType = "Lesson" | "Bible person" | "Game" | "Bible book" | "Memory verse" | "Value" | "Place" | "Printable";

export interface SearchDoc {
  type: ResultType;
  title: string;
  href: string;
  text: string;
  testament?: Testament;
  ages?: AgeLevel[];
  topics?: string[];
  book?: string;
  minutes?: number;
}

const VT = verseText as Record<string, { verses: { text: string }[] }>;

/** A single in-memory index of everything a child can find. Small enough to search on the client. */
export const SEARCH_INDEX: SearchDoc[] = [
  ...LESSONS.map((l) => ({ type: "Lesson" as const, title: l.title, href: `/lessons/${l.id}`, text: [l.summary, ...l.refs, ...l.characters, ...l.topics].join(" "), testament: l.testament, ages: l.ages, topics: l.topics, book: l.refs[0].replace(/\s\d.*$/, ""), minutes: l.minutes.explorers })),
  ...CHARACTERS.map((c) => ({ type: "Bible person" as const, title: c.name, href: `/characters/${c.id}`, text: `${c.role} ${c.kid} ${c.events.join(" ")}`, testament: c.testament })),
  ...GAMES.map((g) => ({ type: "Game" as const, title: g.title, href: `/games/${g.id}`, text: `${g.blurb} ${g.learn} ${g.skills.join(" ")}`, ages: g.ages, minutes: g.minutes })),
  ...BOOKS.map((b) => ({ type: "Bible book" as const, title: b.name, href: `/bible/${b.id}/1`, text: `${b.about} ${b.group}`, testament: b.testament, book: b.name })),
  ...MEMORY_VERSES.map((v) => ({ type: "Memory verse" as const, title: v.ref, href: `/verses`, text: `${VT[v.ref]?.verses.map((x) => x.text).join(" ") ?? ""} ${v.meaning} ${v.themes.join(" ")}`, ages: v.ages, topics: v.themes, book: v.ref.replace(/\s\d.*$/, "") })),
  ...VALUES.map((v) => ({ type: "Value" as const, title: v.title, href: `/values/${v.id}`, text: `${v.teaching} ${v.scenario}` })),
  ...PLACES.map((p) => ({ type: "Place" as const, title: p.name, href: `/map`, text: `${p.geo} ${p.context}` })),
  ...PRINTABLES.map((p) => ({ type: "Printable" as const, title: p.title, href: `/printables/${p.id}`, text: `${p.description} ${p.category}` })),
];

export interface SearchFilters {
  type?: ResultType | "all";
  testament?: Testament | "all";
  age?: AgeLevel | "all";
  maxMinutes?: number;
}

export function search(q: string, f: SearchFilters = {}): SearchDoc[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return SEARCH_INDEX.map((d) => {
    if (f.type && f.type !== "all" && d.type !== f.type) return null;
    if (f.testament && f.testament !== "all" && d.testament && d.testament !== f.testament) return null;
    if (f.age && f.age !== "all" && d.ages && !d.ages.includes(f.age)) return null;
    if (f.maxMinutes && d.minutes && d.minutes > f.maxMinutes) return null;
    if (!terms.length) return { d, score: 0 };
    const title = d.title.toLowerCase();
    const body = d.text.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (title.includes(t)) score += 5;
      else if (body.includes(t)) score += 1;
      else return null;
    }
    return { d, score };
  })
    .filter((x): x is { d: SearchDoc; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.d);
}
