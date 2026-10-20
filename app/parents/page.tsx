import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { parseProgress } from "@/lib/progress/server";
import { LESSON_BY_ID } from "@/lib/curriculum";
import { ACHIEVEMENT_BY_ID } from "@/data/achievements";
import { GAME_BY_ID } from "@/data/games";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { DONATION_URL } from "@/lib/site";
import { ParentGate } from "@/components/parents/ParentGate";
import { GuestParentArea } from "@/components/parents/GuestParentArea";
import { ParentDashboard, type ChildSummary } from "@/components/parents/ParentDashboard";

export const metadata: Metadata = { title: "Parent Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Parent area. Authorization is decided here on the server: no session → guest options;
 * session without a recent password check → parent gate; otherwise the dashboard.
 */
export default async function ParentsPage() {
  const session = await getSession();
  if (!session) return <GuestParentArea />;
  if (!session.parentVerified) return <ParentGate email={session.user.email} />;

  const children = await prisma.childProfile.findMany({ where: { parentId: session.user.id }, include: { completions: { orderBy: { completedAt: "desc" } } }, orderBy: { createdAt: "asc" } });
  const summaries: ChildSummary[] = children.map((c) => {
    const p = parseProgress(c.progressJson);
    const topics = new Set<string>();
    for (const comp of c.completions) LESSON_BY_ID[comp.lessonId]?.topics.forEach((t) => topics.add(t));
    const titleFor = (type: string, id: string) =>
      type === "lesson" ? LESSON_BY_ID[id]?.title : type === "game" ? GAME_BY_ID[id]?.title : type === "verse" ? id : type === "value" ? id.replace(/-/g, " ") : id;
    return {
      id: c.id,
      nickname: c.nickname,
      avatar: c.avatar,
      level: c.level as ChildSummary["level"],
      settings: JSON.parse(c.settingsJson || "{}"),
      stars: p.stars,
      lessons: c.completions.map((x) => ({ id: x.lessonId, title: LESSON_BY_ID[x.lessonId]?.title ?? x.lessonId, score: x.score, total: x.total, at: x.completedAt.toISOString(), outdated: (LESSON_BY_ID[x.lessonId]?.version ?? x.version) !== x.version })),
      topics: [...topics],
      verses: MEMORY_VERSES.filter((v) => p.verses[v.ref]).map((v) => ({ ref: v.ref, box: p.verses[v.ref].box })),
      badges: Object.keys(p.badges).map((id) => ACHIEVEMENT_BY_ID[id]?.title ?? id),
      games: Object.entries(p.games).map(([id, g]) => ({ title: GAME_BY_ID[id]?.title ?? id, plays: g.plays, wins: g.wins })),
      history: [...p.history].reverse().slice(0, 12).map((h) => ({ type: h.type, title: titleFor(h.type, h.id) ?? h.id, at: new Date(h.at).toISOString() })),
      favorites: p.favorites.length,
    };
  });
  return <ParentDashboard email={session.user.email} isAdmin={session.user.role === "ADMIN"} childrenSummaries={summaries} donationUrl={DONATION_URL} />;
}
