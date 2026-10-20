"use client";

import { useMemo, useState } from "react";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";

export interface PairDef {
  id: string;
  left: string;
  right: string;
  explain: string;
}

/** Two-column matching: tap something on the left, then its match on the right. */
export function MatchPairs({ pairs, leftTitle, rightTitle, onWin }: { pairs: PairDef[]; leftTitle: string; rightTitle: string; onWin: (misses: number) => void }) {
  const left = useMemo(() => shuffle(pairs), [pairs]);
  const right = useMemo(() => shuffle(pairs), [pairs]);
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState("Tap a card on the left, then tap its match.");

  function pickRight(id: string) {
    if (!sel || done.includes(id)) return;
    if (sel === id) {
      const next = [...done, id];
      setDone(next);
      setSel(null);
      play("correct");
      setMsg(pairs.find((p) => p.id === id)!.explain);
      if (next.length === pairs.length) setTimeout(() => onWin(misses), 800);
    } else {
      setMisses((m) => m + 1);
      play("gentle");
      setMsg("Not quite a match. Read them again and try another one.");
    }
  }

  const btn = (active: boolean, isDone: boolean) =>
    `min-h-16 w-full rounded-2xl border-4 px-4 py-3 text-left font-semibold transition ${isDone ? "border-emerald bg-emerald-soft text-ink" : active ? "border-royal bg-royal-soft" : "border-royal-soft bg-white hover:border-royal"}`;

  return (
    <div>
      <p className="mb-4 min-h-12 rounded-2xl bg-sky-soft p-3 text-center font-semibold text-royal-dark" aria-live="polite">
        {msg}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-lg font-bold text-royal-dark">{leftTitle}</h3>
          <ul className="space-y-2">
            {left.map((p) => (
              <li key={p.id}>
                <button type="button" disabled={done.includes(p.id)} aria-pressed={sel === p.id} className={btn(sel === p.id, done.includes(p.id))} onClick={() => { setSel(p.id); play("tap"); }}>
                  {p.left}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-display text-lg font-bold text-royal-dark">{rightTitle}</h3>
          <ul className="space-y-2">
            {right.map((p) => (
              <li key={p.id}>
                <button type="button" disabled={done.includes(p.id)} className={btn(false, done.includes(p.id))} onClick={() => pickRight(p.id)}>
                  {p.right}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
