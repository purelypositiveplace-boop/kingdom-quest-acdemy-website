import { prisma } from "@/lib/db/prisma";
import { fail, json, ownChild, requireUser } from "@/lib/auth/guard";
import { progressSchema } from "@/lib/auth/schemas";
import { parseProgress, saveProgress } from "@/lib/progress/server";
import { z } from "zod";

const MAX_BYTES = 200_000;

/** Loads a child's profile, settings and progress onto this device ("Start learning as..."). */
export async function GET(req: Request) {
  const s = await requireUser(req);
  if (s instanceof Response) return s;
  const childId = new URL(req.url).searchParams.get("childId") ?? "";
  const child = await ownChild(s.user.id, childId);
  if (!child) return fail(404, "Not found");
  return json({
    child: { id: child.id, nickname: child.nickname, avatar: child.avatar, level: child.level, world: child.world },
    settings: JSON.parse(child.settingsJson || "{}"),
    progress: parseProgress(child.progressJson),
  });
}

/** Saves progress for a child the signed-in parent owns. */
export async function POST(req: Request) {
  const s = await requireUser(req);
  if (s instanceof Response) return s;
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return fail(413, "Too large");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "Invalid JSON");
  }
  const parsed = z.object({ childId: z.string().max(40), progress: progressSchema }).safeParse(body);
  if (!parsed.success) return fail(400, "Invalid progress");
  const child = await ownChild(s.user.id, parsed.data.childId);
  if (!child) return fail(404, "Not found");
  await saveProgress(child.id, parsed.data.progress);
  await prisma.childProfile.update({ where: { id: child.id }, data: { updatedAt: new Date() } });
  return json({ ok: true });
}
