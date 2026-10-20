"use client";

import { useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { Mascot } from "@/components/characters/Mascot";
import { play } from "@/lib/audio/sfx";

/** Ephesians 6:14-17. Armour is a picture of God's strength, not a reason to fight people. */
const PIECES = [
  { id: "belt", name: "Belt of truth", slot: "waist", meaning: "Being honest and holding on to what God says is true.", x: 100, y: 160, color: "#b9741a" },
  { id: "breastplate", name: "Breastplate of righteousness", slot: "chest", meaning: "Doing what's right protects our hearts.", x: 100, y: 140, color: "#9aa5b8" },
  { id: "shoes", name: "Shoes of the good news of peace", slot: "feet", meaning: "Being ready to share God's peace wherever we go.", x: 100, y: 192, color: "#7a4a1d" },
  { id: "shield", name: "Shield of faith", slot: "arm", meaning: "Trusting God helps us when we feel worried or tempted.", x: 48, y: 150, color: "#2a48d4" },
  { id: "helmet", name: "Helmet of salvation", slot: "head", meaning: "Remembering that God has rescued us and we belong to him.", x: 100, y: 34, color: "#ffd23f" },
  { id: "sword", name: "Sword of the Spirit, which is God's word", slot: "hand", meaning: "Knowing the Bible helps us know what is true.", x: 158, y: 150, color: "#c9d3e6" },
];
const SLOTS = [
  { id: "head", label: "Head" },
  { id: "chest", label: "Chest" },
  { id: "waist", label: "Waist" },
  { id: "arm", label: "Left arm" },
  { id: "hand", label: "Right hand" },
  { id: "feet", label: "Feet" },
];

export default function ArmorOfGod({ onFinish }: GameProps) {
  const [sel, setSel] = useState<string | null>(null);
  const [on, setOn] = useState<string[]>([]);
  const [msg, setMsg] = useState("Tap a piece of armour, then tap where it goes on Leo.");
  const [misses, setMisses] = useState(0);

  function putOn(slot: string) {
    if (!sel) return;
    const piece = PIECES.find((p) => p.id === sel)!;
    if (piece.slot === slot) {
      play("correct");
      const next = [...on, piece.id];
      setOn(next);
      setSel(null);
      setMsg(`${piece.name}: ${piece.meaning}`);
      if (next.length === PIECES.length)
        setTimeout(() => onFinish({ won: true, score: Math.max(1, 100 - misses * 5), message: "Leo is wearing the whole armour of God! Ephesians 6 uses armour as a picture: God gives us truth, faith and his word to stand strong. It's about God's strength, never about hurting people." }), 900);
    } else {
      play("gentle");
      setMisses((m) => m + 1);
      setMsg("Hmm, not there. Where would that piece go?");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
      <div className="relative mx-auto w-full max-w-xs">
        <svg viewBox="0 0 200 220" className="w-full" role="img" aria-label={`Leo wearing ${on.length} of 6 armour pieces`}>
          <foreignObject x="0" y="0" width="200" height="220">
            <Mascot id="leo" size={200} animate="none" expression={on.length === 6 ? "proud" : "happy"} />
          </foreignObject>
          {on.includes("helmet") && <path d="M58 46 q42 -44 84 0 l-6 8 q-36 -26 -72 0 z" fill="#ffd23f" stroke="#b9741a" strokeWidth="2" />}
          {on.includes("breastplate") && <path d="M72 150 q28 -10 56 0 l-4 26 q-24 8 -48 0 z" fill="#c9d3e6" stroke="#7a869e" strokeWidth="2" />}
          {on.includes("belt") && <rect x="66" y="176" width="68" height="9" rx="4" fill="#b9741a" />}
          {on.includes("shoes") && (
            <g fill="#7a4a1d">
              <ellipse cx="78" cy="190" rx="16" ry="9" />
              <ellipse cx="122" cy="190" rx="16" ry="9" />
            </g>
          )}
          {on.includes("shield") && (
            <g transform="translate(30 132)">
              <path d="M0 0 h36 v24 q-18 22 -36 0 z" fill="#2a48d4" stroke="#fff" strokeWidth="3" />
              <path d="M18 6 v26 M8 16 h20" stroke="#ffd23f" strokeWidth="4" />
            </g>
          )}
          {on.includes("sword") && (
            <g transform="translate(160 110) rotate(20)">
              <rect x="-3" y="0" width="6" height="56" fill="#c9d3e6" />
              <rect x="-10" y="40" width="20" height="5" fill="#b9741a" />
            </g>
          )}
        </svg>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SLOTS.map((s) => (
            <button key={s.id} type="button" onClick={() => putOn(s.id)} disabled={!sel} className={`min-h-12 rounded-xl border-2 font-bold ${sel ? "border-royal bg-royal-soft text-royal-dark" : "border-ink/10 bg-white text-ink-soft"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 min-h-12 rounded-2xl bg-sky-soft p-3 font-semibold text-royal-dark" aria-live="polite">
          {msg}
        </p>
        <div className="grid gap-2">
          {PIECES.filter((p) => !on.includes(p.id)).map((p) => (
            <button key={p.id} type="button" aria-pressed={sel === p.id} onClick={() => { setSel(p.id); play("tap"); }} className={`flex min-h-14 items-center gap-3 rounded-2xl border-4 bg-white px-4 text-left font-display font-semibold ${sel === p.id ? "border-royal ring-4 ring-sun" : "border-royal-soft"}`}>
              <span className="h-6 w-6 rounded-full" style={{ background: p.color }} aria-hidden />
              {p.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">Ephesians 6:13-17 describes &quot;the whole armor of God&quot; (World English Bible) as a picture of how God helps us stand strong.</p>
      </div>
    </div>
  );
}
