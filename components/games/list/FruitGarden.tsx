"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";

/** Galatians 5:22-23 — the nine fruit of the Spirit, each with an everyday action. */
const FRUITS = [
  { id: "love", name: "Love", color: "#ff5d8f", action: "Maya gives her little brother a hug when he feels sad." },
  { id: "joy", name: "Joy", color: "#ffd23f", action: "Sam sings a happy thank-you song to God in the morning." },
  { id: "peace", name: "Peace", color: "#6fc3ff", action: "Leah stays calm and helps two friends stop arguing." },
  { id: "patience", name: "Patience", color: "#b9a6ff", action: "Eli waits quietly for his turn on the slide." },
  { id: "kindness", name: "Kindness", color: "#ff8a5c", action: "Ava shares her crayons with a new classmate." },
  { id: "goodness", name: "Goodness", color: "#1fa463", action: "Noah returns the money he found to the store." },
  { id: "faithfulness", name: "Faithfulness", color: "#2a48d4", action: "Zoe keeps her promise to help Grandma every Saturday." },
  { id: "gentleness", name: "Gentleness", color: "#ff8fc1", action: "Ben holds the baby bird softly and carefully." },
  { id: "self-control", name: "Self-control", color: "#f0a92e", action: "Mia feels angry but takes deep breaths instead of yelling." },
];

export default function FruitGarden({ level, onFinish }: GameProps) {
  const rounds = useMemo(() => shuffle(FRUITS), []);
  const [i, setI] = useState(0);
  const [grown, setGrown] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const round = rounds[i];
  const options = useMemo(() => {
    if (!round) return [];
    const count = level === "disciples" ? 2 : level === "explorers" ? 3 : 4;
    return shuffle([round, ...shuffle(FRUITS.filter((f) => f.id !== round.id)).slice(0, count - 1)]);
  }, [round, level]);

  function choose(id: string) {
    if (id === round.id) {
      play("grow");
      const g = [...grown, id];
      setGrown(g);
      setWrong([]);
      if (g.length === FRUITS.length)
        setTimeout(() => onFinish({ won: true, score: Math.max(1, 100 - misses * 5), message: "Your garden is full! 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control' (Galatians 5:22-23)." }), 700);
      else setI(i + 1);
    } else {
      play("gentle");
      setMisses((m) => m + 1);
      setWrong([...wrong, id]);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        {round && (
          <div className="card p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
              Plant {grown.length + 1} of {FRUITS.length}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-royal-dark">{round.action}</p>
            <p className="mt-2 text-ink-soft">Which fruit of the Spirit is this?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  disabled={wrong.includes(o.id)}
                  onClick={() => choose(o.id)}
                  className={`flex min-h-16 items-center gap-3 rounded-2xl border-4 px-4 font-display text-xl font-bold transition ${wrong.includes(o.id) ? "border-ink/10 bg-ink/5 text-ink-soft line-through" : "border-royal-soft bg-white hover:border-royal"}`}
                >
                  <span className="h-8 w-8 rounded-full" style={{ background: o.color }} aria-hidden />
                  {o.name}
                </button>
              ))}
            </div>
            {wrong.length > 0 && <p className="mt-3 font-semibold text-royal-dark" role="status">Good try! Look at what the person did and try again.</p>}
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2 font-display text-xl font-bold text-royal-dark">Your Spirit garden</h3>
        <svg viewBox="0 0 300 220" className="w-full rounded-3xl bg-gradient-to-b from-sky-soft to-emerald-soft" role="img" aria-label={`Garden with ${grown.length} of 9 plants grown: ${grown.join(", ") || "none yet"}`}>
          <rect y="160" width="300" height="60" fill="#8b5e3c" />
          <rect y="155" width="300" height="10" fill="#5fcb72" />
          {FRUITS.map((f, k) => {
            const x = 25 + (k % 9) * 31;
            const isGrown = grown.includes(f.id);
            return (
              <g key={f.id} transform={`translate(${x} 160)`}>
                <ellipse cx="0" cy="4" rx="10" ry="4" fill="#6b4529" />
                {isGrown && (
                  <g className="animate-pop">
                    <path d="M0 0 v-60" stroke="#2f8f46" strokeWidth="4" />
                    <ellipse cx="-8" cy="-30" rx="9" ry="5" fill="#47b26b" transform="rotate(-30 -8 -30)" />
                    <ellipse cx="8" cy="-42" rx="9" ry="5" fill="#47b26b" transform="rotate(30 8 -42)" />
                    <circle cx="0" cy="-66" r="11" fill={f.color} />
                    <circle cx="-3" cy="-69" r="3" fill="#fff" opacity="0.6" />
                  </g>
                )}
                <text y="34" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">
                  {f.name.split("-")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
