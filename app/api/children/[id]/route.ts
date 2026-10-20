import { prisma } from "@/lib/db/prisma";
import { fail, json, ownChild, requireUser } from "@/lib/auth/guard";
import { childUpdateSchema } from "@/lib/auth/schemas";
import { emptyProgress } from "@/lib/progress/types";

type Ctx = { params: Promise<{ id: string }> };

/** Update a child's nickname, level or settings (parent check required). */
export async function PATCH(req: Request, { params }: Ctx) {
  const s = await requireUser(req, { verified: true });
  if (s instanceof Response) return s;
  const { id } = await params;
  const child = await ownChild(s.user.id, id);
  if (!child) return fail(404, "Not found");
  const parsed = childUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid update");
  const { settings, ...rest } = parsed.data;
  const merged = settings ? JSON.stringify({ ...JSON.parse(child.settingsJson || "{}"), ...settings }) : undefined;
  await prisma.childProfile.update({ where: { id }, data: { ...rest, ...(merged ? { settingsJson: merged } : {}) } });
  return json({ ok: true });
}

/** Permanently delete a child profile and all of its progress (cascades). */
export async function DELETE(req: Request, { params }: Ctx) {
  const s = await requireUser(req, { verified: true });
  if (s instanceof Response) return s;
  const { id } = await params;
  if (!(await ownChild(s.user.id, id))) return fail(404, "Not found");
  await prisma.childProfile.delete({ where: { id } });
  return json({ ok: true });
}

/** Reset progress only (keeps the profile). */
export async function POST(req: Request, { params }: Ctx) {
  const s = await requireUser(req, { verified: true });
  if (s instanceof Response) return s;
  const { id } = await params;
  if (!(await ownChild(s.user.id, id))) return fail(404, "Not found");
  await prisma.$transaction([
    prisma.lessonCompletion.deleteMany({ where: { childId: id } }),
    prisma.gameResult.deleteMany({ where: { childId: id } }),
    prisma.childProfile.update({ where: { id }, data: { progressJson: JSON.stringify(emptyProgress()) } }),
  ]);
  return json({ ok: true });
}
