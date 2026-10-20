import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guard";
import { parseProgress } from "@/lib/progress/server";

/** Downloads everything we store about this family as JSON (parent check required). */
export async function GET(req: Request) {
  const s = await requireUser(req, { verified: true });
  if (s instanceof Response) return s;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: s.user.id },
    select: { email: true, createdAt: true, consentAt: true, children: { include: { completions: true, games: true } } },
  });
  const data = {
    exportedAt: new Date().toISOString(),
    account: { email: user.email, createdAt: user.createdAt, consentAt: user.consentAt },
    children: user.children.map((c) => ({
      nickname: c.nickname,
      avatar: c.avatar,
      level: c.level,
      world: c.world,
      settings: JSON.parse(c.settingsJson || "{}"),
      progress: parseProgress(c.progressJson),
      lessonCompletions: c.completions.map(({ lessonId, version, score, total, stars, completedAt }) => ({ lessonId, version, score, total, stars, completedAt })),
      games: c.games.map(({ gameId, plays, wins, best }) => ({ gameId, plays, wins, best })),
      createdAt: c.createdAt,
    })),
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "content-type": "application/json", "content-disposition": 'attachment; filename="kingdom-quest-academy-data.json"', "cache-control": "no-store" },
  });
}
