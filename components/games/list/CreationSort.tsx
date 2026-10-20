"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";
import { SceneArt } from "@/components/bible/SceneArt";
import type { SceneProp, SceneTheme } from "@/lib/curriculum/types";

/** The seven days, following Genesis 1:1–2:3. */
export const CREATION_DAYS: { day: number; label: string; short: string; theme: SceneTheme; props: SceneProp[] }[] = [
  { day: 1, label: "Light: day and night", short: "Light", theme: "dawn", props: ["light"] },
  { day: 2, label: "The sky between the waters", short: "Sky", theme: "sky", props: ["clouds"] },
  { day: 3, label: "Land, seas and plants", short: "Land & plants", theme: "garden", props: ["trees", "flowers"] },
  { day: 4, label: "Sun, moon and stars", short: "Sun, moon & stars", theme: "night", props: ["moon", "stars"] },
  { day: 5, label: "Fish and birds", short: "Fish & birds", theme: "sea", props: ["fish", "birds"] },
  { day: 6, label: "Animals and people", short: "Animals & people", theme: "hills", props: ["animals", "people"] },
  { day: 7, label: "God rests", short: "God rests", theme: "rainbow", props: ["sun"] },
];

/**
 * Creation Seven-Day Sort. Two ways to play: tap a card and then tap a day (works everywhere,
 * including keyboard and screen readers), or drag a card onto a day with a mouse.
 */
export default function CreationSort({ level, onFinish }: GameProps) {
  const pool = useMemo(() => shuffle(CREATION_DAYS), []);
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [msg, setMsg] = useState("Tap a picture, then tap the day it belongs to.");
  const [misses, setMisses] = useState(0);
  const remaining = pool.filter((c) => !Object.values(placed).includes(c.day));

  function place(cardDay: number, slotDay: number) {
    if (placed[slotDay]) return;
    if (cardDay === slotDay) {
      const next = { ...placed, [slotDay]: cardDay };
      setPlaced(next);
      setSelected(null);
      play("correct");
      setMsg(`Yes! Day ${slotDay}: ${CREATION_DAYS[slotDay - 1].label}.`);
      if (Object.keys(next).length === 7)
        setTimeout(
          () =>
            onFinish({
              won: true,
              score: Math.max(1, 100 - misses * 10),
              message: "You put all seven days of creation in order, just like Genesis 1 tells it. On the seventh day God rested and blessed the day.",
            }),
          600,
        );
    } else {
      setMisses((m) => m + 1);
      play("gentle");
      const hint = CREATION_DAYS[cardDay - 1];
      setMsg(level === "disciples" ? "Not that day. Try another one!" : `Not quite. Think: what did God make before ${hint.short.toLowerCase()}?`);
    }
  }

  return (
    <div>
      <p className="mb-4 rounded-2xl bg-sky-soft p-3 text-center text-lg font-semibold text-royal-dark" aria-live="polite" data-testid="sort-message">
        {msg}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7" role="group" aria-label="Days of creation">
        {CREATION_DAYS.map((d) => {
          const filled = placed[d.day];
          return (
            <button
              key={d.day}
              type="button"
             
              data-testid={`slot-${d.day}`}
              aria-label={filled ? `Day ${d.day}: ${d.label}` : `Day ${d.day}, empty${selected ? ". Place the selected card here" : ""}`}
              onClick={() => selected !== null && place(selected, d.day)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const card = Number(e.dataTransfer.getData("text/plain"));
                if (card) place(card, d.day);
              }}
              className={`flex min-h-36 flex-col overflow-hidden rounded-2xl border-4 text-left transition ${filled ? "border-emerald bg-white" : selected ? "border-dashed border-royal bg-royal-soft animate-pulse" : "border-dashed border-ink/20 bg-white/60"}`}
            >
              <span className={`px-2 py-1 font-display text-lg font-bold ${filled ? "bg-emerald text-white" : "text-royal-dark"}`}>Day {d.day}</span>
              {filled ? (
                <span className="flex flex-1 flex-col">
                  <SceneArt theme={d.theme} props={d.props} alt={d.label} className="h-20 w-full" />
                  <span className="p-2 text-sm font-bold text-ink">{d.short}</span>
                </span>
              ) : (
                <span className="flex flex-1 items-center justify-center p-2 text-sm text-ink-soft">{selected ? "Place here" : "?"}</span>
              )}
            </button>
          );
        })}
      </div>

      <h3 className="mb-2 mt-6 font-display text-xl font-bold text-royal-dark">Pictures to place</h3>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Cards to sort">
        {remaining.map((c) => (
          <button
            key={c.day}
            type="button"
           
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(c.day))}
            onClick={() => {
              setSelected(selected === c.day ? null : c.day);
              play("tap");
              setMsg(`Now tap the day for "${c.short}".`);
            }}
            aria-pressed={selected === c.day}
            data-testid={`card-${c.day}`}
            className={`w-36 overflow-hidden rounded-2xl border-4 bg-white text-left shadow-md transition hover:-translate-y-1 ${selected === c.day ? "border-royal ring-4 ring-sun" : "border-white"}`}
          >
            <SceneArt theme={c.theme} props={c.props} alt="" className="h-20 w-full" />
            <span className="block p-2 font-display font-bold text-ink">{level === "disciples" ? c.short : c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
