import { prisma } from "@/lib/db/prisma";
import { checkPassword, createSession } from "@/lib/auth/session";
import { fail, json, rateLimited, sameOrigin } from "@/lib/auth/guard";
import { credentialsSchema } from "@/lib/auth/schemas";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "Bad origin");
  if (rateLimited(req, "login", 8)) return fail(429, "Too many attempts. Please wait a minute.");
  const parsed = credentialsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "Check your email and password.");
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user ? await checkPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) return fail(401, "That email and password don't match.");
  await createSession(user.id, true);
  return json({ ok: true, role: user.role });
}
