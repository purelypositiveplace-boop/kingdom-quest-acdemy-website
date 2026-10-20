"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { MascotId, QuizQuestion as Q } from "@/lib/curriculum/types";
import { QuizQuestion } from "./QuizQuestion";
import { PrimaryButton } from "@/components/ui/Button";
import { StepDots } from "@/components/ui/ProgressTracker";

/** Runs a list of questions one at a time and reports first-try score. */
export function QuizRunner({ questions, onFinish, guide, big }: { questions: Q[]; onFinish: (score: number, total: number) => void; guide?: MascotId; big?: boolean }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const q = questions[i];
  const last = i === questions.length - 1;
  return (
    <div className="space-y-4">
      <StepDots count={questions.length} current={i} label="Question" />
      <QuizQuestion
        key={q.id}
        q={q}
        guide={guide}
        big={big}
        number={i + 1}
        total={questions.length}
        onAnswered={(first) => {
          if (first) setScore((s) => s + 1);
          setAnswered(true);
        }}
      />
      <div className="flex justify-end">
        <PrimaryButton
          tone="royal"
          size="lg"
          disabled={!answered}
          data-testid="quiz-next"
          icon={<ArrowRight aria-hidden />}
          onClick={() => {
            if (last) onFinish(score, questions.length);
            else {
              setI(i + 1);
              setAnswered(false);
            }
          }}
        >
          {last ? "Finish quiz" : "Next question"}
        </PrimaryButton>
      </div>
    </div>
  );
}

export function QuizResult({ score, total }: { score: number; total: number }) {
  const msg = score === total ? "Every answer right the first time!" : score >= total / 2 ? "Great thinking!" : "You kept trying until you found every answer. That's how explorers learn!";
  return (
    <p className="text-lg font-semibold text-ink">
      You answered {score} of {total} on the first try. {msg}
    </p>
  );
}
