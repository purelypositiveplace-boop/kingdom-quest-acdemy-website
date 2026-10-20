# Kingdom Quest Academy

**BIG FAITH. BIG ADVENTURES. ENDLESS DISCOVERIES.**
100% free Christian Bible learning for children ages 3–12: interactive storybooks, 30 Bible lessons,
16 learning games, memory verses, a Prayer Garden, a full Bible reader, printables and a parent dashboard.

Separate brand from Purely Positive Kids. Free forever: no subscriptions, locked content, ads or trackers.

## Quick start

```bash
npm install
cp .env.example .env          # then edit values; DATABASE_URL defaults to a local SQLite file
npx prisma migrate dev        # creates prisma/dev.db
npm run db:seed               # optional: demo parent + admin (see .env.example)
npm run dev                   # http://localhost:3000
```

`npm run dev` and `npm run build` first run three generators:

| Script | Output |
| --- | --- |
| `scripts/build-bible.ts` | `public/bible/web/*.json` (all 66 books, World English Bible) and `data/verses/verse-text.generated.json` (exact text for every quoted reference; **fails the build if a reference doesn't resolve**) |
| `scripts/build-audio-manifest.ts` | `data/audio-manifest.generated.json`: the recorded narration that exists |
| `scripts/build-art-manifest.ts` | `data/art-files.generated.json`: the illustrations that exist under `public/art` |

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests: curriculum validation, Scripture integrity, puzzle generators, progress logic, server validation |
| `npm run test:e2e` | Playwright journeys on desktop, tablet and phone (sample child journey, parent dashboard, security boundaries, games, responsive checks) |
| `npm run db:migrate` / `npm run db:seed` | Prisma migrations / seed |
| `npm run record:bible` | Lists Bible chapters still to record for "Read Me the Bible" (dry run; `-- --only=jonah`, `-- --all`). Add `-- --yes` to record with verse timing. **This spends credits.** |
| `npm run record:narration` | Lists narration still to record (dry run). Add `-- --yes` to record with ElevenLabs. **This spends credits.** |

To build while a dev server is running, use a separate output folder:
`NEXT_DIST_DIR=.next-build npm run build`, then `node scripts/serve-build.mjs 3200`. Playwright uses this server.

## Architecture

* **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4.** Design tokens are in `app/globals.css`. Accessibility modes (text size, easy-read font, high contrast, calm motion, fewer words) are applied as `data-*` attributes on `<html>`.
* **Curriculum as typed data** in `data/` (lessons, verses, characters, worlds, games, values, trivia, map, timeline, prayers, songs, printables). Add a lesson by adding an object to `data/lessons/*.ts`; no UI changes needed. `lib/curriculum/validate.ts` blocks incomplete lessons (unit tests and the admin page use it).
* **Progress** lives in a persisted Zustand store (`lib/progress/store.ts`). Guests: browser only, nothing sent to the server. Signed-in families: the snapshot syncs to `/api/progress` (debounced, flushed when the page is hidden, retried on next load).
* **Database** (Prisma, `prisma/schema.prisma`): users, sessions, child profiles, lesson completions, game results, the content review log and settings. Every child row cascades from its parent. SQLite for development; change the provider to `postgresql` for production.
* **Auth**: email + bcrypt password; random session tokens stored only as SHA-256 hashes; httpOnly SameSite=Lax cookies; Origin check on every mutation; rate limits on login, signup and parent verify; Zod validation on every route; ownership checks on every child query. Parent-only areas need a recent password re-check (`/api/auth/verify`), so a child can't wander in. Admin is enforced server-side (`role = ADMIN`).
* **Scripture**: World English Bible (public domain). Quoted text is never typed by hand. It's looked up from WEB at build time and always shown in `<ScriptureText>` with reference and translation. Retellings, explanations, background and interpretation carry separate labels (`<ContentLabel>`).
* **Voices**: no browser text-to-speech. Play buttons appear only where a recorded mp3 exists (`public/audio/narration/<lesson>/<scene>.mp3`).
* **Art**: `lib/art.ts` returns an illustration path only if the file exists. Otherwise components draw their SVG fallback (`SceneArt`, `Mascot`, `PersonPortrait`, game icons), so nothing ever shows a broken image. Paths are documented in `data/art-manifest.ts`.

## Accounts for local testing

`npm run db:seed` creates the demo parent from `DEMO_PARENT_EMAIL` / `DEMO_PARENT_PASSWORD` (test values in `.env.example`). It also creates an admin if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set. Never use real passwords in `.env.example`.

## Deployment

1. Create a Postgres database (Neon, Supabase, Vercel Postgres…).
2. In `prisma/schema.prisma` set `provider = "postgresql"`, then run `npx prisma migrate dev --name postgres` to create a Postgres migration (the SQLite migration can't be reused).
3. Set the env vars from `.env.example` on the host (`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, optional `DONATION_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`).
4. Build command: `prisma migrate deploy && npm run build`.
5. Rate limiting is in-memory per instance. With several instances, back it with a shared store.

Complete `LAUNCH_CHECKLIST.md` before going public, including the legal and theology reviews.

See `PROGRESS.md` for what's done and `ROADMAP.md` for what's next.
