/** Lists recorded narration files so the UI only offers audio that really exists. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const dir = path.join(root, "public", "audio", "narration");
const files: string[] = [];

function walk(d: string, prefix = "") {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(d, e.name), `${prefix}${e.name}/`);
    else if (e.name.endsWith(".mp3")) files.push(`${prefix}${e.name.replace(/\.mp3$/, "")}`);
  }
}

walk(dir);
fs.writeFileSync(path.join(root, "data", "audio-manifest.generated.json"), JSON.stringify({ files: files.sort() }, null, 1));
console.log(`Narration manifest: ${files.length} recordings.`);
