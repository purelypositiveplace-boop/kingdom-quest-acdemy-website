/** Lists recorded audio so the UI only offers play buttons for recordings that really exist. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

function list(dir: string, ext: string): string[] {
  const out: string[] = [];
  const walk = (d: string, prefix = "") => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(d, e.name), `${prefix}${e.name}/`);
      else if (e.name.endsWith(ext)) out.push(`${prefix}${e.name.slice(0, -ext.length)}`);
    }
  };
  walk(dir);
  return out.sort();
}

// Story, prayer and verse narration
const narration = list(path.join(root, "public", "audio", "narration"), ".mp3");
fs.writeFileSync(path.join(root, "data", "audio-manifest.generated.json"), JSON.stringify({ files: narration }, null, 1));

// "Read me the Bible" chapters need both the mp3 and its verse timing file
const bibleDir = path.join(root, "public", "audio", "bible");
const chapters = list(bibleDir, ".mp3").filter((k) => fs.existsSync(path.join(bibleDir, `${k}.json`)));
fs.writeFileSync(path.join(root, "data", "bible-audio.generated.json"), JSON.stringify({ chapters }, null, 1));

console.log(`Audio manifest: ${narration.length} narration files, ${chapters.length} Bible chapters.`);
