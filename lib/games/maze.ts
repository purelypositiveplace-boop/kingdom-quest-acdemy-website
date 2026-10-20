import { mulberry32 } from "./random";

export interface Maze {
  w: number;
  h: number;
  /** walls[y][x] = [top, right, bottom, left] */
  walls: [boolean, boolean, boolean, boolean][][];
}

/** Perfect maze (exactly one path between any two cells) by seeded depth-first search. */
export function generateMaze(w: number, h: number, seed = 1): Maze {
  const rand = mulberry32(seed);
  const walls = Array.from({ length: h }, () => Array.from({ length: w }, () => [true, true, true, true] as [boolean, boolean, boolean, boolean]));
  const seen = Array.from({ length: h }, () => Array(w).fill(false));
  const stack: [number, number][] = [[0, 0]];
  seen[0][0] = true;
  const dirs: [number, number, number, number][] = [
    [0, -1, 0, 2],
    [1, 0, 1, 3],
    [0, 1, 2, 0],
    [-1, 0, 3, 1],
  ];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const opts = dirs.filter(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < w && ny < h && !seen[ny][nx];
    });
    if (!opts.length) {
      stack.pop();
      continue;
    }
    const [dx, dy, wall, opposite] = opts[Math.floor(rand() * opts.length)];
    walls[y][x][wall] = false;
    walls[y + dy][x + dx][opposite] = false;
    seen[y + dy][x + dx] = true;
    stack.push([x + dx, y + dy]);
  }
  return { w, h, walls };
}

/** Breadth-first solve from top-left to bottom-right; used by tests and answer keys. */
export function solveMaze(m: Maze): [number, number][] | null {
  const prev = new Map<string, string | null>([["0,0", null]]);
  const q: [number, number][] = [[0, 0]];
  const moves: [number, number, number][] = [
    [0, -1, 0],
    [1, 0, 1],
    [0, 1, 2],
    [-1, 0, 3],
  ];
  while (q.length) {
    const [x, y] = q.shift()!;
    if (x === m.w - 1 && y === m.h - 1) {
      const path: [number, number][] = [];
      let k: string | null = `${x},${y}`;
      while (k) {
        const [a, b] = k.split(",").map(Number);
        path.unshift([a, b]);
        k = prev.get(k) ?? null;
      }
      return path;
    }
    for (const [dx, dy, wall] of moves) {
      if (m.walls[y][x][wall]) continue;
      const key = `${x + dx},${y + dy}`;
      if (!prev.has(key)) {
        prev.set(key, `${x},${y}`);
        q.push([x + dx, y + dy]);
      }
    }
  }
  return null;
}
