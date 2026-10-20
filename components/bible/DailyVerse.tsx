"use client";

import { useEffect, useState } from "react";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { ScriptureText } from "@/components/ui/ScriptureText";

/** Same verse for everyone on a given day; changes at local midnight. */
export function dailyVerseIndex(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return day % MEMORY_VERSES.length;
}

export function weeklyVerseIndex(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return (Math.floor(day / 7) * 7 + 3) % MEMORY_VERSES.length;
}

export function DailyVerse({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => setI(dailyVerseIndex()), []);
  const v = MEMORY_VERSES[i ?? 0];
  return (
    <div className={i === null ? "opacity-0" : "transition-opacity"}>
      <ScriptureText refText={v.ref} size={size} />
      <p className="mt-3 text-ink-soft">
        <span className="font-bold text-royal-dark">What it means: </span>
        {v.meaning}
      </p>
    </div>
  );
}
