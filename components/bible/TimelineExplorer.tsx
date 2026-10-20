"use client";

import { useState } from "react";
import Link from "next/link";
import { TIMELINE, DATE_NOTE, type TimelineFilter } from "@/data/timeline";
import { CHARACTER_BY_ID, CHARACTERS } from "@/data/characters";

const ERA_COLORS: Record<TimelineFilter, string> = { "Old Testament": "#f0a92e", "Life of Jesus": "#ff7a59", "Early Church": "#6c7bff" };

export function TimelineExplorer() {
  const [filter, setFilter] = useState<TimelineFilter | "All" | "Bible Characters">("All");
  const [person, setPerson] = useState<string>("");
  const [open, setOpen] = useState<string | null>(null);
  const events = TIMELINE.filter((e) => (filter === "All" || filter === "Bible Characters" ? true : e.era === filter) && (filter !== "Bible Characters" || !person || e.people.includes(person)));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(["All", "Old Testament", "Life of Jesus", "Early Church", "Bible Characters"] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`min-h-11 rounded-full px-4 font-display font-semibold ${filter === f ? "bg-royal text-white" : "bg-white text-royal-dark shadow-sm"}`}>
            {f}
          </button>
        ))}
        {filter === "Bible Characters" && (
          <select value={person} onChange={(e) => setPerson(e.target.value)} aria-label="Choose a Bible person" className="min-h-11 rounded-full bg-white px-4 font-semibold shadow-sm">
            <option value="">Everyone</option>
            {CHARACTERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <p className="rounded-2xl bg-sun/20 p-3 text-sm text-ink">{DATE_NOTE}</p>
      <ol className="relative space-y-4 border-l-8 border-royal-soft pl-6">
        {events.map((e, i) => (
          <li key={e.id} className="relative">
            <span className="absolute -left-[2.6rem] top-4 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white font-bold text-white shadow" style={{ background: ERA_COLORS[e.era] }}>
              {TIMELINE.indexOf(e) + 1}
            </span>
            <button type="button" onClick={() => setOpen(open === e.id ? null : e.id)} aria-expanded={open === e.id} className="card w-full p-4 text-left transition hover:-translate-y-0.5">
              <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: ERA_COLORS[e.era] }}>
                {e.era}
                {e.when ? ` · ${e.when}` : ""}
              </span>
              <span className="block font-display text-xl font-bold text-royal-dark">{e.title}</span>
              <span className="text-sm text-ink-soft">{e.ref}</span>
            </button>
            {open === e.id && (
              <div className="mt-2 space-y-2 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-ink">{e.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {e.lesson && (
                    <Link href={`/lessons/${e.lesson}`} className="inline-flex min-h-10 items-center rounded-full bg-sun px-4 font-bold text-ink">
                      Open the lesson
                    </Link>
                  )}
                  {e.people.map((p) =>
                    CHARACTER_BY_ID[p] ? (
                      <Link key={p} href={`/characters/${p}`} className="inline-flex min-h-10 items-center rounded-full bg-royal-soft px-4 font-bold text-royal-dark">
                        {CHARACTER_BY_ID[p].name}
                      </Link>
                    ) : null,
                  )}
                </div>
              </div>
            )}
            {i === events.length - 1 && <span className="sr-only">End of timeline</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
