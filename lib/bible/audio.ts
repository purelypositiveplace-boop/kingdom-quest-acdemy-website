import manifest from "@/data/bible-audio.generated.json";

/** Chapters that have a real recording (mp3 + verse timing). Built by scripts/build-audio-manifest.ts. */
const CHAPTERS = new Set((manifest as { chapters: string[] }).chapters);

export interface ChapterTiming {
  verses: { v: number; start: number }[];
  duration: number;
}

export function hasChapterAudio(book: string, chapter: number) {
  return CHAPTERS.has(`${book}/${chapter}`);
}

export function chapterAudio(book: string, chapter: number) {
  return hasChapterAudio(book, chapter) ? { mp3: `/audio/bible/${book}/${chapter}.mp3`, timing: `/audio/bible/${book}/${chapter}.json` } : null;
}

export function recordedChapters(book: string): number[] {
  return [...CHAPTERS].filter((k) => k.startsWith(`${book}/`)).map((k) => Number(k.split("/")[1])).sort((a, b) => a - b);
}

export const anyBibleAudio = () => CHAPTERS.size > 0;
