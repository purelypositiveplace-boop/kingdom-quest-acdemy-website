"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { GameProps } from "@/lib/games/types";
import { Mascot } from "@/components/characters/Mascot";
import { play } from "@/lib/audio/sfx";
import { QuizQuestion } from "@/components/lessons/QuizQuestion";
import type { QuizQuestion as Q } from "@/lib/curriculum/types";

/** Questions at each treasure chest walk through Jonah's story in order (Jonah 1–4). */
const CHESTS: Q[] = [
  { id: "jo1", q: "What happened first?", choices: ["God told Jonah to go to Nineveh", "A great fish swallowed Jonah", "Nineveh turned to God"], answer: 0, explain: "Jonah 1:1-2 — God sent Jonah to Nineveh.", difficulty: 1 },
  { id: "jo2", q: "What did Jonah do next?", choices: ["He got on a ship going the other way", "He went straight to Nineveh", "He built an ark"], answer: 0, explain: "Jonah 1:3 — he ran away on a ship.", difficulty: 1 },
  { id: "jo3", q: "Inside the great fish, what did Jonah do?", choices: ["He prayed to God", "He went to sleep for a year", "He sang to the sailors"], answer: 0, explain: "Jonah 2 is Jonah's prayer from inside the fish.", difficulty: 1 },
  { id: "jo4", q: "What happened when Jonah finally preached in Nineveh?", choices: ["The people turned to God and God showed mercy", "Nobody listened", "Jonah ran away again"], answer: 0, explain: "Jonah 3:10 — God saw they turned from their evil ways.", difficulty: 2 },
];

const CREATURES = ["sea turtle", "octopus", "seahorse", "clownfish", "starfish", "dolphin"];
type Item = { id: number; kind: "star" | "jelly" | "chest" | "creature"; x: number; lane: number; label?: string };
const LANES = 4;

/**
 * A gentle underwater swim. Jellyfish are friendly obstacles: bumping one just makes Finn
 * wobble. Collect stars, discover creatures, and answer a story question at each chest.
 */
export default function JonahOcean({ level, paused, onFinish }: GameProps) {
  const [lane, setLane] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const [stars, setStars] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [chest, setChest] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [wobble, setWobble] = useState(false);
  const idRef = useRef(0);
  const itemsRef = useRef<Item[]>([]);
  const tickRef = useRef(0);
  const laneRef = useRef(lane);
  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);
  const speed = level === "disciples" ? 0.6 : level === "explorers" ? 0.85 : 1.1;
  const stopped = paused || chest !== null;

  const move = useCallback((d: number) => setLane((l) => Math.max(0, Math.min(LANES - 1, l + d))), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  useEffect(() => {
    if (stopped) return;
    const t = setInterval(() => {
      tickRef.current++;
      const tick = tickRef.current;
      let next = itemsRef.current.map((it) => ({ ...it, x: it.x - speed * 1.6 })).filter((it) => it.x > -8);
      if (tick % 22 === 0) next.push({ id: idRef.current++, kind: "star", x: 105, lane: Math.floor(Math.random() * LANES) });
      if (tick % 37 === 0) next.push({ id: idRef.current++, kind: "jelly", x: 105, lane: Math.floor(Math.random() * LANES) });
      if (tick % 53 === 0) next.push({ id: idRef.current++, kind: "creature", x: 105, lane: Math.floor(Math.random() * LANES), label: CREATURES[Math.floor(Math.random() * CREATURES.length)] });
      if (tick % 140 === 0) next.push({ id: idRef.current++, kind: "chest", x: 105, lane: Math.floor(Math.random() * LANES) });
      // collisions near Finn (about 12% from the left)
      const hit = next.filter((it) => it.lane === laneRef.current && it.x < 18 && it.x > 6);
      if (hit.length) next = next.filter((it) => !hit.includes(it));
      itemsRef.current = next;
      setItems(next);
      for (const h of hit) {
        if (h.kind === "star") {
          setStars((s) => s + 1);
          play("bubble");
        } else if (h.kind === "jelly") {
          setWobble(true);
          setTimeout(() => setWobble(false), 500);
        } else if (h.kind === "creature" && h.label) {
          const label = h.label;
          setFound((f) => (f.includes(label) ? f : [...f, label]));
          play("star");
        } else if (h.kind === "chest") setChest((c) => c ?? 0);
      }
    }, 50);
    return () => clearInterval(t);
  }, [stopped, speed]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-ink">
        <span>Stars: {stars}</span>
        <span>
          Story chests: {answered} / {CHESTS.length}
        </span>
        <span>Creatures met: {found.length}</span>
      </div>
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#2bb3d6] to-[#0e5f96]" role="application" aria-label="Underwater game. Use the up and down arrow keys or the buttons to swim.">
        {Array.from({ length: 12 }, (_, k) => (
          <span key={k} className="animate-bubble absolute bottom-0 h-3 w-3 rounded-full bg-white/40" style={{ left: `${(k * 83) % 100}%`, animationDelay: `${k * 0.5}s` }} />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-[#e8d39a]" />
        {items.map((it) => (
          <div key={it.id} className="absolute -translate-y-1/2" style={{ left: `${it.x}%`, top: `${((it.lane + 0.5) / LANES) * 90}%` }} aria-hidden>
            {it.kind === "star" && <svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 2 l3 7 h7 l-6 4.5 l2.5 7.5 l-6.5 -4.5 l-6.5 4.5 l2.5 -7.5 l-6 -4.5 h7 z" fill="#ffd23f" /></svg>}
            {it.kind === "jelly" && (
              <svg width="38" height="44" viewBox="0 0 38 44">
                <path d="M2 20 q17 -30 34 0 z" fill="#ff8fc1" opacity="0.85" />
                <circle cx="13" cy="14" r="2" fill="#1f2547" />
                <circle cx="25" cy="14" r="2" fill="#1f2547" />
                {[8, 16, 24, 32].map((x) => <path key={x} d={`M${x} 20 q-3 10 0 20`} stroke="#ff8fc1" strokeWidth="2" fill="none" />)}
              </svg>
            )}
            {it.kind === "creature" && <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-royal-dark">{it.label}</span>}
            {it.kind === "chest" && (
              <svg width="44" height="36" viewBox="0 0 44 36">
                <rect x="2" y="12" width="40" height="22" rx="3" fill="#a0673a" />
                <path d="M2 14 q20 -16 40 0" fill="#c98a52" />
                <rect x="18" y="16" width="8" height="8" fill="#ffd23f" />
              </svg>
            )}
          </div>
        ))}
        <div className={`absolute left-[6%] -translate-y-1/2 transition-[top] duration-150 ${wobble ? "animate-[wiggle_0.4s_ease-in-out]" : ""}`} style={{ top: `${((lane + 0.5) / LANES) * 90}%` }}>
          <Mascot id="finn" size={70} animate="none" expression="excited" />
        </div>
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Swim up" className="tap-target flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow">
            <ChevronUp size={36} aria-hidden />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Swim down" className="tap-target flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow">
            <ChevronDown size={36} aria-hidden />
          </button>
        </div>
        {chest !== null && (
          <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-royal-dark/60 p-3">
            <div className="w-full max-w-lg">
              <QuizQuestion
                q={CHESTS[answered]}
                guide="finn"
                onAnswered={() =>
                  setTimeout(() => {
                    const a = answered + 1;
                    setAnswered(a);
                    setChest(null);
                    if (a === CHESTS.length)
                      onFinish({ won: true, score: stars * 5 + found.length * 10, message: `You told Jonah's whole story in order, collected ${stars} stars and met ${found.length} sea creatures! God showed mercy to Jonah and to Nineveh.` });
                  }, 1600)
                }
              />
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-ink-soft">The pink jellyfish are friendly. Bumping one just makes Finn wobble!</p>
    </div>
  );
}
