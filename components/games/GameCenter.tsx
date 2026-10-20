"use client";

import { useState } from "react";
import { GAMES } from "@/data/games";
import { GameCard } from "@/components/ui/Cards";
import { useKQ } from "@/lib/progress/store";
import { useLevel } from "@/lib/progress/useLevel";
import { LEVELS } from "@/lib/curriculum/levels";

export function GameCenter() {
  const level = useLevel();
  const games = useKQ((s) => s.progress.games);
  const [mine, setMine] = useState(true);
  const list = mine ? GAMES.filter((g) => g.ages.includes(level)) : GAMES;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={mine} onClick={() => setMine(true)} className={`min-h-11 rounded-full px-4 font-display font-semibold ${mine ? "bg-royal text-white" : "bg-white text-royal-dark shadow-sm"}`}>
          Best for {LEVELS[level].name}
        </button>
        <button type="button" aria-pressed={!mine} onClick={() => setMine(false)} className={`min-h-11 rounded-full px-4 font-display font-semibold ${!mine ? "bg-royal text-white" : "bg-white text-royal-dark shadow-sm"}`}>
          All {GAMES.length} games
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((g) => (
          <GameCard key={g.id} game={g} wins={games[g.id]?.wins ?? 0} />
        ))}
      </div>
    </div>
  );
}
