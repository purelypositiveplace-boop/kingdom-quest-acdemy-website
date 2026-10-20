"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { WORLDS, STARTER_WORLDS } from "@/data/worlds";
import { LESSONS } from "@/lib/curriculum";
import { useKQ } from "@/lib/progress/store";
import { Mascot } from "@/components/characters/Mascot";
import { worldArt, worldMapArt } from "@/lib/art";

/**
 * Kingdom Quest World: a golden academy castle at the centre of a magical kingdom, with winding
 * paths to ten Bible lands. Locations are real links (keyboard + touch); the art is decorative.
 */
export function AdventureMap() {
  const done = useKQ((s) => s.progress.lessons);
  const current = useKQ((s) => s.profile?.world);
  const stats = WORLDS.map((w) => {
    const ls = LESSONS.filter((l) => l.world === w.id);
    return { w, total: ls.length, done: ls.filter((l) => done[l.id]).length };
  });
  const mapImg = worldMapArt();
  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-[var(--shadow-card)]" style={{ aspectRatio: "16 / 11" }}>
      {mapImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mapImg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      )}
      {!mapImg && (
      <svg viewBox="0 0 1000 690" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="map-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd3ff" />
            <stop offset="1" stopColor="#d8f4c8" />
          </linearGradient>
          <linearGradient id="map-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe27a" />
            <stop offset="1" stopColor="#f0a92e" />
          </linearGradient>
        </defs>
        <rect width="1000" height="690" fill="url(#map-sky)" />
        <path d="M0 160 Q250 90 500 150 T1000 130 V690 H0 Z" fill="#9ee29a" />
        <path d="M0 300 Q300 230 600 290 T1000 270 V690 H0 Z" fill="#7fd67f" />
        {/* sea in the lower left for Noah's harbor */}
        <path d="M0 360 Q80 380 120 460 Q150 560 60 690 H0 Z" fill="#5fb8ff" />
        <path d="M10 430 q20 -8 40 0 M20 520 q20 -8 40 0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.6" />
        {/* lake for Galilee */}
        <ellipse cx="820" cy="170" rx="70" ry="40" fill="#5fc4ff" />
        {/* desert for Egypt */}
        <path d="M200 690 Q260 560 420 560 Q520 560 520 690 Z" fill="#f6d58a" />
        {/* winding paths from the castle */}
        <g stroke="#f6dfa5" strokeWidth="18" fill="none" strokeLinecap="round" strokeDasharray="1 0">
          {WORLDS.map((w) => (
            <path key={w.id} d={`M500 330 Q ${(500 + w.x * 10) / 2} ${(330 + w.y * 6.9) / 2 + 40} ${w.x * 10} ${w.y * 6.9}`} />
          ))}
        </g>
        {/* castle */}
        <g transform="translate(430 210)">
          <g fill="url(#map-gold)" stroke="#d08a20" strokeWidth="3">
            <rect x="0" y="50" width="34" height="90" />
            <rect x="106" y="50" width="34" height="90" />
            <rect x="26" y="26" width="88" height="114" />
            <rect x="52" y="0" width="36" height="140" />
          </g>
          <path d="M70 0 v-26" stroke="#b9741a" strokeWidth="3" />
          <path d="M70 -26 l22 7 l-22 7 z" fill="#ff7a59" />
          <path d="M58 140 v-28 a12 12 0 0 1 24 0 v28 z" fill="#2a48d4" />
        </g>
        {/* trees and flowers */}
        {[[120, 250], [300, 210], [680, 240], [900, 360], [620, 520], [760, 600], [330, 420]].map(([x, y]) => (
          <g key={`${x}`} transform={`translate(${x} ${y})`}>
            <rect x="-4" y="0" width="8" height="22" fill="#9b6a3a" />
            <circle cy="-6" r="20" fill="#2f9d4e" />
            <circle cx="-12" cy="4" r="13" fill="#3fb35f" />
            <circle cx="12" cy="2" r="14" fill="#3fb35f" />
          </g>
        ))}
      </svg>
      )}

      <div className="absolute left-1/2 top-[52%] z-30 -translate-x-1/2">
        <p className="rounded-full bg-white/90 px-4 py-1 text-center font-display text-sm font-bold text-gold-dark shadow md:text-base">Kingdom Quest Academy</p>
      </div>
      <div className="absolute bottom-2 right-2 z-10 hidden md:block">
        <Mascot id="leo" size={110} expression="excited" animate="bounce" />
      </div>

      {stats.map(({ w, total, done: d }) => {
        const complete = total > 0 && d === total;
        return (
          <Link
            key={w.id}
            href={`/world/${w.id}`}
            data-testid={`map-${w.id}`}
            className="group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${w.x}%`, top: `${w.y}%` }}
            aria-label={`${w.name}: ${d} of ${total} lessons done`}
          >
            <span
              className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-[var(--shadow-toy)] transition group-hover:scale-110 group-focus-visible:scale-110 md:h-20 md:w-20"
              style={{ background: `radial-gradient(circle at 35% 30%, #ffffff88, transparent 45%), ${w.color}` }}
            >
              {worldArt(w.id) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={worldArt(w.id)} alt="" className="h-[130%] w-[130%] max-w-none object-contain" />
              ) : complete ? (
                <Check className="h-7 w-7 text-white md:h-10 md:w-10" aria-hidden />
              ) : (
                <Star className="h-7 w-7 text-white md:h-9 md:w-9" fill="#fff" aria-hidden />
              )}
              {complete && worldArt(w.id) && <Check className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-emerald p-1 text-white" aria-hidden />}
              {current === w.id && <span className="absolute -top-3 rounded-full bg-sun px-2 text-[10px] font-bold text-ink shadow md:text-xs">You</span>}
              {STARTER_WORLDS.includes(w.id) && d === 0 && <span className="absolute -bottom-2 rounded-full bg-coral px-2 text-[10px] font-bold text-white shadow">Start</span>}
            </span>
            <span className="mt-1 max-w-[7rem] rounded-full bg-white/95 px-2 py-0.5 text-center font-display text-[11px] font-bold leading-tight text-royal-dark shadow md:max-w-none md:text-sm">
              {w.name}
            </span>
            <span className="text-[10px] font-bold text-ink md:text-xs">
              {d}/{total}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
