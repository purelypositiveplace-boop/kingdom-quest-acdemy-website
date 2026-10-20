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
| Read Me the Bible | `/bible/listen`: every chapter opens as an open book (two pages on wide screens, one on phones) with page turning by button, swipe or arrow keys, a drop cap and adjustable text size. "Read to me" plays a recorded voice, highlights the verse being read, turns pages by itself, has speed control and can carry on to the next chapter. **It appears only once chapter recordings exist** (`npm run record:bible`, ElevenLabs credits from Nov 17). |
| Music | 8 original songs with line-by-line sing-along (built-in synth until recordings exist) |
| Printables | 14 templates (Letter/A4), including the 5 required, answer keys and a certificate |
| Rewards | 18 achievements; no streak penalties; can be turned off by parents |
| Parents | Accounts, password gate, child profiles, settings (sound, music, gamification, motion, timers, fonts, break reminder, recommended lesson), learning history, topics, verses, games, reset, delete, export, delete account, optional donation link (parent-only) |
| Admin | Server-enforced admin page: curriculum validation, theology review (approve/needs changes, notes, history), pipeline |
| Privacy/safety | Guest mode sends no child data; no chat, ads, trackers or public profiles; About/Privacy/Terms/Safety/Contact pages; noindex on child and parent areas |
| SEO | Per-page metadata, Open Graph, canonical URLs, sitemap, robots |
| Tests | 26 unit tests; 19 Playwright tests (desktop, tablet, phone), all passing |

## In progress

* **Artwork**: complete set generated in ChatGPT (brand, hero, map, lands, games, 22 portraits, 5 mascots, 30 lesson covers, scene art for the 3 featured storybooks, page banners). The other 27 lessons use their cover plus drawn SVG scenes.

## Not started / needs a decision

* **Bible read-aloud recordings**: `npm run record:bible` (dry run: the 46 starter chapters are about 176k characters; the whole Bible is about 4M characters). The voice highlighting and auto page-turn can only be tested once real recordings exist.
* **Narration recordings**: the script is ready (`npm run record:narration`). It needs ElevenLabs credits and approval before running.
* **Song recordings**: songs play on the built-in synth for now.
* **Theological review**: every lesson is marked "awaiting review" until a qualified reviewer approves it in `/admin`.
* **Legal/compliance review** (COPPA, GDPR-K) before public launch. See `LAUNCH_CHECKLIST.md`.
* **Admin lesson editing in the browser**: lessons are edited as files for now (reviewable in git).
* **Deployment**: not deployed.
