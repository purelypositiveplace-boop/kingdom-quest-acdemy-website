"use client";

import { useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { PLACES, type Place } from "@/data/places";
import { BibleMap } from "./BibleMap";
import { ContentLabel } from "@/components/ui/ScriptureText";
import { refHref } from "@/lib/bible/reference";
import { PrimaryButton } from "@/components/ui/Button";

export function MapExplorer() {
  const [p, setP] = useState<Place>(PLACES[0]);
  return (
    <div className="space-y-6">
      <BibleMap selected={p.id} onSelect={setP} />
      <section className="card grid gap-6 p-6 md:grid-cols-2" aria-live="polite" data-testid="place-info">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">{p.kind}</p>
          <h2 className="text-3xl font-bold text-royal-dark">{p.name}</h2>
          <p className="text-lg text-ink">
            <span className="font-bold">Where is it? </span>
            {p.geo}
          </p>
          <ContentLabel kind="context" />
          <p className="text-ink">{p.context}</p>
          {p.uncertainty && (
            <p className="flex gap-2 rounded-2xl bg-sun/25 p-3 text-ink">
              <Info className="mt-0.5 shrink-0" size={18} aria-hidden /> {p.uncertainty}
            </p>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-royal-dark">Fun facts</h3>
          <ul className="list-disc space-y-1 pl-6 text-ink">
            {p.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <h3 className="text-xl font-bold text-royal-dark">Stories that happened here</h3>
          <ul className="space-y-2">
            {p.stories.map((s) => (
              <li key={s.title} className="flex flex-wrap items-center gap-2">
                {s.lesson ? (
                  <Link href={`/lessons/${s.lesson}`} className="inline-flex min-h-11 items-center rounded-full bg-sun px-4 font-display font-bold text-ink">
                    {s.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink">{s.title}</span>
                )}
                <Link href={refHref(s.ref)} className="inline-flex min-h-10 items-center text-sm font-bold text-royal underline">
                  {s.ref}
                </Link>
              </li>
            ))}
          </ul>
          <PrimaryButton href="/games/map-hunt" tone="royal">
            Play the Map Treasure Hunt
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
