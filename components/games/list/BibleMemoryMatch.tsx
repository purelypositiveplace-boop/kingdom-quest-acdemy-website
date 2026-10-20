"use client";

import { useCallback, useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { MemoryGame, type MemoryCardDef } from "../MemoryGame";
import { shuffle } from "@/lib/games/random";
import { Anchor, Crown, Fish, Ship, Shirt, ScrollText, Wheat, Trees, Star, Cat, Sparkles, Waves } from "lucide-react";

/** Person ↔ object pairs. Each fact is drawn from the cited passage. */
const PAIRS = [
  { person: "Noah", thing: "The ark", Icon: Ship, fact: "Noah built the ark as God told him (Genesis 6:22)." },
  { person: "David", thing: "Sling and stones", Icon: Sparkles, fact: "David chose five smooth stones and his sling (1 Samuel 17:40)." },
  { person: "Moses", thing: "Stone tablets", Icon: ScrollText, fact: "God gave Moses the Ten Commandments on stone tablets (Exodus 31:18)." },
  { person: "Jonah", thing: "Great fish", Icon: Fish, fact: "God sent a great fish to swallow Jonah (Jonah 1:17)." },
  { person: "Peter", thing: "Fishing boat", Icon: Anchor, fact: "Peter left his boat to follow Jesus (Luke 5:11)." },
  { person: "Esther", thing: "Crown", Icon: Crown, fact: "Esther became queen of Persia (Esther 2:17)." },
  { person: "Daniel", thing: "Lions", Icon: Cat, fact: "God shut the lions' mouths (Daniel 6:22)." },
  { person: "Joseph", thing: "Colourful coat", Icon: Shirt, fact: "Jacob gave Joseph a coat of many colours (Genesis 37:3)." },
  { person: "Ruth", thing: "Grain", Icon: Wheat, fact: "Ruth gathered grain in Boaz's field (Ruth 2:3)." },
  { person: "Zacchaeus", thing: "Sycamore tree", Icon: Trees, fact: "Zacchaeus climbed a sycamore tree to see Jesus (Luke 19:4)." },
  { person: "Wise men", thing: "Star", Icon: Star, fact: "The wise men followed the star to Jesus (Matthew 2:9)." },
  { person: "Miriam", thing: "Tambourine by the sea", Icon: Waves, fact: "Miriam praised God with a tambourine after the Red Sea (Exodus 15:20)." },
];

export default function BibleMemoryMatch({ level, onFinish }: GameProps) {
  const n = level === "disciples" ? 3 : level === "explorers" ? 6 : 8;
  const chosen = useMemo(() => shuffle(PAIRS).slice(0, n), [n]);
  const cards = useMemo<MemoryCardDef[]>(
    () =>
      chosen.flatMap((p) => [
        {
          pair: p.person,
          key: `${p.person}-p`,
          label: p.person,
          face: (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-royal font-display text-xl font-bold text-white">{p.person[0]}</span>
              <span className="font-display text-sm font-bold leading-tight text-royal-dark">{p.person}</span>
            </>
          ),
        },
        {
          pair: p.person,
          key: `${p.person}-t`,
          label: p.thing,
          face: (
            <>
              <p.Icon size={40} className="text-gold-dark" aria-hidden />
              <span className="font-display text-sm font-bold leading-tight text-ink">{p.thing}</span>
            </>
          ),
        },
      ]),
    [chosen],
  );
  const [fact, setFact] = useState<string | null>(null);
  const onMatch = useCallback((person: string) => setFact(PAIRS.find((p) => p.person === person)?.fact ?? null), []);
  const onWin = useCallback((moves: number) => onFinish({ won: true, score: Math.max(1, 100 - moves * 3), message: `You matched every Bible person with their story in ${moves} turns!` }), [onFinish]);
  return (
    <div>
      <MemoryGame cards={cards} columns={level === "disciples" ? 3 : 4} onMatch={onMatch} onWin={onWin} />
      <p className="mt-4 min-h-12 rounded-2xl bg-sky-soft p-3 text-center font-semibold text-royal-dark" aria-live="polite">
        {fact ?? "Match each Bible person with something from their story."}
      </p>
    </div>
  );
}
