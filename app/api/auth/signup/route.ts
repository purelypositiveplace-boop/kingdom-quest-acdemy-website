import { prisma } from "@/lib/db/prisma";
import { createSession, hashPassword } from "@/lib/auth/session";
import { fail, json, rateLimited, sameOrigin } from "@/lib/auth/guard";
import { signupSchema } from "@/lib/auth/schemas";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "Bad origin");
  if (rateLimited(req, "signup", 5)) return fail(429, "Too many attempts. Please wait a minute.");
  const parsed = signupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid details");
  const { email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  // Same message either way so the form can't be used to discover who has an account.
  if (exists) return fail(400, "We couldn't create that account. Try signing in instead.");
  const user = await prisma.user.create({ data: { email, passwordHash: await hashPassword(password), consentAt: new Date() } });
  await createSession(user.id, true);
  return json({ ok: true });
}
