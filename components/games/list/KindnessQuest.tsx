"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { VALUES, TRUSTED_ADULT_NOTE } from "@/data/values";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";
import { Mascot } from "@/components/characters/Mascot";

/**
 * Good Samaritan Kindness Quest: walk the road and choose loving actions. Scenarios avoid
 * stereotypes; every "helper" is an ordinary kid, and the lesson is that anyone can be a neighbour.
 */
export default function KindnessQuest({ level, onFinish }: GameProps) {
  const stops = useMemo(() => shuffle(VALUES).slice(0, level === "disciples" ? 4 : 6), [level]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [kind, setKind] = useState(0);
  const s = stops[i];
  const choices = useMemo(() => shuffle(s.choices.map((c, k) => ({ ...c, k }))), [s]);

  function choose(k: number) {
    if (picked !== null && s.choices[picked].good) return;
    setPicked(k);
    if (s.choices[k].good) {
      play("star");
      setKind((n) => n + 1);
    } else play("gentle");
  }

  return (
    <div className="space-y-5">
      <div className="relative h-24 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-soft to-emerald-soft" aria-label={`Step ${i + 1} of ${stops.length} on the kindness road`} role="img">
        <div className="absolute inset-x-4 bottom-6 h-3 rounded-full bg-[#f6dfa5]" />
        {stops.map((_, k) => (
          <span key={k} className={`absolute bottom-4 h-7 w-7 rounded-full border-4 border-white ${k < i || (k === i && picked !== null && s.choices[picked].good) ? "bg-emerald" : "bg-ink/20"}`} style={{ left: `calc(${(k / (stops.length - 1)) * 90}% + 8px)` }} />
        ))}
        <div className="absolute bottom-6 transition-all duration-700" style={{ left: `calc(${(i / (stops.length - 1)) * 90}% - 8px)` }}>
          <Mascot id="grace" size={56} animate="none" />
        </div>
      </div>
      <div className="card p-5">
        <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">{s.title}</p>
        <p className="mt-1 font-display text-2xl font-bold text-royal-dark">{s.scenario}</p>
        <p className="mt-1 text-ink-soft">What is the most loving thing to do?</p>
        <div className="mt-4 grid gap-3">
          {choices.map((c) => (
            <button
              key={c.k}
              type="button"
              onClick={() => choose(c.k)}
              className={`min-h-16 rounded-2xl border-4 px-4 text-left text-lg font-semibold transition ${picked === c.k ? (c.good ? "border-emerald bg-emerald-soft" : "border-coral bg-coral-soft") : "border-royal-soft bg-white hover:border-royal"}`}
            >
              {c.text}
            </button>
          ))}
        </div>
        {picked !== null && (
          <div className="mt-4 rounded-2xl bg-sky-soft p-4" role="status">
            <p className="font-semibold text-ink">{s.choices[picked].feedback}</p>
            {s.safetyNote && <p className="mt-2 text-sm text-ink-soft">{TRUSTED_ADULT_NOTE}</p>}
            {s.choices[picked].good && (
              <button
                type="button"
                className="btn-toy mt-3 bg-royal text-white"
                onClick={() => {
                  if (i + 1 === stops.length) onFinish({ won: true, score: kind * 10, message: "You helped everyone along the road! Jesus said, 'Go and do likewise' (Luke 10:37)." });
                  else {
                    setI(i + 1);
                    setPicked(null);
                  }
                }}
              >
                {i + 1 === stops.length ? "Finish the quest" : "Keep walking"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
