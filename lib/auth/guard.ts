import "server-only";
import { NextResponse } from "next/server";
import { getSession, type CurrentSession } from "./session";
import { prisma } from "@/lib/db/prisma";

/** Rejects cross-site form/fetch posts (CSRF defence in addition to SameSite=Lax cookies). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin) return req.method === "GET";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const buckets = new Map<string, { n: number; reset: number }>();
/**
 * Simple fixed-window rate limit for sensitive endpoints. In-memory, so it is per server
 * instance; use a shared store (e.g. Redis/Upstash) when running several instances.
 */
export function rateLimited(req: Request, name: string, max = 10, windowMs = 60_000): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const key = `${name}:${ip}`;
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  b.n += 1;
  return b.n > max;
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

type Need = { verified?: boolean; admin?: boolean };

/** Standard checks for every mutating API route: origin, signed-in, optional parent check/admin. */
export async function requireUser(req: Request, need: Need = {}): Promise<CurrentSession | NextResponse> {
  if (req.method !== "GET" && !sameOrigin(req)) return fail(403, "Bad origin");
  const s = await getSession();
  if (!s) return fail(401, "Please sign in");
  if (need.admin && s.user.role !== "ADMIN") return fail(403, "Not allowed");
  if (need.verified && !s.parentVerified) return fail(403, "Parent check needed");
  return s;
}

/** Ownership check: a parent can only touch their own children (prevents insecure direct object access). */
export async function ownChild(userId: string, childId: string) {
  return prisma.childProfile.findFirst({ where: { id: childId, parentId: userId } });
}
