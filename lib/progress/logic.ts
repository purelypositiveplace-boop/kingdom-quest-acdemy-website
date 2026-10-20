import { ACHIEVEMENTS } from "@/data/achievements";
import type { ProgressSnapshot } from "./types";

const DAY = 24 * 60 * 60 * 1000;
/** Leitner intervals in days for boxes 1–5. */
export const VERSE_INTERVALS = [0, 1, 2, 4, 8, 16];

const log = (p: ProgressSnapshot, type: string, id: string) => [...p.history, { type, id, at: Date.now() }].slice(-200);

/** Records a lesson completion. Replays keep the best score; stars are only added the first time. */
export function applyLessonComplete(p: ProgressSnapshot, id: string, version: number, score: number, total: number, stars: number): ProgressSnapshot {
  const prev = p.lessons[id];
  const best = prev && prev.score >= score ? prev : { version, stars, score, total, at: Date.now() };
  return {
    ...p,
    stars: p.stars + (prev ? 0 : stars),
    lessons: { ...p.lessons, [id]: best },
    history: log(p, "lesson", id),
  };
}

export function applyGame(p: ProgressSnapshot, id: string, won: boolean, score: number, mode?: string): ProgressSnapshot {
  const prev = p.games[id] ?? { plays: 0, wins: 0, best: 0, modes: [], last: 0 };
  const firstWin = won && prev.wins === 0;
  const modes = won && mode && !prev.modes.includes(mode) ? [...prev.modes, mode] : prev.modes;
  return {
    ...p,
    stars: p.stars + (firstWin ? 1 : 0),
    games: { ...p.games, [id]: { plays: prev.plays + 1, wins: prev.wins + (won ? 1 : 0), best: Math.max(prev.best, score), modes, last: Date.now() } },
    history: won ? log(p, "game", id) : p.history,
  };
}

/** Spaced repetition: correct moves a verse up a box, a miss moves it back to box 1 (no penalty shown). */
export function applyVerseReview(p: ProgressSnapshot, ref: string, correct: boolean, now = Date.now()): ProgressSnapshot {
  const prev = p.verses[ref] ?? { box: 0, due: now, reviews: 0 };
  const box = correct ? Math.min(5, prev.box + 1) : 1;
  const learnedNow = prev.box < 3 && box >= 3;
  return {
    ...p,
    stars: p.stars + (learnedNow ? 1 : 0),
    verses: { ...p.verses, [ref]: { box, due: now + VERSE_INTERVALS[box] * DAY, reviews: prev.reviews + 1 } },
    history: learnedNow ? log(p, "verse", ref) : p.history,
  };
}

/** Badges the snapshot qualifies for but hasn't been given yet. */
export function evaluateBadges(p: ProgressSnapshot): string[] {
  return ACHIEVEMENTS.filter((a) => !p.badges[a.id] && a.check(p)).map((a) => a.id);
}

export function versesDue(p: ProgressSnapshot, refs: string[], now = Date.now()): string[] {
  return refs.filter((r) => p.verses[r] && p.verses[r].due <= now);
}
