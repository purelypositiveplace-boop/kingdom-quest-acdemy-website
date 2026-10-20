"use client";

import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import type { GameProps } from "@/lib/games/types";
import { findSelection, generateWordSearch, WORD_LISTS } from "@/lib/games/wordsearch";
import { play } from "@/lib/audio/sfx";

/** Tap the first letter of a word, then its last letter. Works with touch, mouse and keyboard. */
export default function WordSearch({ level, onFinish }: GameProps) {
  const [listId, setListId] = useState<string | null>(null);
  if (!listId)
    return (
      <div>
        <h3 className="mb-3 font-display text-xl font-bold text-royal-dark">Pick a puzzle</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(WORD_LISTS).map(([id, l]) => (
            <button key={id} type="button" onClick={() => setListId(id)} className="card min-h-16 p-4 text-left font-display text-xl font-bold text-royal-dark hover:-translate-y-1">
              {l.title}
            </button>
          ))}
        </div>
      </div>
    );
  return <Puzzle listId={listId} level={level} onFinish={onFinish} />;
}

function Puzzle({ listId, level, onFinish }: { listId: string; level: GameProps["level"]; onFinish: GameProps["onFinish"] }) {
  const ws = useMemo(() => {
    const words = WORD_LISTS[listId].words.slice(0, level === "disciples" ? 5 : level === "explorers" ? 8 : 12);
    const size = level === "disciples" ? 8 : level === "explorers" ? 10 : 12;
    return generateWordSearch(words, Math.max(size, ...words.map((w) => w.length)), { diagonal: level !== "disciples", backwards: level === "champions" });
  }, [listId, level]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [msg, setMsg] = useState("Tap the first letter of a word.");

  const foundCells = useMemo(() => {
    const s = new Set<string>();
    for (const p of ws.placements) if (found.includes(p.word)) for (let k = 0; k < p.word.length; k++) s.add(`${p.r + p.dr * k},${p.c + p.dc * k}`);
    return s;
  }, [ws, found]);
  const hintCell = hint ? ws.placements.find((p) => p.word === hint) : undefined;

  function tap(r: number, c: number) {
    if (!start) {
      setStart([r, c]);
      setMsg("Now tap the last letter.");
      play("tap");
      return;
    }
    const p = findSelection(ws, start[0], start[1], r, c);
    setStart(null);
    if (p && !found.includes(p.word)) {
      const f = [...found, p.word];
      setFound(f);
      setHint(null);
      play("correct");
      setMsg(`You found ${p.word}!`);
      if (f.length === ws.placements.length) setTimeout(() => onFinish({ won: true, score: 100 - (ws.placements.length - f.length), message: `You found all ${f.length} words in the ${WORD_LISTS[listId].title} puzzle!` }), 600);
    } else {
      play("gentle");
      setMsg("That's not a word from the list. Tap a first letter to try again.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div>
        <p className="mb-2 font-semibold text-royal-dark" aria-live="polite">
          {msg}
        </p>
        <div className="inline-grid touch-manipulation gap-1 rounded-2xl bg-royal-soft p-2" style={{ gridTemplateColumns: `repeat(${ws.size}, minmax(0, 1fr))` }} role="grid" aria-label="Word search grid">
          {ws.grid.map((row, r) =>
            row.map((ch, c) => {
              const isStart = start?.[0] === r && start?.[1] === c;
              const isFound = foundCells.has(`${r},${c}`);
              const isHint = hintCell && hintCell.r === r && hintCell.c === c;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => tap(r, c)}
                  aria-label={`${ch}, row ${r + 1}, column ${c + 1}`}
                  className={`flex aspect-square w-[min(8vw,2.75rem)] min-w-7 items-center justify-center rounded-lg font-display text-[min(4.5vw,1.4rem)] font-bold ${isStart ? "bg-royal text-white" : isFound ? "bg-emerald text-white" : isHint ? "bg-sun text-ink" : "bg-white text-ink hover:bg-sky-soft"}`}
                >
                  {ch}
                </button>
              );
            }),
          )}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-display text-xl font-bold text-royal-dark">Find these words</h3>
        <ul className="grid grid-cols-2 gap-2">
          {ws.placements.map((p) => (
            <li key={p.word} className={`rounded-xl px-3 py-2 font-display font-bold ${found.includes(p.word) ? "bg-emerald-soft text-emerald line-through" : "bg-white text-ink"}`}>
              {p.word}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setHint(ws.placements.find((p) => !found.includes(p.word))?.word ?? null)}
          className="mt-4 flex min-h-12 items-center gap-2 rounded-full bg-sun px-5 font-display font-bold text-ink shadow"
        >
          <Lightbulb size={18} aria-hidden /> Show me where a word starts
        </button>
      </div>
    </div>
  );
}
