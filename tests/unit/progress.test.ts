import { describe, expect, it } from "vitest";
import { applyGame, applyLessonComplete, applyVerseReview, evaluateBadges, versesDue } from "@/lib/progress/logic";
import { emptyProgress } from "@/lib/progress/types";
import { progressSchema, childCreateSchema, signupSchema } from "@/lib/auth/schemas";

describe("progress logic", () => {
  it("awards stars once per lesson and keeps the best score", () => {
    let p = applyLessonComplete(emptyProgress(), "creation", 1, 3, 5, 3);
    expect(p.stars).toBe(3);
    p = applyLessonComplete(p, "creation", 1, 5, 5, 3);
    expect(p.stars).toBe(3);
    expect(p.lessons.creation.score).toBe(5);
    p = applyLessonComplete(p, "creation", 1, 1, 5, 3);
    expect(p.lessons.creation.score).toBe(5);
  });

  it("earns Creation Explorer and Story Beginner after the creation lesson", () => {
    const p = applyLessonComplete(emptyProgress(), "creation", 1, 5, 5, 3);
    expect(evaluateBadges(p)).toEqual(expect.arrayContaining(["creation-explorer", "story-beginner"]));
  });

  it("records game modes and the Bible Books Master award", () => {
    let p = applyGame(emptyProgress(), "books-order", true, 80, "all");
    p = applyGame(p, "books-order", false, 10);
    expect(p.games["books-order"]).toMatchObject({ plays: 2, wins: 1, best: 80, modes: ["all"] });
    expect(evaluateBadges(p)).toContain("bible-books-master");
  });

  it("moves verses through spaced-repetition boxes without penalties", () => {
    const now = 1_000_000;
    let p = applyVerseReview(emptyProgress(), "John 3:16", true, now);
    p = applyVerseReview(p, "John 3:16", true, now);
    p = applyVerseReview(p, "John 3:16", true, now);
    expect(p.verses["John 3:16"].box).toBe(3);
    expect(p.stars).toBe(1);
    p = applyVerseReview(p, "John 3:16", false, now);
    expect(p.verses["John 3:16"].box).toBe(1);
    expect(p.stars).toBe(1);
    expect(versesDue(p, ["John 3:16"], now + 2 * 86400000)).toEqual(["John 3:16"]);
  });
});

describe("server validation", () => {
  it("accepts a real progress snapshot and rejects junk", () => {
    const p = applyLessonComplete(emptyProgress(), "creation", 1, 5, 5, 3);
    expect(progressSchema.safeParse(p).success).toBe(true);
    expect(progressSchema.safeParse({ ...p, stars: "lots" }).success).toBe(false);
    expect(progressSchema.safeParse({ ...p, history: Array(500).fill({ type: "x", id: "y", at: 1 }) }).success).toBe(false);
  });

  it("only allows nicknames, not markup", () => {
    expect(childCreateSchema.safeParse({ nickname: "Star Explorer" }).success).toBe(true);
    expect(childCreateSchema.safeParse({ nickname: "<script>" }).success).toBe(false);
    expect(childCreateSchema.safeParse({ nickname: "" }).success).toBe(false);
  });

  it("requires an adult and consent to sign up", () => {
    const base = { email: "a@b.test", password: "long-enough-pw" };
    expect(signupSchema.safeParse({ ...base, adult: true, consent: true }).success).toBe(true);
    expect(signupSchema.safeParse({ ...base, adult: true, consent: false }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: "short", adult: true, consent: true }).success).toBe(false);
  });
});
