/**
 * Records Bible chapters for "Read me the Bible" with a natural ElevenLabs voice (never browser TTS).
 * Uses the with-timestamps endpoint so each verse's start time is saved, which lets the book
 * highlight the verse being read and turn its own pages.
 *
 *   npm run record:bible                         dry run of the starter set: chapters + character count
 *   npm run record:bible -- --only=jonah,ruth    dry run for whole books
 *   npm run record:bible -- --only=genesis:1-3   dry run for a chapter range
 *   npm run record:bible -- --all                dry run for the whole Bible (very large!)
 *   ...add --yes to actually record (spends ElevenLabs credits)
 *
 * Env: ELEVENLABS_API_KEY, ELEVENLABS_BIBLE_VOICE_ID (falls back to ELEVENLABS_VOICE_ID), optional ELEVENLABS_MODEL.
 * Output: public/audio/bible/<book>/<chapter>.mp3 + <chapter>.json ({ verses: [{ v, start }], duration }).
 * Text: World English Bible (public domain), read exactly as printed.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { BOOKS, BOOK_BY_ID } from "../data/bible/books";

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "audio", "bible");
const args = process.argv.slice(2);
const go = args.includes("--yes");
const all = args.includes("--all");
const only = args.find((a) => a.startsWith("--only="))?.slice(7);

/** Favourite chapters for children: recorded first. */
export const STARTER: Record<string, number[]> = {
  genesis: [1, 2, 3, 6, 7, 8, 9, 37],
  exodus: [2, 3, 14, 20],
  joshua: [6],
  ruth: [1, 2, 3, 4],
  "1-samuel": [3, 17],
  psalms: [23, 100, 121, 139],
  daniel: [3, 6],
  jonah: [1, 2, 3, 4],
  matthew: [2, 5, 6],
  mark: [4, 10],
  luke: [1, 2, 10, 15, 19, 24],
  john: [3, 6, 11, 20],
  acts: [2, 9],
};

function chapterCount(book: string) {
  return (JSON.parse(fs.readFileSync(path.join(root, "public", "bible", "web", `${book}.json`), "utf8")) as { chapters: string[][] }).chapters.length;
}

function plan(): { book: string; chapter: number }[] {
  const out: { book: string; chapter: number }[] = [];
  if (all) {
    for (const b of BOOKS) for (let c = 1; c <= chapterCount(b.id); c++) out.push({ book: b.id, chapter: c });
    return out;
  }
  if (only) {
    for (const part of only.split(",")) {
      const [book, range] = part.split(":");
      if (!BOOK_BY_ID[book]) throw new Error(`Unknown book "${book}". Use ids like genesis, 1-samuel, psalms.`);
      const max = chapterCount(book);
      const [from, to] = range ? range.split("-").map(Number) : [1, max];
      for (let c = from; c <= Math.min(to ?? from, max); c++) out.push({ book, chapter: c });
    }
    return out;
  }
  for (const [book, chs] of Object.entries(STARTER)) for (const c of chs) out.push({ book, chapter: c });
  return out;
}

function chapterScript(book: string, chapter: number) {
  const chapters = (JSON.parse(fs.readFileSync(path.join(root, "public", "bible", "web", `${book}.json`), "utf8")) as { chapters: string[][] }).chapters;
  const name = BOOK_BY_ID[book].name;
  const intro = book === "psalms" ? `Psalm ${chapter}. ` : `${name}, chapter ${chapter}. `;
  const verses = chapters[chapter - 1].map((t, i) => ({ v: i + 1, t })).filter((x) => x.t);
  return { intro, verses };
}

const todo = plan().filter((p) => !fs.existsSync(path.join(outDir, p.book, `${p.chapter}.json`)));
const chars = todo.reduce((n, p) => {
  const s = chapterScript(p.book, p.chapter);
  return n + s.intro.length + s.verses.reduce((m, v) => m + v.t.length + 1, 0);
}, 0);
console.log(`${todo.length} chapters to record (${chars.toLocaleString()} characters).`);
if (!go) {
  console.log("Dry run. Re-run with --yes to record (this spends ElevenLabs credits).");
  process.exit(0);
}

const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_BIBLE_VOICE_ID ?? process.env.ELEVENLABS_VOICE_ID;
if (!key || !voice) {
  console.error("Set ELEVENLABS_API_KEY and ELEVENLABS_BIBLE_VOICE_ID (or ELEVENLABS_VOICE_ID).");
  process.exit(1);
}

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

async function speak(text: string): Promise<{ audio: Buffer; alignment: Alignment }> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": key!, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2", voice_settings: { stability: 0.6, similarity_boost: 0.75 } }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const j = (await res.json()) as { audio_base64: string; alignment: Alignment };
  return { audio: Buffer.from(j.audio_base64, "base64"), alignment: j.alignment };
}

/** Splits a chapter into requests under the API's size limit, always at verse boundaries. */
function chunks(intro: string, verses: { v: number; t: string }[], max = 4500) {
  const out: { text: string; starts: { v: number; at: number }[] }[] = [];
  let cur = { text: intro, starts: [] as { v: number; at: number }[] };
  for (const v of verses) {
    if (cur.text.length + v.t.length + 1 > max && cur.starts.length) {
      out.push(cur);
      cur = { text: "", starts: [] };
    }
    cur.starts.push({ v: v.v, at: cur.text.length });
    cur.text += `${v.t} `;
  }
  out.push(cur);
  return out;
}

(async () => {
  for (const p of todo) {
    const { intro, verses } = chapterScript(p.book, p.chapter);
    const parts = chunks(intro, verses);
    const audio: Buffer[] = [];
    const timing: { v: number; start: number }[] = [];
    let offset = 0;
    try {
      for (const part of parts) {
        const { audio: a, alignment } = await speak(part.text.trim());
        audio.push(a);
        for (const s of part.starts) timing.push({ v: s.v, start: Math.round((offset + (alignment.character_start_times_seconds[s.at] ?? 0)) * 100) / 100 });
        offset += alignment.character_end_times_seconds[alignment.character_end_times_seconds.length - 1] ?? 0;
      }
    } catch (e) {
      console.error(`Stopped at ${p.book} ${p.chapter}: ${e instanceof Error ? e.message : e}`);
      break;
    }
    const dir = path.join(outDir, p.book);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${p.chapter}.mp3`), Buffer.concat(audio));
    fs.writeFileSync(path.join(dir, `${p.chapter}.json`), JSON.stringify({ translation: "WEB", verses: timing, duration: Math.round(offset * 100) / 100 }));
    console.log(`recorded ${p.book} ${p.chapter} (${Math.round(offset)}s)`);
  }
  execSync("npx tsx scripts/build-audio-manifest.ts", { cwd: root, stdio: "inherit" });
})();
