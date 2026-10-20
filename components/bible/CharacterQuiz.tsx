"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/curriculum/types";
import { QuizRunner, QuizResult } from "@/components/lessons/QuizRunner";

export function CharacterQuiz({ questions, name }: { questions: QuizQuestion[]; name: string }) {
  const [result, setResult] = useState<{ s: number; t: number } | null>(null);
  const [run, setRun] = useState(0);
  return (
    <section className="space-y-3" aria-labelledby="char-quiz">
      <h2 id="char-quiz" className="text-2xl font-bold text-royal-dark">
        Quick quiz about {name}
      </h2>
      {result ? (
        <div className="card space-y-3 p-5">
          <QuizResult score={result.s} total={result.t} />
          <button type="button" className="btn-toy bg-royal text-white" onClick={() => { setResult(null); setRun(run + 1); }}>
            Try again
          </button>
        </div>
      ) : (
        <QuizRunner key={run} questions={questions} guide="oliver" onFinish={(s, t) => setResult({ s, t })} />
      )}
    </section>
  );
}
