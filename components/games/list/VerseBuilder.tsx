"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { getVerseText } from "@/components/ui/ScriptureText";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";

/** Verse Builder: rebuild a World English Bible verse from its scrambled words. */
export default function VerseBuilder({ level, onFinish }: GameProps) {
  const verses = useMemo(() => {
    const max = level === "disciples" ? 12 : level === "explorers" ? 20 : 40;
    return shuffle(
      MEMORY_VERSES.filter((v) => v.ages.includes(level) || level === "champions")
        .map((v) => ({ ...v, text: getVerseText(v.ref) ?? "" }))
        .filter((v) => v.text && v.text.split(/\s+/).length <= max),
    ).slice(0, 3);
  }, [level]);
  const [i, setI] = useState(0);
  const v = verses[i];
  const words = useMemo(() => v.text.split(/\s+/), [v]);
  const pool = useMemo(() => shuffle(words.map((w, k) => ({ w, k }))), [words]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [msg, setMsg] = useState("Tap the words in order.");
  const [misses, setMisses] = useState(0);

  function tap(k: number) {
    const expected = placed.length;
    // duplicates (like "the") are interchangeable
    if (words[k] === words[expected]) {
      const p = [...placed, k];
      setPlaced(p);
      play("tap");
      if (p.length === words.length) {
        play("correct");
        setMsg(`You built ${v.ref}!`);
      }
    } else {
      setMisses((m) => m + 1);
      play("gentle");
      setMsg(`Not that one yet. The next word starts with "${words[expected][0]}".`);
    }
  }

  const complete = placed.length === words.length;
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
        Verse {i + 1} of {verses.length} · {v.ref} (World English Bible)
      </p>
      <div className="scripture min-h-24 rounded-3xl border-l-8 border-gold bg-white p-5 text-xl leading-relaxed text-ink" aria-live="polite">
        {placed.map((k) => words[k]).join(" ")}
        {!complete && <span className="ml-1 inline-block h-6 w-3 animate-pulse rounded bg-royal-soft align-middle" />}
      </div>
      <p className="font-semibold text-royal-dark">{msg}</p>
      {!complete ? (
        <div className="flex flex-wrap gap-2">
          {pool
            .filter((p) => !placed.includes(p.k))
            .map((p) => (
              <button key={p.k} type="button" onClick={() => tap(p.k)} className="min-h-12 rounded-2xl border-4 border-royal-soft bg-white px-4 font-display text-lg font-semibold hover:border-royal">
                {p.w}
              </button>
            ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-soft p-4">
          <p className="text-ink">
            <span className="font-bold">What it means:</span> {v.meaning}
          </p>
          <button
            type="button"
            className="btn-toy mt-3 bg-royal text-white"
            onClick={() => {
              if (i + 1 === verses.length) onFinish({ won: true, score: Math.max(1, 100 - misses * 2), message: `You rebuilt ${verses.length} Bible verses word by word!` });
              else {
                setI(i + 1);
                setPlaced([]);
                setMsg("Tap the words in order.");
              }
            }}
          >
            {i + 1 === verses.length ? "Finish" : "Next verse"}
          </button>
        </div>
      )}
    </div>
  );
}
