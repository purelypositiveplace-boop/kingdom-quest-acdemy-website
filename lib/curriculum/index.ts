import { FEATURED_LESSONS } from "@/data/lessons/featured";
import { OT_LESSONS } from "@/data/lessons/old-testament";
import { NT_LESSONS } from "@/data/lessons/new-testament";
import { STORY_CATEGORIES } from "@/data/categories";
import type { AgeLevel, Lesson, QuizQuestion, SceneProp, StoryScene } from "./types";

/** Every lesson, in curriculum order. */
export const LESSONS: Lesson[] = [...FEATURED_LESSONS, ...OT_LESSONS, ...NT_LESSONS].sort((a, b) => a.order - b.order);

export const LESSON_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l])) as Record<string, Lesson>;

export function getLesson(id: string): Lesson | undefined {
  return LESSON_BY_ID[id];
}

export function lessonsInWorld(worldId: string): Lesson[] {
  return LESSONS.filter((l) => l.world === worldId);
}

export function categoriesWithLessons() {
  return STORY_CATEGORIES.map((c) => ({ ...c, lessons: LESSONS.filter((l) => l.category === c.id) })).filter((c) => c.lessons.length > 0);
}

/** The quiz a child of this level sees. Younger levels get easier questions and fewer of them. */
export function quizForLevel(lesson: Lesson, level: AgeLevel): QuizQuestion[] {
  const max = level === "disciples" ? 1 : level === "explorers" ? 2 : 3;
  const count = level === "disciples" ? 3 : 5;
  const fit = lesson.quiz.filter((q) => q.difficulty <= max);
  // top up with the next-easiest questions so every level gets a full quiz
  const extra = lesson.quiz.filter((q) => q.difficulty > max).sort((a, b) => a.difficulty - b.difficulty);
  return [...fit, ...extra].slice(0, Math.min(count, lesson.quiz.length));
}

/** Scene text suited to the child's level. */
export function sceneText(scene: StoryScene, level: AgeLevel): string {
  return level === "disciples" && scene.short ? scene.short : scene.text;
}

/** The next lesson after this one in curriculum order (wraps to the first unfinished). */
export function nextLesson(afterId: string | undefined, done: Set<string>, level: AgeLevel): Lesson | undefined {
  const pool = LESSONS.filter((l) => l.ages.includes(level));
  const start = afterId ? pool.findIndex((l) => l.id === afterId) + 1 : 0;
  const ordered = [...pool.slice(start), ...pool.slice(0, start)];
  return ordered.find((l) => !done.has(l.id)) ?? pool[0];
}

/** Props for a lesson's banner art: a few from its first scenes so the picture is never empty. */
export function lessonArtProps(lesson: Lesson): SceneProp[] {
  const out: SceneProp[] = [];
  for (const sc of lesson.scenes) for (const p of sc.props ?? []) if (!out.includes(p) && out.length < 4) out.push(p);
  return out;
}
