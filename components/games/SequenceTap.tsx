"use client";

import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";

/**
 * Tap items in the correct order. Wrong taps get a gentle message (no penalty beyond a counter),
 * and a hint button highlights the next item.
 */
export function SequenceTap({ items, onWin, prompt, compact }: { items: string[]; onWin: (misses: number, hints: number) => void; prompt: string; compact?: boolean }) {
  const pool = useMemo(() => shuffle(items.map((t, i) => ({ t, i }))), [items]);
  const [next, setNext] = useState(0);
  const [misses, setMisses] = useState(0);
  const [hints, setHints] = useState(0);
  const [hint, setHint] = useState(false);
  const [shake, setShake] = useState<number | null>(null);

  function tap(i: number) {
    if (i < next) return;
    if (i === next) {
      play("correct");
      setNext(next + 1);
      setHint(false);
      if (next + 1 === items.length) setTimeout(() => onWin(misses, hints), 500);
    } else {
      play("gentle");
      setMisses((m) => m + 1);
      setShake(i);
      setTimeout(() => setShake(null), 500);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-royal-dark" aria-live="polite">
          {prompt} {next < items.length ? `Next: #${next + 1}` : "Done!"} ({next}/{items.length})
        </p>
        <button
          type="button"
          onClick={() => {
            setHint(true);
            setHints((h) => h + 1);
          }}
          className="flex min-h-12 items-center gap-2 rounded-full bg-sun px-4 font-display font-bold text-ink shadow"
        >
          <Lightbulb size={18} aria-hidden /> Hint
        </button>
      </div>
      {next > 0 && (
        <ol className="mb-4 flex flex-wrap gap-2" aria-label="Placed in order">
          {items.slice(0, next).map((t, i) => (
            <li key={t} className="rounded-full bg-emerald px-3 py-1 text-sm font-bold text-white">
              {i + 1}. {t}
            </li>
          ))}
        </ol>
      )}
      <div className={`grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5" : "sm:grid-cols-2"}`}>
        {pool
          .filter((p) => p.i >= next)
          .map((p) => (
            <button
              key={p.t}
              type="button"
              onClick={() => tap(p.i)}
              data-testid="seq-item"
              className={`min-h-14 rounded-2xl border-4 bg-white px-3 py-2 text-left font-display font-semibold text-ink transition hover:border-royal ${hint && p.i === next ? "border-sun ring-4 ring-sun/60" : "border-royal-soft"} ${shake === p.i ? "animate-[wiggle_0.4s_ease-in-out]" : ""}`}
            >
              {p.t}
            </button>
          ))}
      </div>
    </div>
  );
}
