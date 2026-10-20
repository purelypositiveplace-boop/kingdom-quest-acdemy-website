import { prisma } from "@/lib/db/prisma";
import { fail, json, requireUser } from "@/lib/auth/guard";
import { childCreateSchema } from "@/lib/auth/schemas";

const MAX_CHILDREN = 12;

export async function GET(req: Request) {
  const s = await requireUser(req);
  if (s instanceof Response) return s;
  const children = await prisma.childProfile.findMany({ where: { parentId: s.user.id }, select: { id: true, nickname: true, avatar: true, level: true }, orderBy: { createdAt: "asc" } });
  return json({ children });
}

export async function POST(req: Request) {
  const s = await requireUser(req, { verified: true });
  if (s instanceof Response) return s;
  const parsed = childCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid profile");
  const count = await prisma.childProfile.count({ where: { parentId: s.user.id } });
  if (count >= MAX_CHILDREN) return fail(400, "You've reached the profile limit.");
  const child = await prisma.childProfile.create({ data: { ...parsed.data, parentId: s.user.id }, select: { id: true } });
  return json({ id: child.id }, 201);
}
