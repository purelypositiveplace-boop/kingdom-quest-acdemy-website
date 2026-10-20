import { prisma } from "@/lib/db/prisma";
import { fail, json, requireUser } from "@/lib/auth/guard";
import { reviewSchema } from "@/lib/auth/schemas";
import { LESSON_BY_ID } from "@/lib/curriculum";

/** Records a theology/content review decision. Admin-only, enforced on the server. */
export async function POST(req: Request) {
  const s = await requireUser(req, { verified: true, admin: true });
  if (s instanceof Response) return s;
  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "Invalid review");
  const { contentType, contentId, status, notes } = parsed.data;
  const version = contentType === "lesson" ? LESSON_BY_ID[contentId]?.version : 1;
  if (contentType === "lesson" && !version) return fail(404, "Unknown lesson");
  await prisma.contentReview.create({ data: { contentType, contentId, status, notes, version: version ?? 1, reviewerId: s.user.id } });
  return json({ ok: true });
}
