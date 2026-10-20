"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";

export interface MemoryCardDef {
  /** cards with the same pair id match */
  pair: string;
  key: string;
  label: string;
  face: ReactNode;
}

/**
 * Flip-two-cards memory engine. Works with mouse, touch and keyboard (cards are buttons).
 * Calls onMatch(pair) for educational facts and onWin(moves) when every pair is found.
 */
export function MemoryGame({ cards, columns, onMatch, onWin, back }: { cards: MemoryCardDef[]; columns: number; onMatch?: (pair: string) => void; onWin: (moves: number) => void; back?: ReactNode }) {
  const deck = useMemo(() => shuffle(cards), [cards]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    if (deck[a].pair === deck[b].pair) {
      const next = new Set(found).add(deck[a].pair);
      setFound(next);
      setOpen([]);
      play("correct");
      onMatch?.(deck[a].pair);
      if (next.size === cards.length / 2) setTimeout(() => onWin(moves), 700);
      return;
    }
    const t = setTimeout(() => setOpen([]), 1000);
    return () => clearTimeout(t);
  }, [open, deck, found, cards.length, moves, onMatch, onWin]);

  function flip(i: number) {
    if (open.length === 2 || open.includes(i) || found.has(deck[i].pair)) return;
    play("flip");
    setOpen((o) => [...o, i]);
    if (open.length === 1) setMoves((m) => m + 1);
  }

  return (
    <div>
      <p className="mb-3 text-center font-semibold text-ink-soft" aria-live="polite">
        Pairs found: {found.size} of {cards.length / 2} · Turns: {moves}
      </p>
      <div className="mx-auto grid max-w-3xl gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {deck.map((c, i) => {
          const shown = open.includes(i) || found.has(c.pair);
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => flip(i)}
              aria-label={shown ? c.label : `Hidden card ${i + 1}`}
              aria-pressed={shown}
              data-testid="memory-card"
              data-pair={c.pair}
              className="aspect-[3/4] [perspective:800px]"
            >
              <span
                className="relative block h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: shown ? "rotateY(180deg)" : "none" }}
              >
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-royal to-[#5b74ff] shadow-[var(--shadow-toy)] [backface-visibility:hidden]">
                  {back ?? <span className="font-display text-4xl font-bold text-sun">?</span>}
                </span>
                <span
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl border-4 bg-white p-1 text-center shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] ${found.has(c.pair) ? "border-emerald" : "border-sun"}`}
                >
                  {c.face}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
