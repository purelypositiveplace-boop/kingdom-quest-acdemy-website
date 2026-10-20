"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { QuizQuestion as Q } from "@/lib/curriculum/types";
import { shuffleChoices } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";
import { MASCOTS, pick } from "@/data/mascots";
import type { MascotId } from "@/lib/curriculum/types";
import { Mascot } from "@/components/characters/Mascot";

/**
 * One multiple-choice question. Wrong answers get gentle feedback and the child can try again
 * with no penalty. `onAnswered(firstTry)` fires once the right answer is chosen.
 */
export function QuizQuestion({ q, onAnswered, guide = "leo", big = false, number, total }: { q: Q; onAnswered: (firstTry: boolean) => void; guide?: MascotId; big?: boolean; number?: number; total?: number }) {
  // Shuffle after mount: random order during server rendering would not match the browser.
  const [{ choices, answer }, setOrder] = useState({ choices: q.choices, answer: q.answer });
  useEffect(() => setOrder(shuffleChoices(q.choices, q.answer)), [q]);
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const lines = MASCOTS[guide].lines;

  function choose(i: number) {
    if (done || picked.includes(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (i === answer) {
      play("correct");
      setDone(true);
      setMsg(pick(lines.correct));
      onAnswered(next.length === 1);
    } else {
      play("gentle");
      setMsg(pick(lines.tryAgain));
    }
  }

  return (
    <div className="card p-5 md:p-7" data-testid="quiz-question">
      {number !== undefined && total !== undefined && (
        <p className="mb-1 text-sm font-bold uppercase tracking-wider text-ink-soft">
          Question {number} of {total}
        </p>
      )}
      <h3 className={`font-display font-bold text-royal-dark ${big ? "text-3xl" : "text-2xl"}`}>{q.q}</h3>
      <div className={`mt-5 grid gap-3 ${big ? "" : "sm:grid-cols-1"}`}>
        {choices.map((c, i) => {
          const wrong = picked.includes(i) && i !== answer;
          const right = done && i === answer;
          return (
            <button
              key={c}
              type="button"
              onClick={() => choose(i)}
              disabled={done || wrong}
              aria-label={`${c}${right ? " (correct)" : wrong ? " (not this one)" : ""}`}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border-4 px-5 py-3 text-left font-display font-semibold transition ${big ? "text-2xl" : "text-lg"} ${
                right ? "border-emerald bg-emerald-soft text-ink" : wrong ? "border-ink/10 bg-ink/5 text-ink-soft line-through" : "border-royal-soft bg-white text-ink hover:border-royal hover:bg-royal-soft"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${right ? "bg-emerald text-white" : wrong ? "bg-ink/20 text-white" : "bg-royal-soft text-royal-dark"}`}>
                {right ? <Check size={20} aria-hidden /> : wrong ? <X size={20} aria-hidden /> : String.fromCharCode(65 + i)}
              </span>
              {c}
            </button>
          );
        })}
      </div>
      {msg && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-sky-soft p-4" role="status">
          <Mascot id={guide} size={56} expression={done ? "excited" : "thinking"} animate="none" />
          <div>
            <p className="font-display text-lg font-bold text-royal-dark">{msg}</p>
            {done && <p className="text-ink">{q.explain}</p>}
            {!done && (
              <p className="flex items-center gap-1 text-sm text-ink-soft">
                <RotateCcw size={14} aria-hidden /> Pick another answer.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
