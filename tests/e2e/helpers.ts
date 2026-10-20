import type { Page } from "@playwright/test";
import { getLesson, quizForLevel } from "../../lib/curriculum";
import type { AgeLevel } from "../../lib/curriculum/types";

/** Collects uncaught page errors (including hydration failures) so tests can assert there are none. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/** Answers every question in the current quiz-question card by clicking the correct choice text. */
export async function answerCorrect(page: Page, correct: string) {
  await page.getByTestId("quiz-question").last().getByRole("button", { name: new RegExp(`^${escape(correct)}`) }).click();
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Plays a whole lesson story (answering in-story check questions) and its quiz. */
export async function playLessonStoryAndQuiz(page: Page, lessonId: string, level: AgeLevel) {
  const lesson = getLesson(lessonId)!;
  await page.getByTestId("lesson-start").click();
  for (let i = 0; i < lesson.scenes.length; i++) {
    const s = lesson.scenes[i];
    if (s.question) await answerCorrect(page, s.question.choices[s.question.answer]);
    if (i < lesson.scenes.length - 1) await page.getByTestId("story-next").click();
  }
  await page.getByTestId("story-finish").click();
  const quiz = quizForLevel(lesson, level);
  for (const q of quiz) {
    await answerCorrect(page, q.choices[q.answer]);
    await page.getByTestId("quiz-next").click();
  }
  return quiz.length;
}

export async function playCreationSort(page: Page) {
  await page.getByTestId("game-start").click();
  for (let d = 1; d <= 7; d++) {
    await page.getByTestId(`card-${d}`).click();
    await page.getByTestId(`slot-${d}`).click();
  }
  await page.getByTestId("game-complete").waitFor();
}
