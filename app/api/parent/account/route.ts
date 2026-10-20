import { prisma } from "@/lib/db/prisma";
import { json, requireUser } from "@/lib/auth/guard";
import { destroySession } from "@/lib/auth/session";

/** Permanently deletes the parent account, all child profiles and all progress. */
export async function DELETE(req: Request) {
  const s = await requireUser(req, { verified: true });
  if (s instanceof Response) return s;
  await destroySession();
  await prisma.user.delete({ where: { id: s.user.id } });
  return json({ ok: true });
}
