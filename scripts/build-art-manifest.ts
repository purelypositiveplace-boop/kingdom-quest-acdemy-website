/** Lists generated artwork under public/art so components only request files that exist. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const dir = path.join(root, "public", "art");
const files: string[] = [];
function walk(d: string, prefix: string) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(d, e.name), `${prefix}${e.name}/`);
    else if (/\.(webp|png|jpe?g|svg)$/i.test(e.name)) files.push(`${prefix}${e.name}`);
  }
}
walk(dir, "/art/");
fs.writeFileSync(path.join(root, "data", "art-files.generated.json"), JSON.stringify({ files: files.sort() }, null, 1));
console.log(`Art manifest: ${files.length} files.`);
