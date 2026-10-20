"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { VALUES, TRUSTED_ADULT_NOTE } from "@/data/values";
import { ScriptureText, ContentLabel } from "@/components/ui/ScriptureText";
import { CharacterBubble } from "@/components/characters/CharacterBubble";
import { useKQ } from "@/lib/progress/store";
import { play } from "@/lib/audio/sfx";
import { PrimaryButton } from "@/components/ui/Button";

export function ValueLessonView({ id }: { id: string }) {
  const v = VALUES.find((x) => x.id === id)!;
  const [picked, setPicked] = useState<number | null>(null);
  const [practised, setPractised] = useState(false);
  const complete = useKQ((s) => s.completeValue);
  const done = useKQ((s) => Boolean(s.progress.values[id]));
  return (
    <article className="space-y-5" data-testid={`value-${id}`}>
      <header className="card space-y-3 p-6">
        <h1 className="text-4xl font-bold text-royal-dark">{v.title}</h1>
        <ContentLabel kind="explanation" />
        <p className="text-lg text-ink">{v.teaching}</p>
        <ScriptureText refText={v.verse} />
      </header>
      <section className="card space-y-4 p-6">
        <h2 className="text-2xl font-bold text-royal-dark">What would you do?</h2>
        <p className="rounded-2xl bg-sun/25 p-4 text-xl font-semibold text-ink">{v.scenario}</p>
        <div className="grid gap-3">
          {v.choices.map((c, i) => (
            <button
              key={c.text}
              type="button"
              onClick={() => {
                setPicked(i);
                play(c.good ? "correct" : "gentle");
              }}
              className={`min-h-16 rounded-2xl border-4 px-4 text-left text-lg font-semibold ${picked === i ? (c.good ? "border-emerald bg-emerald-soft" : "border-coral bg-coral-soft") : "border-royal-soft bg-white hover:border-royal"}`}
            >
              {c.text}
            </button>
          ))}
        </div>
        {picked !== null && (
          <CharacterBubble id="grace" size={80} expression={v.choices[picked].good ? "happy" : "calm"}>
            {v.choices[picked].feedback}
          </CharacterBubble>
        )}
        <p className="text-ink">{v.explain}</p>
        {v.safetyNote && (
          <p className="flex gap-3 rounded-2xl bg-coral-soft p-4 font-semibold text-ink">
            <HeartHandshake className="shrink-0 text-coral" aria-hidden /> {TRUSTED_ADULT_NOTE}
          </p>
        )}
      </section>
      <section className="card space-y-3 p-6">
        <h2 className="text-2xl font-bold text-royal-dark">Practise it</h2>
        <p className="text-lg text-ink">{v.practice}</p>
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" className="h-7 w-7" checked={practised || done} onChange={(e) => setPractised(e.target.checked)} />
          <span className="font-semibold">I&apos;ll try this today!</span>
        </label>
        <ContentLabel kind="reflection" />
        <p className="text-lg text-ink">{v.reflection}</p>
        <PrimaryButton tone="emerald" disabled={picked === null || done} onClick={() => complete(id)} data-testid="value-complete">
          {done ? "Finished!" : "I finished this lesson"}
        </PrimaryButton>
      </section>
    </article>
  );
}
