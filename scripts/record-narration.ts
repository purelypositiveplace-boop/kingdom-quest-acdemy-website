/**
 * Records narration with ElevenLabs (natural voices, never browser text-to-speech).
 *
 *   npm run record:narration                    dry run: lists missing lines and character count
 *   npm run record:narration -- --yes           records missing lines (spends ElevenLabs credits)
 *   npm run record:narration -- --yes --only=creation
 *
 * Env: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID (narrator), optional ELEVENLABS_MODEL.
 * Output: public/audio/narration/<lesson>/<scene>.mp3 (+ <scene>-short.mp3), then rebuilds the manifest.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { LESSONS } from "../lib/curriculum";
import { PRAYER_TOPICS } from "../data/prayers";

const root = path.resolve(__dirname, "..");
const out = path.join(root, "public", "audio", "narration");
const args = process.argv.slice(2);
const go = args.includes("--yes");
const only = args.find((a) => a.startsWith("--only="))?.slice(7);

const lines: { key: string; text: string }[] = [];
for (const l of LESSONS) {
  if (only && l.id !== only) continue;
  for (const s of l.scenes) {
    lines.push({ key: `${l.id}/${s.id}`, text: `${s.title}. ${s.text}` });
    if (s.short) lines.push({ key: `${l.id}/${s.id}-short`, text: s.short });
  }
}
if (!only) for (const p of PRAYER_TOPICS) if (p.prayer) lines.push({ key: `prayer/${p.id}`, text: p.prayer });

const missing = lines.filter((l) => !fs.existsSync(path.join(out, `${l.key}.mp3`)));
const chars = missing.reduce((n, l) => n + l.text.length, 0);
console.log(`${missing.length} of ${lines.length} lines need recording (${chars} characters).`);
if (!go) {
  console.log("Dry run. Re-run with --yes to record (this spends ElevenLabs credits).");
  process.exit(0);
}

const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voice) {
  console.error("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID first.");
  process.exit(1);
}

(async () => {
  for (const l of missing) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({
        text: l.text,
        model_id: process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2",
        voice_settings: { stability: 0.55, similarity_boost: 0.75 },
      }),
    });
    if (!res.ok) {
      console.error(`Failed ${l.key}: ${res.status} ${await res.text()}`);
      break;
    }
    const file = path.join(out, `${l.key}.mp3`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log(`recorded ${l.key}`);
  }
  execSync("npx tsx scripts/build-audio-manifest.ts", { cwd: root, stdio: "inherit" });
})();
