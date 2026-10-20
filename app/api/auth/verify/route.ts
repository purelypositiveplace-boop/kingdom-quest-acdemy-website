import { prisma } from "@/lib/db/prisma";
import { checkPassword, lockParentArea, markParentVerified } from "@/lib/auth/session";
import { fail, json, rateLimited, requireUser } from "@/lib/auth/guard";
import { z } from "zod";

/** Parent gate: re-enter the password to unlock parent-only settings for a short time. */
export async function POST(req: Request) {
  const s = await requireUser(req);
  if (s instanceof Response) return s;
  if (rateLimited(req, "verify", 6)) return fail(429, "Too many attempts. Please wait a minute.");
  const parsed = z.object({ password: z.string().min(1).max(200) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "Enter your password.");
  const user = await prisma.user.findUniqueOrThrow({ where: { id: s.user.id } });
  if (!(await checkPassword(parsed.data.password, user.passwordHash))) return fail(401, "That password isn't right.");
  await markParentVerified(s.id);
  return json({ ok: true });
}

/** Lock the parent area again (e.g. before handing the device to a child). */
export async function DELETE(req: Request) {
  const s = await requireUser(req);
  if (s instanceof Response) return s;
  await lockParentArea(s.id);
  return json({ ok: true });
}
