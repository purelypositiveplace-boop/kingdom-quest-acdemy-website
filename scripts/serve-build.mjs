// Serves the production build from .next-build (see next.config.ts) so it can run beside a dev server.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.argv[2] ?? "3200";
spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "start", "-p", port], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, NEXT_DIST_DIR: ".next-build" },
});
