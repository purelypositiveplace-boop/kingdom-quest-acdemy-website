/**
 * Seeds local development data. Run: npm run db:seed
 *  - an admin account, if ADMIN_EMAIL and ADMIN_PASSWORD are set
 *  - a demo parent (DEMO_PARENT_EMAIL / DEMO_PARENT_PASSWORD from .env.example; test values only)
 *    with one child who has finished the Creation lesson.
 * Curriculum content is not seeded: it lives in data/ and needs no database.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { emptyProgress } from "../lib/progress/types";

const prisma = new PrismaClient();

async function upsertUser(email: string, password: string, role: "PARENT" | "ADMIN") {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({ where: { email }, create: { email, passwordHash, role, consentAt: new Date() }, update: { passwordHash, role } });
}

async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    await upsertUser(ADMIN_EMAIL.toLowerCase(), ADMIN_PASSWORD, "ADMIN");
    console.log(`Admin ready: ${ADMIN_EMAIL}`);
  } else console.log("Skipping admin (set ADMIN_EMAIL and ADMIN_PASSWORD to create one).");

  const email = (process.env.DEMO_PARENT_EMAIL ?? "parent@kqa.test").toLowerCase();
  const password = process.env.DEMO_PARENT_PASSWORD ?? "kingdom-quest-demo-2026";
  const parent = await upsertUser(email, password, "PARENT");
  const existing = await prisma.childProfile.findFirst({ where: { parentId: parent.id, nickname: "Star Explorer" } });
  if (!existing) {
    const now = Date.now();
    const progress = {
      ...emptyProgress(),
      stars: 3,
      lessons: { creation: { version: 1, stars: 3, score: 5, total: 5, at: now } },
      badges: { "story-beginner": now, "creation-explorer": now },
      history: [{ type: "lesson", id: "creation", at: now }],
    };
    const child = await prisma.childProfile.create({ data: { parentId: parent.id, nickname: "Star Explorer", avatar: "leo", level: "explorers", progressJson: JSON.stringify(progress) } });
    await prisma.lessonCompletion.create({ data: { childId: child.id, lessonId: "creation", version: 1, score: 5, total: 5, stars: 3, completedAt: new Date(now) } });
  }
  console.log(`Demo parent ready: ${email} (password from DEMO_PARENT_PASSWORD in .env.example)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
