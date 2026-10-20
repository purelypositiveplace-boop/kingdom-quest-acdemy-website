import fs from "node:fs";
import path from "node:path";

/** Game ids registered in components/games/registry.tsx (read as text so tests don't load React). */
const src = fs.readFileSync(path.join(__dirname, "../../components/games/registry.tsx"), "utf8");
export const GAME_COMPONENT_IDS = [...src.matchAll(/^\s+"?([a-z-]+)"?: load\(/gm)].map((m) => m[1]);
