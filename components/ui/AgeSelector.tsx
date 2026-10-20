"use client";

import { useRouter } from "next/navigation";
import { LEVEL_LIST } from "@/lib/curriculum/levels";
import type { AgeLevel } from "@/lib/curriculum/types";
import { Mascot } from "@/components/characters/Mascot";
import { useKQ } from "@/lib/progress/store";

/** Three big level cards. Picking one saves the level and (optionally) moves on. */
export function AgeSelector({ goTo, onPick, selected }: { goTo?: string; onPick?: (l: AgeLevel) => void; selected?: AgeLevel }) {
  const setProfile = useKQ((s) => s.setProfile);
  const router = useRouter();
  return (
    <div role="radiogroup" aria-label="Choose a learning level" className="grid gap-4 md:grid-cols-3">
      {LEVEL_LIST.map((l, i) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={selected === l.id}
          data-testid={`level-${l.id}`}
          onClick={() => {
            setProfile({ level: l.id });
            onPick?.(l.id);
            if (goTo) router.push(goTo);
          }}
          className={`card group flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-1 hover:shadow-xl ${selected === l.id ? "ring-4 ring-royal" : ""}`}
          style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${l.color} 22%, white), white)` }}
        >
          <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white" style={{ background: l.color }}>
            {l.short}
          </span>
          <Mascot id={l.guide} size={110} animate={i === 1 ? "bounce" : "idle"} expression="happy" />
          <span className="font-display text-2xl font-bold text-royal-dark">{l.name}</span>
          <span className="font-display text-lg font-semibold text-ink">{l.ages}</span>
          <span className="text-sm text-ink-soft">{l.focus}</span>
        </button>
      ))}
    </div>
  );
}
