"use client";

import { useMemo, useRef, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { buildCrossword, CROSSWORD_SETS, type Entry } from "@/lib/games/crossword";
import { play } from "@/lib/audio/sfx";

export default function Crossword({ level, onFinish }: GameProps) {
  const [mode, setMode] = useState<"easy" | "advanced" | null>(level === "champions" ? null : null);
  if (!mode)
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {(["easy", "advanced"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className="card min-h-20 p-4 text-left">
            <span className="block font-display text-2xl font-bold capitalize text-royal-dark">{m}</span>
            <span className="text-ink-soft">{m === "easy" ? "Short words about favourite stories" : "Longer names, places and ideas"}</span>
          </button>
        ))}
      </div>
    );
  return <Puzzle mode={mode} onFinish={onFinish} />;
}

function Puzzle({ mode, onFinish }: { mode: "easy" | "advanced"; onFinish: GameProps["onFinish"] }) {
  const cw = useMemo(() => buildCrossword(CROSSWORD_SETS[mode]), [mode]);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState<Entry | null>(cw.entries[0] ?? null);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const numbers = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of cw.entries) m[`${e.row},${e.col}`] = e.number;
    return m;
  }, [cw]);
  const activeCells = useMemo(() => {
    const s = new Set<string>();
    if (active) for (let k = 0; k < active.answer.length; k++) s.add(`${active.row + (active.dir === "down" ? k : 0)},${active.col + (active.dir === "across" ? k : 0)}`);
    return s;
  }, [active]);

  function type(r: number, c: number, v: string) {
    const ch = v.slice(-1).toUpperCase().replace(/[^A-Z]/g, "");
    setVals((x) => ({ ...x, [`${r},${c}`]: ch }));
    setChecked(false);
    if (ch && active) {
      const nr = r + (active.dir === "down" ? 1 : 0);
      const nc = c + (active.dir === "across" ? 1 : 0);
      refs.current[`${nr},${nc}`]?.focus();
    }
  }

  function check() {
    setChecked(true);
    const allRight = cw.cells.every((row, r) => row.every((ch, c) => !ch || vals[`${r},${c}`] === ch));
    if (allRight) {
      play("win");
      onFinish({ won: true, score: 100, message: `You solved all ${cw.entries.length} clues!` });
    } else play("gentle");
  }

  const clueList = (dir: "across" | "down") => (
    <div>
      <h3 className="mb-2 font-display text-lg font-bold capitalize text-royal-dark">{dir}</h3>
      <ul className="space-y-1">
        {cw.entries
          .filter((e) => e.dir === dir)
          .map((e) => (
            <li key={`${e.number}${dir}`}>
              <button
                type="button"
                onClick={() => {
                  setActive(e);
                  refs.current[`${e.row},${e.col}`]?.focus();
                }}
                className={`w-full rounded-xl px-3 py-2 text-left ${active === e ? "bg-sun/40" : "hover:bg-sky-soft"}`}
              >
                <span className="font-bold">{e.number}.</span> {e.clue} ({e.answer.length})
              </button>
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="overflow-x-auto">
        <div className="inline-grid gap-0.5 rounded-xl bg-ink p-1" style={{ gridTemplateColumns: `repeat(${cw.cols}, 2.4rem)` }}>
          {cw.cells.map((row, r) =>
            row.map((ch, c) => {
              const k = `${r},${c}`;
              if (!ch) return <span key={k} className="h-[2.4rem] w-[2.4rem] bg-ink" aria-hidden />;
              const wrong = checked && vals[k] && vals[k] !== ch;
              return (
                <span key={k} className={`relative h-[2.4rem] w-[2.4rem] ${activeCells.has(k) ? "bg-sun/50" : "bg-white"}`}>
                  {numbers[k] && <span className="absolute left-0.5 top-0 text-[9px] font-bold text-ink-soft">{numbers[k]}</span>}
                  <input
                    ref={(el) => {
                      refs.current[k] = el;
                    }}
                    value={vals[k] ?? ""}
                    onChange={(e) => type(r, c, e.target.value)}
                    onFocus={() => {
                      if (!activeCells.has(k)) setActive(cw.entries.find((e) => e.dir === "across" ? e.row === r && c >= e.col && c < e.col + e.answer.length : e.col === c && r >= e.row && r < e.row + e.answer.length) ?? null);
                    }}
                    maxLength={2}
                    aria-label={`Row ${r + 1} column ${c + 1}`}
                    className={`h-full w-full bg-transparent text-center font-display text-xl font-bold uppercase outline-none focus:bg-sky ${wrong ? "text-coral" : "text-ink"}`}
                  />
                </span>
              );
            }),
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={check} className="btn-toy bg-royal text-white">
            Check my answers
          </button>
          <button
            type="button"
            onClick={() => {
              if (!active) return;
              const nv = { ...vals };
              for (let k = 0; k < active.answer.length; k++) nv[`${active.row + (active.dir === "down" ? k : 0)},${active.col + (active.dir === "across" ? k : 0)}`] = active.answer[k];
              setVals(nv);
            }}
            className="btn-toy bg-sun text-ink"
          >
            Reveal this word
          </button>
        </div>
        {checked && <p className="mt-2 font-semibold text-royal-dark" role="status">Letters in coral aren&apos;t quite right yet. Keep going!</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {clueList("across")}
        {clueList("down")}
      </div>
    </div>
  );
}
