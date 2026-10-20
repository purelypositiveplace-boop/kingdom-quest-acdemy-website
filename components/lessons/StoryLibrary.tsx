"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { LESSONS, categoriesWithLessons } from "@/lib/curriculum";
import { LEVEL_LIST } from "@/lib/curriculum/levels";
import type { AgeLevel } from "@/lib/curriculum/types";
import { StoryCard } from "@/components/ui/Cards";
import { EmptyState } from "@/components/ui/states";
import { useKQ } from "@/lib/progress/store";
import { useLevel } from "@/lib/progress/useLevel";
import { SceneArt } from "@/components/bible/SceneArt";

export function StoryLibrary() {
  const params = useSearchParams();
  const myLevel = useLevel();
  const done = useKQ((s) => s.progress.lessons);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState(params.get("category") ?? "all");
  const [testament, setTestament] = useState<"all" | "OT" | "NT">("all");
  const [age, setAge] = useState<AgeLevel | "all">("all");
  const [time, setTime] = useState<"all" | "short" | "long">("all");
  const cats = categoriesWithLessons();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LESSONS.filter((l) => {
      if (cat !== "all" && l.category !== cat) return false;
      if (testament !== "all" && l.testament !== testament) return false;
      if (age !== "all" && !l.ages.includes(age)) return false;
      const mins = l.minutes[age === "all" ? myLevel : age];
      if (time === "short" && mins > 8) return false;
      if (time === "long" && mins <= 8) return false;
      if (!term) return true;
      return [l.title, l.summary, ...l.refs, ...l.topics, ...l.characters].join(" ").toLowerCase().includes(term);
    });
  }, [q, cat, testament, age, time, myLevel]);

  const clear = () => {
    setQ("");
    setCat("all");
    setTestament("all");
    setAge("all");
    setTime("all");
  };

  const chip = (active: boolean) => `min-h-11 rounded-full px-4 font-display font-semibold transition ${active ? "bg-royal text-white" : "bg-white text-royal-dark shadow-sm hover:bg-royal-soft"}`;

  return (
    <div className="space-y-6">
      {/* big picture categories for younger children */}
      <div className="flex snap-x gap-3 overflow-x-auto pb-2" role="group" aria-label="Story topics">
        <button type="button" onClick={() => setCat("all")} className={`snap-start shrink-0 overflow-hidden rounded-3xl border-4 bg-white text-left ${cat === "all" ? "border-royal" : "border-transparent"}`}>
          <span className="flex h-20 w-36 items-center justify-center bg-royal-soft font-display text-3xl font-bold text-royal">All</span>
          <span className="block px-3 py-2 font-display text-sm font-bold text-ink">All stories</span>
        </button>
        {cats.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`snap-start shrink-0 overflow-hidden rounded-3xl border-4 bg-white text-left ${cat === c.id ? "border-royal" : "border-transparent"}`}>
            <SceneArt theme={c.theme} props={c.lessons[0]?.scenes[0]?.props?.slice(0, 2)} alt="" className="h-20 w-36" />
            <span className="block w-36 px-3 py-2 font-display text-sm font-bold leading-tight text-ink">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="card space-y-4 p-4">
        <label className="relative block">
          <span className="sr-only">Search Bible stories</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories, people or Bible books (try 'Moses')" className="w-full rounded-full border-4 border-royal-soft bg-white py-3 pl-12 pr-4 text-lg outline-none focus:border-royal" data-testid="story-search" />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Filters">
          {(["all", "OT", "NT"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTestament(t)} className={chip(testament === t)} aria-pressed={testament === t}>
              {t === "all" ? "Both Testaments" : t === "OT" ? "Old Testament" : "New Testament"}
            </button>
          ))}
          <select value={age} onChange={(e) => setAge(e.target.value as AgeLevel | "all")} className="min-h-11 rounded-full bg-white px-4 font-display font-semibold text-royal-dark shadow-sm" aria-label="Age level">
            <option value="all">All ages</option>
            {LEVEL_LIST.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.ages})
              </option>
            ))}
          </select>
          <select value={time} onChange={(e) => setTime(e.target.value as "all" | "short" | "long")} className="min-h-11 rounded-full bg-white px-4 font-display font-semibold text-royal-dark shadow-sm" aria-label="Time">
            <option value="all">Any length</option>
            <option value="short">Quick (8 min or less)</option>
            <option value="long">Longer</option>
          </select>
          <button type="button" onClick={clear} className="flex min-h-11 items-center gap-1 rounded-full px-4 font-semibold text-ink-soft underline">
            <X size={16} aria-hidden /> Clear
          </button>
        </div>
      </div>

      <p className="font-semibold text-ink-soft" aria-live="polite">
        {results.length} {results.length === 1 ? "story" : "stories"}
      </p>
      {results.length === 0 ? (
        <EmptyState title="No stories found" message="Try a different word, like 'Noah' or 'Jesus', or clear the filters." action={<button type="button" onClick={clear} className="btn-toy bg-royal text-white">Show all stories</button>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => (
            <StoryCard key={l.id} lesson={l} done={Boolean(done[l.id])} minutes={l.minutes[age === "all" ? myLevel : age]} />
          ))}
        </div>
      )}
    </div>
  );
}
