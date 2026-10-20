# Kingdom Quest Academy — Implementation Plan

**BIG FAITH. BIG ADVENTURES. ENDLESS DISCOVERIES.** 100% free Christian Bible learning for children ages 3–12.
Levels: Little Disciples (3–5), Kingdom Explorers (6–8), Faith Champions (9–12). Main mascot: Leo the Lion. Main map: Kingdom Quest World.
Separate brand from Purely Positive Kids — no shared characters, slogans or logos.
**Free forever:** no lesson, game, verse, progress feature or activity is ever behind a paywall.
Optional revenue (adult donations, merchandise, church/homeschool packs) lives only behind the
parent area and is never shown to, or pushed at, children.

## Architecture

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript | Server components for content pages, client components for play |
| Styling | Tailwind CSS v4 + CSS design tokens (`app/globals.css`) | One token set drives light, high-contrast and easy-read modes |
| Animation | Framer Motion + CSS keyframes, all gated by reduced-motion | |
| Client state | Zustand (persisted to `localStorage`) | Guest mode works with zero personal data on the server |
| Database | Prisma ORM — SQLite in development, Postgres for production (one-line provider change) | No paid database needed to develop |
| Auth | Own email + password auth: bcrypt hashes, random session tokens stored hashed in the DB, httpOnly SameSite=Lax cookies | Small, auditable, no third-party scripts. Auth.js can replace it later behind `lib/auth` |
| Validation | Zod on every API route | |
| Tests | Vitest (content + logic), Playwright (journeys) | |

### Content lives in code, progress lives in the database

Curriculum (lessons, storybooks, verses, characters, games, worlds, map, timeline) is typed
TypeScript data in `data/`. It is reviewed in git like code, has stable IDs and a
`contentVersion`, and adding a lesson never requires UI changes. The database stores only what
belongs to a family: parent accounts, child profiles, progress, rewards, favourites and the
theology review log. Progress rows reference content by stable ID plus version, so curriculum
edits never corrupt saved progress.

### Bible text

* Translation: **World English Bible (WEB)**, public domain, from the `world-english-bible` npm
  package. `scripts/build-bible.ts` converts it to `public/bible/web/<book>.json` (reader) and
  `data/verses/verse-text.generated.json` (memory verses).
* Memory verses store **references only**. Their text is looked up from WEB at build time, so the
  site can never show an invented quotation. Unit tests fail if a reference does not resolve.
* Scripture is always shown in a `ScriptureText` block with translation + reference. Paraphrase,
  explanation and interpretation use different, labelled components.
* `Translation` is a field everywhere, so a licensed translation can be added later.

### Voices and art

* No browser text-to-speech (it sounds robotic). Narration plays recorded mp3 files from
  `public/audio/narration/`. `scripts/record-narration.ts` records every line with ElevenLabs
  (needs `ELEVENLABS_API_KEY`). `data/audio-manifest.generated.json` lists which files exist, so
  the UI only shows a play button when real audio is present. Otherwise it shows the text.
* Every illustration has a slot (`image` in the data) plus a drawn SVG fallback, so nothing ever
  shows a broken image. Illustrations are generated in ChatGPT into `public/art/` (paths in `data/art-manifest.ts`); `lib/art.ts` only uses files that exist.

## Phases

1. **Foundation** — tokens, fonts, layout, navigation, homepage, age selector, UI kit.
2. **Curriculum engine** — lesson schema, 30 lessons, story library + search, lesson page, quiz, progress.
3. **Child experience** — onboarding, dashboard, mascots, Adventure World map, worlds, achievements.
4. **Game center** — shared `GameShell`, 16 games, rewards hooked into progress.
5. **Bible study** — reader (66 books), memory verse center, characters, map, timeline, prayer garden, Living with Love, Learn About Jesus.
6. **Parents + data** — accounts, child profiles, server progress sync, parent dashboard, export, delete.
7. **Expansion** — printables engine, music, admin review area, more lessons (path to 150+ in `data/curriculum-plan.ts`).
8. **Polish + launch prep** — a11y, responsive, security, legal/compliance review checklist (`LAUNCH_CHECKLIST.md`).

## Key defaults (decisions made without asking)

* Standalone app (folder `biblebright-kids/`, package `kingdom-quest-academy`), separate from purelypositivekids.com.
* Protestant 66-book canon (configurable in `data/bible/books.ts`).
* Guest mode is the default: progress stays in the browser and nothing about the child is sent anywhere.
* Parent-only settings need a signed-in parent (server-enforced). Guest-mode settings sit behind an adult check, which is a soft gate and is documented as such.
* Mascots are fictional guides and are labelled as such wherever they appear.
