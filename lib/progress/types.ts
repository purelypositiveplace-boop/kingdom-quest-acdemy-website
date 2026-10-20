import type { AgeLevel } from "@/lib/curriculum/types";

export interface LessonRecord {
  /** content version the lesson was completed on */
  version: number;
  stars: number;
  score: number;
  total: number;
  at: number;
}

export interface GameRecord {
  plays: number;
  wins: number;
  best: number;
  /** modes completed, e.g. books-order "all" */
  modes: string[];
  last: number;
}

export interface VerseRecord {
  /** Leitner box 1–5; 3+ counts as "learned" */
  box: number;
  due: number;
  reviews: number;
}

/** Everything about one child's learning. Contains no personal information. */
export interface ProgressSnapshot {
  stars: number;
  lessons: Record<string, LessonRecord>;
  /** last scene index reached per lesson, for resume */
  scenes: Record<string, number>;
  games: Record<string, GameRecord>;
  verses: Record<string, VerseRecord>;
  values: Record<string, number>;
  prayers: string[];
  badges: Record<string, number>;
  favorites: string[];
  bookmarks: string[];
  history: { type: string; id: string; at: number }[];
}

export interface ChildProfileLocal {
  nickname: string;
  avatar: string;
  level: AgeLevel;
  world: string;
}

export const emptyProgress = (): ProgressSnapshot => ({
  stars: 0,
  lessons: {},
  scenes: {},
  games: {},
  verses: {},
  values: {},
  prayers: [],
  badges: {},
  favorites: [],
  bookmarks: [],
  history: [],
});
