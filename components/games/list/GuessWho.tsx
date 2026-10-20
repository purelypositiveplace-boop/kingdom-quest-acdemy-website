"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import type { GameProps } from "@/lib/games/types";
import { CHARACTERS } from "@/data/characters";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";

/** Clues come from each character's profile, from hardest to easiest. */
export default function GuessWho({ level, onFinish }: GameProps) {
  const rounds = useMemo(() => shuffle(CHARACTERS.filter((c) => c.id !== "jesus")).slice(0, level === "disciples" ? 4 : 6), [level]);
  const [i, setI] = useState(0);
  const [clues, setClues] = useState(1);
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const c = rounds[i];
  const allClues = useMemo(() => (c ? [c.events[c.events.length - 1], c.events[0], c.role].map((s) => s.replace(new RegExp(c.name.split(",")[0], "g"), "This person")) : []), [c]);
  const options = useMemo(() => (c ? shuffle([c, ...shuffle(CHARACTERS.filter((x) => x.id !== c.id && x.id !== "jesus")).slice(0, level === "disciples" ? 2 : 3)]) : []), [c, level]);

  function guess(id: string) {
    if (solved) return;
    if (id === c.id) {
      play("correct");
      setSolved(true);
      setScore((s) => s + (4 - clues));
    } else {
      play("gentle");
      setWrong([...wrong, id]);
      setClues((n) => Math.min(3, n + 1));
    }
  }

  function next() {
    if (i + 1 === rounds.length) {
      onFinish({ won: true, score, message: `You earned ${score} clue stars by guessing Bible people with fewer clues!` });
      return;
    }
    setI(i + 1);
    setClues(1);
    setWrong([]);
    setSolved(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      <div className="card p-5">
        <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
          Mystery person {i + 1} of {rounds.length}
        </p>
        <ol className="mt-3 space-y-2">
          {allClues.slice(0, clues).map((cl, k) => (
            <li key={k} className="animate-pop rounded-2xl bg-sky-soft p-3 text-lg font-semibold text-ink">
              Clue {k + 1}: {cl}
            </li>
          ))}
        </ol>
        {!solved && clues < 3 && (
          <button type="button" onClick={() => setClues(clues + 1)} className="mt-3 min-h-12 rounded-full bg-sun px-5 font-display font-bold text-ink shadow">
            Show another clue
          </button>
        )}
        {solved && (
          <div className="mt-4 rounded-2xl bg-emerald-soft p-4" role="status">
            <p className="font-display text-2xl font-bold text-emerald">It&apos;s {c.name}!</p>
            <p className="text-ink">{c.kid}</p>
            <p className="mt-1 flex items-center gap-1 font-bold text-gold-dark">
              {Array.from({ length: 4 - clues }, (_, k) => <Star key={k} size={18} fill="currentColor" aria-hidden />)} {4 - clues} clue star{4 - clues === 1 ? "" : "s"}
            </p>
            <button type="button" onClick={next} className="btn-toy mt-3 bg-royal text-white">
              {i + 1 === rounds.length ? "Finish" : "Next person"}
            </button>
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2 font-display text-xl font-bold text-royal-dark">Who is it?</h3>
        <div className="grid gap-3">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              disabled={wrong.includes(o.id) || solved}
              onClick={() => guess(o.id)}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border-4 px-4 text-left font-display text-xl font-bold transition ${wrong.includes(o.id) ? "border-ink/10 bg-ink/5 text-ink-soft line-through" : solved && o.id === c.id ? "border-emerald bg-emerald-soft" : "border-royal-soft bg-white hover:border-royal"}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ background: o.color }}>
                {o.name[0]}
              </span>
              {o.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
