import "server-only";
import { prisma } from "@/lib/db/prisma";
import { LESSON_BY_ID } from "@/lib/curriculum";
import { emptyProgress, type ProgressSnapshot } from "./types";

export function parseProgress(json: string): ProgressSnapshot {
  try {
    return { ...emptyProgress(), ...(JSON.parse(json) as Partial<ProgressSnapshot>) };
  } catch {
    return emptyProgress();
  }
}

/**
 * Saves a child's snapshot and mirrors lesson/game results into relational rows so the parent
 * dashboard can query them. Unknown lesson ids (e.g. removed content) are ignored, not stored.
 */
export async function saveProgress(childId: string, p: ProgressSnapshot) {
  const lessons = Object.entries(p.lessons).filter(([id]) => LESSON_BY_ID[id]);
  await prisma.$transaction([
    prisma.childProfile.update({ where: { id: childId }, data: { progressJson: JSON.stringify(p) } }),
    ...lessons.map(([lessonId, r]) =>
      prisma.lessonCompletion.upsert({
        where: { childId_lessonId: { childId, lessonId } },
        create: { childId, lessonId, version: r.version, score: r.score, total: r.total, stars: r.stars, completedAt: new Date(r.at) },
        update: { version: r.version, score: r.score, total: r.total, stars: r.stars, completedAt: new Date(r.at) },
      }),
    ),
    ...Object.entries(p.games).map(([gameId, g]) =>
      prisma.gameResult.upsert({
        where: { childId_gameId: { childId, gameId } },
        create: { childId, gameId, plays: g.plays, wins: g.wins, best: Math.round(g.best) },
        update: { plays: g.plays, wins: g.wins, best: Math.round(g.best) },
      }),
    ),
  ]);
}
