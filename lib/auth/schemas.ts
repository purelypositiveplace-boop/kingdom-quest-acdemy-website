import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(10, "Use at least 10 characters").max(200),
});

export const signupSchema = credentialsSchema.extend({
  adult: z.literal(true, { errorMap: () => ({ message: "An adult must create the account" }) }),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the parental notice" }) }),
});

export const levelSchema = z.enum(["disciples", "explorers", "champions"]);

export const childSettingsSchema = z
  .object({
    textSize: z.enum(["normal", "large", "xl"]).optional(),
    easyFont: z.boolean().optional(),
    highContrast: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
    sound: z.boolean().optional(),
    music: z.boolean().optional(),
    gamification: z.boolean().optional(),
    minimalReading: z.boolean().optional(),
    timers: z.boolean().optional(),
    breakMinutes: z.number().int().min(0).max(120).optional(),
    recommended: z.array(z.string().max(60)).max(10).optional(),
  })
  .strict();

export const childCreateSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .regex(/^[\p{L}\p{N} '._-]+$/u, "Letters, numbers and spaces only"),
  avatar: z.enum(["leo", "sunny", "oliver", "grace", "finn"]).default("leo"),
  level: levelSchema.default("explorers"),
});

export const childUpdateSchema = childCreateSchema.partial().extend({ settings: childSettingsSchema.optional(), world: z.string().max(40).optional() });

const rec = <T extends z.ZodTypeAny>(v: T) => z.record(z.string().max(80), v);
/** Shape-checks a progress upload so a client can't store arbitrary data. */
export const progressSchema = z.object({
  stars: z.number().int().min(0).max(100000),
  lessons: rec(z.object({ version: z.number().int(), stars: z.number().int(), score: z.number().int(), total: z.number().int(), at: z.number() })),
  scenes: rec(z.number().int().min(0).max(100)),
  games: rec(z.object({ plays: z.number().int(), wins: z.number().int(), best: z.number(), modes: z.array(z.string().max(20)).max(10), last: z.number() })),
  verses: rec(z.object({ box: z.number().int().min(0).max(5), due: z.number(), reviews: z.number().int() })),
  values: rec(z.number()),
  prayers: z.array(z.string().max(40)).max(50),
  badges: rec(z.number()),
  favorites: z.array(z.string().max(120)).max(500),
  bookmarks: z.array(z.string().max(120)).max(500),
  history: z.array(z.object({ type: z.string().max(20), id: z.string().max(120), at: z.number() })).max(200),
});

export const reviewSchema = z.object({
  contentType: z.enum(["lesson", "character", "value", "verse"]),
  contentId: z.string().max(80),
  status: z.enum(["approved", "needs-changes", "needs-review"]),
  notes: z.string().max(2000).default(""),
});
