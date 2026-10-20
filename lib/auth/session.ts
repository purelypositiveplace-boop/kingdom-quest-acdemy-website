import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export const SESSION_COOKIE = "kqa_session";
const SESSION_DAYS = 30;
/** How long a password check unlocks parent-only areas. */
export const PARENT_VERIFY_MINUTES = 30;

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}

export async function checkPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

/** Creates a session, stores only the token's hash, and sets an httpOnly cookie. */
export async function createSession(userId: string, verified = true) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await prisma.session.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt,
      parentVerifiedUntil: verified ? new Date(Date.now() + PARENT_VERIFY_MINUTES * 60000) : null,
    },
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export interface CurrentSession {
  id: string;
  user: { id: string; email: string; role: string };
  parentVerified: boolean;
}

export async function getSession(): Promise<CurrentSession | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = await prisma.session.findUnique({ where: { tokenHash: sha256(token) }, include: { user: { select: { id: true, email: true, role: true } } } });
  if (!s || s.expiresAt < new Date()) return null;
  return { id: s.id, user: s.user, parentVerified: Boolean(s.parentVerifiedUntil && s.parentVerifiedUntil > new Date()) };
}

export async function markParentVerified(sessionId: string) {
  await prisma.session.update({ where: { id: sessionId }, data: { parentVerifiedUntil: new Date(Date.now() + PARENT_VERIFY_MINUTES * 60000) } });
}

export async function lockParentArea(sessionId: string) {
  await prisma.session.update({ where: { id: sessionId }, data: { parentVerifiedUntil: null } });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  jar.delete(SESSION_COOKIE);
}
