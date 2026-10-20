"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Gamepad2, Heart, Map, Printer, ScrollText, Search, Sparkles, Users } from "lucide-react";
import { search, type ResultType } from "@/lib/search";
import { LEVEL_LIST } from "@/lib/curriculum/levels";
import type { AgeLevel } from "@/lib/curriculum/types";
import { EmptyState } from "@/components/ui/states";

const TYPES: { t: ResultType; icon: typeof BookOpen; color: string }[] = [
  { t: "Lesson", icon: BookOpen, color: "#ff7a59" },
  { t: "Bible person", icon: Users, color: "#ff8a5c" },
  { t: "Game", icon: Gamepad2, color: "#8c6bff" },
  { t: "Bible book", icon: ScrollText, color: "#2a48d4" },
  { t: "Memory verse", icon: Sparkles, color: "#f0a92e" },
  { t: "Value", icon: Heart, color: "#ff7eb6" },
  { t: "Place", icon: Map, color: "#e0a045" },
  { t: "Printable", icon: Printer, color: "#2ec4c4" },
];

export function SearchView() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [type, setType] = useState<ResultType | "all">("all");
  const [testament, setTestament] = useState<"all" | "OT" | "NT">("all");
  const [age, setAge] = useState<AgeLevel | "all">("all");
  const [time, setTime] = useState(0);
  const results = useMemo(() => (q.trim() || type !== "all" ? search(q, { type, testament, age, maxMinutes: time || undefined }) : []), [q, type, testament, age, time]);

  return (
    <div className="space-y-5">
      <label className="relative block">
        <span className="sr-only">Search</span>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus placeholder="Try: Noah, courage, Psalms, Bethlehem" className="w-full rounded-full border-4 border-royal-soft bg-white py-4 pl-12 pr-4 text-xl outline-none focus:border-royal" data-testid="site-search" />
      </label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="group" aria-label="What are you looking for?">
        {TYPES.map(({ t, icon: Icon, color }) => (
          <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(type === t ? "all" : t)} className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl p-2 text-xs font-bold ${type === t ? "bg-royal text-white" : "bg-white text-ink shadow-sm"}`}>
            <Icon size={26} color={type === t ? "#fff" : color} aria-hidden />
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <select value={testament} onChange={(e) => setTestament(e.target.value as "all" | "OT" | "NT")} aria-label="Testament" className="min-h-11 rounded-full bg-white px-4 font-semibold shadow-sm">
          <option value="all">Both Testaments</option>
          <option value="OT">Old Testament</option>
          <option value="NT">New Testament</option>
        </select>
        <select value={age} onChange={(e) => setAge(e.target.value as AgeLevel | "all")} aria-label="Age" className="min-h-11 rounded-full bg-white px-4 font-semibold shadow-sm">
          <option value="all">All ages</option>
          {LEVEL_LIST.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <select value={time} onChange={(e) => setTime(Number(e.target.value))} aria-label="Time" className="min-h-11 rounded-full bg-white px-4 font-semibold shadow-sm">
          <option value={0}>Any time</option>
          <option value={6}>6 minutes or less</option>
          <option value={10}>10 minutes or less</option>
        </select>
      </div>
      {!q.trim() && type === "all" ? (
        <p className="text-ink-soft">Type a word, or tap a picture above to browse.</p>
      ) : results.length === 0 ? (
        <EmptyState title="Hmm, nothing found" message="Try a shorter word, check the spelling, or pick a different picture above." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2" aria-live="polite">
          {results.slice(0, 60).map((r) => {
            const T = TYPES.find((x) => x.t === r.type)!;
            return (
              <li key={`${r.type}-${r.title}`}>
                <Link href={r.href} className="card flex items-start gap-3 p-4 hover:-translate-y-0.5">
                  <T.icon size={28} color={T.color} className="mt-1 shrink-0" aria-hidden />
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-ink-soft">{r.type}</span>
                    <span className="block font-display text-lg font-bold text-royal-dark">{r.title}</span>
                    <span className="line-clamp-2 text-sm text-ink-soft">{r.text}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
