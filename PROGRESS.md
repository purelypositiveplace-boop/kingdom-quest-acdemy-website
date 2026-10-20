# Progress

_Last updated 2026-10-20._

## Done and tested

| Area | Status |
| --- | --- |
| Brand | Kingdom Quest Academy, slogan, logo (generated art + SVG fallback), royal-blue/gold palette, Leo as main guide |
| Levels | Little Disciples (3–5), Kingdom Explorers (6–8), Faith Champions (9–12); quizzes, text and times adapt per level |
| Homepage | Hero, level picker, featured story, daily verse, featured game, features, topics, guides, parent section |
| Onboarding | Kid flow (nickname, buddy, level, comfort settings, navigation tour, first world) and parent flow (guest or account, privacy) |
| Child dashboard | Greeting, stats, continue/suggested lesson, journey progress, daily challenge, worlds, completed stories, badges, parent-recommended lesson |
| Curriculum | 30 lessons in the full standard format (3 featured storybooks with 9 scenes each); 32 more planned in `data/curriculum-plan.ts` |
| Storybook player | Scenes, tap-to-discover facts, in-story questions, auto-turn, recorded narration when present, text size, full screen, resume, level text |
| Story library | Picture categories, search, testament/age/time filters, empty states |
| Games | 16 working games with a shared shell (instructions, start, pause, restart, completion, feedback, rewards, error boundary) |
| Kingdom Quest World | Illustrated map, 10 lands with lessons, games, facts, badge, progress and completion celebration |
| Bible study | Bible reader (66 books, verse anchors, search, bookmarks, favourites, pronunciation, kid notes), whole-Bible search, 40 memory verses with 4 practice modes and spaced review, 22 character profiles with quizzes, map (16 places), timeline (23 events), Prayer Garden (11 topics), Learn About Jesus (15 topics), Living with Love (12 values) |
| Music | 8 original songs with line-by-line sing-along (built-in synth until recordings exist) |
| Printables | 14 templates (Letter/A4), including the 5 required, answer keys and a certificate |
| Rewards | 18 achievements; no streak penalties; can be turned off by parents |
| Parents | Accounts, password gate, child profiles, settings (sound, music, gamification, motion, timers, fonts, break reminder, recommended lesson), learning history, topics, verses, games, reset, delete, export, delete account, optional donation link (parent-only) |
| Admin | Server-enforced admin page: curriculum validation, theology review (approve/needs changes, notes, history), pipeline |
| Privacy/safety | Guest mode sends no child data; no chat, ads, trackers or public profiles; About/Privacy/Terms/Safety/Contact pages; noindex on child and parent areas |
| SEO | Per-page metadata, Open Graph, canonical URLs, sitemap, robots |
| Tests | 24 unit tests; 18 Playwright tests (desktop, tablet, phone), all passing |

## In progress

* **Artwork** (being generated in ChatGPT by a separate session): brand, map, land icons, game icons and 6 portraits are in. Mascots, remaining portraits, lesson covers and story scenes are still to come. They appear automatically when added to `public/art`.

## Not started / needs a decision

* **Narration recordings**: the script is ready (`npm run record:narration`). It needs ElevenLabs credits and approval before running.
* **Song recordings**: songs play on the built-in synth for now.
* **Theological review**: every lesson is marked "awaiting review" until a qualified reviewer approves it in `/admin`.
* **Legal/compliance review** (COPPA, GDPR-K) before public launch. See `LAUNCH_CHECKLIST.md`.
* **Admin lesson editing in the browser**: lessons are edited as files for now (reviewable in git).
* **Deployment**: not deployed.
