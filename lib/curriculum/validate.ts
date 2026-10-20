import { LESSONS } from "./index";
import { parseRef } from "@/lib/bible/reference";
import { WORLD_BY_ID } from "@/data/worlds";
import { STORY_CATEGORIES } from "@/data/categories";
import { GAME_BY_ID } from "@/data/games";
import { ACHIEVEMENT_BY_ID } from "@/data/achievements";
import { PRINTABLE_BY_ID } from "@/data/printables";
import verseText from "@/data/verses/verse-text.generated.json";
import type { Lesson } from "./types";

export interface ValidationIssue {
  lessonId: string;
  level: "error" | "warning";
  message: string;
}

const VT = verseText as Record<string, unknown>;

/**
 * Checks a lesson is complete enough to publish. Used by tests (build fails on errors) and by
 * the admin area so incomplete content can't be approved.
 */
export function validateLesson(l: Lesson): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const err = (message: string) => out.push({ lessonId: l.id, level: "error", message });
  const warn = (message: string) => out.push({ lessonId: l.id, level: "warning", message });
  const required: (keyof Lesson)[] = ["title", "summary", "explanation", "application", "reflection", "prayer", "memoryVerse"];
  for (const k of required) if (!String(l[k] ?? "").trim()) err(`Missing ${k}`);
  if (!/^[a-z0-9-]+$/.test(l.id)) err("Lesson id must be lowercase letters, numbers and dashes");
  if (!l.refs.length) err("No Bible references");
  for (const r of l.refs) if (!parseRef(r)) err(`Bad reference "${r}"`);
  if (!VT[l.memoryVerse]) err(`Memory verse ${l.memoryVerse} has no WEB text (run npm run build:bible)`);
  if (l.objectives.length < 2) err("Needs at least 2 learning objectives");
  if (l.narrative.length < 2) err("Expanded narrative is too short");
  if (l.takeaways.length !== 3) err("Needs exactly 3 takeaways");
  if (l.vocabulary.length < 2) warn("Fewer than 2 vocabulary words");
  if (l.parentPrompts.length < 2) warn("Fewer than 2 parent discussion prompts");
  if (l.scenes.length < 4) err("Needs at least 4 story scenes");
  if (new Set(l.scenes.map((s) => s.id)).size !== l.scenes.length) err("Duplicate scene ids");
  for (const s of l.scenes) {
    if (!s.text.trim() || !s.alt.trim()) err(`Scene ${s.id} needs text and alt text`);
    if (s.tap && !(s.props ?? []).includes(s.tap.prop) && s.tap.prop !== "water") warn(`Scene ${s.id} tap prop "${s.tap.prop}" is not drawn in the scene`);
  }
  const qs = [...l.quiz, ...l.scenes.flatMap((s) => (s.question ? [s.question] : []))];
  if (l.quiz.length < 4) err("Needs at least 4 quiz questions");
  if (l.quiz.filter((q) => q.difficulty === 1).length < 2) err("Needs at least 2 easy (difficulty 1) questions for Little Disciples");
  if (new Set(qs.map((q) => q.id)).size !== qs.length) err("Duplicate question ids");
  for (const q of qs) {
    if (q.answer < 0 || q.answer >= q.choices.length) err(`Question ${q.id} answer index out of range`);
    if (new Set(q.choices).size !== q.choices.length) err(`Question ${q.id} has duplicate choices`);
    if (!q.explain.trim()) err(`Question ${q.id} needs an explanation`);
  }
  if (!WORLD_BY_ID[l.world]) err(`Unknown world ${l.world}`);
  if (!STORY_CATEGORIES.some((c) => c.id === l.category)) err(`Unknown category ${l.category}`);
  if (l.activity.kind === "game" && !GAME_BY_ID[l.activity.gameId ?? ""]) err(`Unknown activity game ${l.activity.gameId}`);
  if (l.activity.kind === "printable" && !PRINTABLE_BY_ID[l.activity.printableId ?? ""]) err(`Unknown printable ${l.activity.printableId}`);
  if (l.reward.badge && !ACHIEVEMENT_BY_ID[l.reward.badge]) err(`Unknown badge ${l.reward.badge}`);
  return out;
}

export function validateCurriculum(): ValidationIssue[] {
  const out = LESSONS.flatMap(validateLesson);
  const ids = LESSONS.map((l) => l.id);
  for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) out.push({ lessonId: id, level: "error", message: "Duplicate lesson id" });
  return out;
}
