"use client";

import { useEffect, useMemo, useState } from "react";
import { Lightbulb, Timer } from "lucide-react";
import type { GameProps } from "@/lib/games/types";
import type { AgeLevel, TriviaQuestion } from "@/lib/curriculum/types";
import { TRIVIA } from "@/data/questions/trivia";
import { shuffle, shuffleChoices } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";
import { LEVELS } from "@/lib/curriculum/levels";

const CATS = ["All", "Old Testament", "Jesus", "Early Church", "People", "Bible Books", "Places"] as const;
const SECONDS = 25;

/** Bible Trivia Adventure: categories, levels, optional timer, hints and explanations. */
export default function Trivia({ level, timers, paused, onFinish }: GameProps) {
  const [setup, setSetup] = useState<{ lvl: AgeLevel; cat: (typeof CATS)[number] } | null>(null);
  if (!setup)
    return (
      <div className="space-y-5">
        <div>
          <h3 className="mb-2 font-display text-xl font-bold text-royal-dark">Difficulty</h3>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Difficulty">
            {Object.values(LEVELS).map((l) => (
              <TriviaLevelButton key={l.id} id={l.id} name={l.name} current={level} onPick={(lvl) => setSetup({ lvl, cat: "All" })} />
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-soft">Tip: pick a level to start with all categories, or choose a category below.</p>
        </div>
        <div>
          <h3 className="mb-2 font-display text-xl font-bold text-royal-dark">Category</h3>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} type="button" onClick={() => setSetup({ lvl: level, cat: c })} className="min-h-12 rounded-full bg-white px-5 font-display font-semibold text-royal-dark shadow hover:bg-royal hover:text-white">
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  return <Round lvl={setup.lvl} cat={setup.cat} timers={timers} paused={paused} onFinish={onFinish} />;
}

function TriviaLevelButton({ id, name, current, onPick }: { id: AgeLevel; name: string; current: AgeLevel; onPick: (l: AgeLevel) => void }) {
  return (
    <button type="button" role="radio" aria-checked={id === current} onClick={() => onPick(id)} className={`min-h-12 rounded-full px-5 font-display font-bold shadow ${id === current ? "bg-royal text-white" : "bg-white text-royal-dark"}`}>
      {name}
    </button>
  );
}

function Round({ lvl, cat, timers, paused, onFinish }: { lvl: AgeLevel; cat: string; timers: boolean; paused: boolean; onFinish: GameProps["onFinish"] }) {
  const questions = useMemo(() => {
    let pool = TRIVIA.filter((q) => q.level === lvl && (cat === "All" || q.category === cat));
    if (pool.length < 5) pool = [...pool, ...TRIVIA.filter((q) => q.level !== lvl && (cat === "All" || q.category === cat))];
    return shuffle(pool).slice(0, 10);
  }, [lvl, cat]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const q: TriviaQuestion = questions[i];
  const sh = useMemo(() => shuffleChoices(q.choices, q.answer), [q]);
  const [picked, setPicked] = useState<number | null>(null);
  const [hidden, setHidden] = useState<number[]>([]);
  const [left, setLeft] = useState(SECONDS);

  useEffect(() => {
    setLeft(SECONDS);
  }, [i]);
  useEffect(() => {
    if (!timers || paused || picked !== null) return;
    if (left <= 0) {
      setPicked(-1);
      play("gentle");
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timers, paused, picked, left]);

  function choose(k: number) {
    if (picked !== null) return;
    setPicked(k);
    if (k === sh.answer) {
      setScore((s) => s + 1);
      play("correct");
    } else play("gentle");
  }

  function next() {
    if (i + 1 === questions.length) {
      onFinish({ won: true, score: score * 10, message: `You got ${score} of ${questions.length} right and learned ${questions.length} Bible facts!` });
      return;
    }
    setI(i + 1);
    setPicked(null);
    setHidden([]);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-ink-soft">
        <span>
          Question {i + 1} of {questions.length} · {q.category}
        </span>
        <span>Score: {score}</span>
        {timers && (
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 ${left <= 5 ? "bg-coral text-white" : "bg-royal-soft text-royal-dark"}`}>
            <Timer size={16} aria-hidden /> {left}s
          </span>
        )}
      </div>
      <h3 className="font-display text-2xl font-bold text-royal-dark md:text-3xl">{q.q}</h3>
      <div className="mt-4 grid gap-3">
        {sh.choices.map((c, k) =>
          hidden.includes(k) ? null : (
            <button
              key={c}
              type="button"
              onClick={() => choose(k)}
              disabled={picked !== null}
              className={`min-h-16 rounded-2xl border-4 px-5 text-left font-display text-lg font-semibold transition ${
                picked !== null && k === sh.answer ? "border-emerald bg-emerald-soft" : picked === k ? "border-coral bg-coral-soft" : "border-royal-soft bg-white hover:border-royal"
              }`}
            >
              {c}
              {picked !== null && k === sh.answer && <span className="sr-only"> (correct answer)</span>}
            </button>
          ),
        )}
      </div>
      {picked === null && (
        <button
          type="button"
          onClick={() => {
            const wrongs = sh.choices.map((_, k) => k).filter((k) => k !== sh.answer && !hidden.includes(k));
            if (wrongs.length > 1) setHidden([...hidden, wrongs[0]]);
          }}
          className="mt-3 flex min-h-12 items-center gap-2 rounded-full bg-sun px-4 font-display font-bold text-ink shadow"
        >
          <Lightbulb size={18} aria-hidden /> {q.hint ? `Hint: ${q.hint}` : "Hint: remove a wrong answer"}
        </button>
      )}
      {picked !== null && (
        <div className="mt-4 rounded-2xl bg-sky-soft p-4" role="status">
          <p className="font-display text-xl font-bold text-royal-dark">{picked === sh.answer ? "Correct!" : picked === -1 ? "Time's up! No problem." : "Good try!"}</p>
          <p className="text-ink">
            {q.explain} {q.ref && <span className="font-semibold">({q.ref})</span>}
          </p>
          <button type="button" onClick={next} className="btn-toy mt-3 bg-royal text-white">
            {i + 1 === questions.length ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
