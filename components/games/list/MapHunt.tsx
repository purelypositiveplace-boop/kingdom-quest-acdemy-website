"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { PLACES } from "@/data/places";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";
import { BibleMap } from "@/components/bible/BibleMap";

/** Bible Map Treasure Hunt: read a clue, tap the place. */
export default function MapHunt({ level, onFinish }: GameProps) {
  const rounds = useMemo(() => shuffle(PLACES).slice(0, level === "champions" ? 10 : 6), [level]);
  const [i, setI] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const target = rounds[i];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-sun/30 p-4" aria-live="polite">
        <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
          Treasure clue {i + 1} of {rounds.length}
        </p>
        <p className="font-display text-2xl font-bold text-royal-dark">{target.clue}</p>
        {msg && <p className="mt-1 font-semibold text-ink">{msg}</p>}
      </div>
      <BibleMap
        highlight={found}
        hideLabels={level === "champions"}
        onSelect={(p) => {
          if (p.id === target.id) {
            play("star");
            const f = [...found, p.id];
            setFound(f);
            setMsg(`You found ${p.name}! ${p.facts[0]}`);
            if (i + 1 === rounds.length) setTimeout(() => onFinish({ won: true, score: Math.max(1, 100 - misses * 5), message: `You found ${rounds.length} Bible places!` }), 900);
            else setTimeout(() => setI(i + 1), 900);
          } else {
            play("gentle");
            setMisses((m) => m + 1);
            setMsg(`That's ${p.name}. Keep looking!`);
          }
        }}
      />
    </div>
  );
}
