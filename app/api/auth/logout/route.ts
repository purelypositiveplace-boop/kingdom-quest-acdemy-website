import { destroySession } from "@/lib/auth/session";
import { fail, json, sameOrigin } from "@/lib/auth/guard";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "Bad origin");
  await destroySession();
  return json({ ok: true });
}
