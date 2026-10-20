"use client";

import { useCallback, useMemo } from "react";
import type { GameProps } from "@/lib/games/types";
import { MatchPairs, type PairDef } from "../MatchPairs";

/**
 * Simplified commandments (Exodus 20:1-17) with everyday examples. Examples show what keeping
 * the commandment looks like, so ordinary mistakes are never framed as serious wrongdoing.
 */
const PAIRS: PairDef[] = [
  { id: "1", left: "Put God first", right: "Talking to God and thanking him every day", explain: "Exodus 20:3 — God wants first place in our hearts." },
  { id: "2", left: "Worship only God, not idols", right: "Remembering that nothing is more important than God, not even toys or games", explain: "Exodus 20:4 — an idol is anything we put in God's place." },
  { id: "3", left: "Use God's name with respect", right: "Saying God's name kindly, like when you pray", explain: "Exodus 20:7 — God's name is special." },
  { id: "4", left: "Keep a day of rest for God", right: "Taking time to rest, worship and be with family", explain: "Exodus 20:8 — rest is a gift from God." },
  { id: "5", left: "Honour your father and mother", right: "Listening to your parents and helping at home", explain: "Exodus 20:12 — honouring means showing respect." },
  { id: "6", left: "Do not murder", right: "Protecting others and never trying to hurt anyone", explain: "Exodus 20:13 — every life is precious to God." },
  { id: "7", left: "Be faithful in marriage", right: "Grown-ups keeping their wedding promises", explain: "Exodus 20:14 — God cares about promises and families." },
  { id: "8", left: "Do not steal", right: "Returning something that doesn't belong to you", explain: "Exodus 20:15 — we respect what belongs to others." },
  { id: "9", left: "Do not lie about others", right: "Telling the truth, even when it's hard", explain: "Exodus 20:16 — honesty builds trust." },
  { id: "10", left: "Do not covet", right: "Being thankful for what you have instead of wanting a friend's things", explain: "Exodus 20:17 — a thankful heart is a happy heart." },
];

export default function CommandmentsMatch({ level, onFinish }: GameProps) {
  const pairs = useMemo(() => (level === "champions" ? PAIRS : PAIRS.filter((p) => ["1", "3", "4", "5", "8", "9"].includes(p.id))), [level]);
  const onWin = useCallback(
    (misses: number) =>
      onFinish({
        won: true,
        score: Math.max(1, 100 - misses * 8),
        message: "Jesus summed up the commandments with love: love God with all your heart, and love your neighbour as yourself (Matthew 22:37-39).",
      }),
    [onFinish],
  );
  return <MatchPairs pairs={pairs} leftTitle="Commandment (in simple words)" rightTitle="What it looks like" onWin={onWin} />;
}
