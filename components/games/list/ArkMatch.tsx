"use client";

import { useCallback, useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { MemoryGame, type MemoryCardDef } from "../MemoryGame";
import { AnimalArt, ANIMAL_FACTS, type AnimalKind } from "../AnimalArt";
import { shuffle } from "@/lib/games/random";

const ALL: AnimalKind[] = ["lion", "elephant", "giraffe", "sheep", "bear", "rabbit", "monkey", "pig", "cow", "fox", "owl", "zebra"];

/** Noah's Ark Animal Match — fewer cards for younger children. */
export default function ArkMatch({ level, onFinish }: GameProps) {
  const pairs = level === "disciples" ? 3 : level === "explorers" ? 6 : 8;
  const cards = useMemo<MemoryCardDef[]>(() => {
    const kinds = shuffle(ALL).slice(0, pairs);
    return kinds.flatMap((k) =>
      [0, 1].map((n) => ({
        pair: k,
        key: `${k}-${n}`,
        label: ANIMAL_FACTS[k].name,
        face: (
          <>
            <AnimalArt kind={k} size={level === "disciples" ? 96 : 64} />
            <span className="font-display text-sm font-bold text-ink">{ANIMAL_FACTS[k].name}</span>
          </>
        ),
      })),
    );
  }, [pairs, level]);
  const [fact, setFact] = useState<string | null>(null);
  const onMatch = useCallback((p: string) => setFact(`${ANIMAL_FACTS[p as AnimalKind].name}: ${ANIMAL_FACTS[p as AnimalKind].fact}`), []);
  const onWin = useCallback(
    (moves: number) => onFinish({ won: true, score: Math.max(1, 100 - moves * 3), message: `All the animals are safe on the ark in ${moves} turns! God told Noah to bring the animals in pairs (Genesis 7:9).` }),
    [onFinish],
  );
  return (
    <div>
      <MemoryGame cards={cards} columns={level === "disciples" ? 3 : 4} onMatch={onMatch} onWin={onWin} />
      <p className="mt-4 min-h-12 rounded-2xl bg-sky-soft p-3 text-center font-semibold text-royal-dark" aria-live="polite">
        {fact ?? "Find two animals that match to bring them onto the ark!"}
      </p>
    </div>
  );
}
