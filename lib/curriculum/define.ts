import type { Lesson } from "./types";

type LessonInput = Omit<Lesson, "version" | "ages" | "minutes" | "reward" | "review"> &
  Partial<Pick<Lesson, "version" | "ages" | "minutes" | "reward" | "review">>;

/** Fills sensible defaults so lesson files stay focused on content. */
export function defineLesson(l: LessonInput): Lesson {
  return {
    version: 1,
    ages: ["disciples", "explorers", "champions"],
    minutes: { disciples: 5, explorers: 9, champions: 13 },
    reward: { stars: 2 },
    review: "needs-review",
    ...l,
  };
}
