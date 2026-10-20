import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { LESSONS } from "@/lib/curriculum";
import { validateCurriculum } from "@/lib/curriculum/validate";
import { PLANNED_LESSONS } from "@/data/curriculum-plan";
import { ParentGate } from "@/components/parents/ParentGate";
import { ReviewPanel, type ReviewRow } from "@/components/parents/ReviewPanel";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Admin-only content area. Access is checked on the server; non-admins get a plain 404. */
export default async function AdminPage() {
  const s = await getSession();
  if (!s || s.user.role !== "ADMIN") notFound();
  if (!s.parentVerified) return <ParentGate email={s.user.email} />;

  const issues = validateCurriculum();
  const reviews = await prisma.contentReview.findMany({ where: { contentType: "lesson" }, orderBy: { createdAt: "desc" }, include: { reviewer: { select: { email: true } } } });
  const rows: ReviewRow[] = LESSONS.map((l) => {
    const history = reviews.filter((r) => r.contentId === l.id);
    const latest = history.find((r) => r.version === l.version);
    return {
      id: l.id,
      title: l.title,
      version: l.version,
      refs: l.refs.join("; "),
      status: latest?.status ?? l.review,
      errors: issues.filter((i) => i.lessonId === l.id && i.level === "error").map((i) => i.message),
      warnings: issues.filter((i) => i.lessonId === l.id && i.level === "warning").map((i) => i.message),
      history: history.slice(0, 5).map((r) => ({ status: r.status, notes: r.notes, by: r.reviewer.email, at: r.createdAt.toISOString(), version: r.version })),
    };
  });
  const counts = await prisma.$transaction([prisma.user.count(), prisma.childProfile.count(), prisma.lessonCompletion.count()]);
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <header className="card p-6">
        <h1 className="text-3xl font-bold text-royal-dark">Content administration</h1>
        <p className="text-ink-soft">
          {LESSONS.length} lessons live · {PLANNED_LESSONS.length} planned · {rows.filter((r) => r.status === "approved").length} approved by a reviewer · {counts[0]} accounts · {counts[1]} child profiles · {counts[2]} lesson completions (totals only, no child details)
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Lessons are edited as typed files in <code>data/lessons/</code> and reviewed in git. Here you record theological review decisions. A lesson with validation errors can&apos;t be approved. Bumping a lesson&apos;s <code>version</code> sends it back for review.
        </p>
      </header>
      <ReviewPanel rows={rows} />
      <section className="card p-6">
        <h2 className="text-2xl font-bold text-royal-dark">Curriculum pipeline (planned lessons)</h2>
        <ul className="mt-3 grid gap-1 text-sm md:grid-cols-2">
          {PLANNED_LESSONS.map((p) => (
            <li key={p.id}>
              {p.title} <span className="text-ink-soft">({p.refs})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
