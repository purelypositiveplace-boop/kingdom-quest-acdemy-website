"use client";

import { useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { getLesson } from "@/lib/curriculum";
import { SequenceTap } from "../SequenceTap";

/** Uses the scene order of each parable lesson, so the puzzle always matches the lesson content. */
const PARABLES = ["lost-sheep", "good-samaritan", "prodigal-son"].map((id) => getLesson(id)!);

export default function ParablePuzzle({ onFinish }: GameProps) {
  const [i, setI] = useState(0);
  const [learned, setLearned] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const p = PARABLES[i];

  if (learned)
    return (
      <div className="card space-y-3 p-6" role="status">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald">What this parable teaches</p>
        <h3 className="text-2xl font-bold text-royal-dark">{p.title}</h3>
        <p className="text-lg text-ink">{learned}</p>
        <button
          type="button"
          data-testid="parable-next"
          className="btn-toy bg-royal text-white"
          onClick={() => {
            if (i + 1 === PARABLES.length) onFinish({ won: true, score: Math.max(1, 100 - misses * 4), message: "You put three of Jesus' parables in order and learned what each one teaches." });
            else {
              setI(i + 1);
              setLearned(null);
            }
          }}
        >
          {i + 1 === PARABLES.length ? "Finish" : "Next parable"}
        </button>
      </div>
    );

  return (
    <div>
      <h3 className="mb-1 text-2xl font-bold text-royal-dark">
        Parable {i + 1} of {PARABLES.length}: {p.title}
      </h3>
      <p className="mb-4 text-ink-soft">{p.refs[0]}</p>
      <SequenceTap
        key={p.id}
        items={p.scenes.map((s) => s.title)}
        prompt="Tap the story parts in order."
        onWin={(m) => {
          setMisses((x) => x + m);
          setLearned(p.explanation);
        }}
      />
    </div>
  );
}
