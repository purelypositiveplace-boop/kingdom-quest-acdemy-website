"use client";

import { PLACES, HOLY_LAND_BOX, type Place } from "@/data/places";

/**
 * Simplified, hand-drawn style map of Bible lands with an inset of ancient Israel.
 * Every marker is a real button (keyboard + touch). Positions are approximate.
 */
export function BibleMap({ selected, onSelect, highlight, hideLabels }: { selected?: string; onSelect: (p: Place) => void; highlight?: string[]; hideLabels?: boolean }) {
  const world = PLACES.filter((p) => p.map === "world");
  const holy = PLACES.filter((p) => p.map === "holyland");
  const marker = (p: Place, x: number, y: number, small = false) => (
    <g key={p.id} transform={`translate(${x} ${y})`}>
      <foreignObject x={small ? -15 : -24} y={small ? -15 : -24} width={small ? 30 : 48} height={small ? 30 : 48}>
        <button
          type="button"
          onClick={() => onSelect(p)}
          aria-label={p.name}
          aria-pressed={selected === p.id}
          data-testid={`place-${p.id}`}
          className={`h-full w-full rounded-full border-[3px] border-white shadow-md transition hover:scale-110 ${selected === p.id ? "bg-coral" : highlight?.includes(p.id) ? "bg-emerald" : p.kind === "water" ? "bg-sky" : "bg-royal"}`}
        />
      </foreignObject>
      {!hideLabels && (
        <text y={small ? 26 : 38} textAnchor="middle" fontSize={small ? 11 : 13} fontWeight="700" fill="#1f2547" stroke="#fffaf0" strokeWidth="3" paintOrder="stroke">
          {p.name}
        </text>
      )}
    </g>
  );
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <figure className="overflow-hidden rounded-3xl border-4 border-white bg-[#bfe6ff] shadow-[var(--shadow-card)]">
        <svg viewBox="0 0 600 400" className="h-auto w-full" role="group" aria-label="Map of Bible lands around the Mediterranean Sea">
          {/* land masses (stylised) */}
          <path d="M0 0 H600 V60 Q520 70 470 120 Q430 150 380 130 Q330 110 280 140 Q230 160 200 120 Q150 70 90 90 Q40 110 0 80 Z" fill="#f3e2b8" />
          <path d="M0 400 V300 Q80 290 160 320 Q240 330 300 310 Q360 300 410 320 Q440 330 470 290 Q500 250 540 250 L600 240 V400 Z" fill="#f3e2b8" />
          <path d="M520 60 Q560 120 540 250 L600 240 V60 Z" fill="#f3e2b8" />
          <path d="M30 20 Q60 60 50 110 L60 115 Q80 70 60 20 Z" fill="#e6d29c" />
          <path d="M210 120 Q240 150 260 190 Q250 200 240 190 Q220 160 200 130 Z" fill="#e6d29c" />
          <path d="M455 300 q20 10 15 60" stroke="#4aa8ff" strokeWidth="4" fill="none" />
          <text x="300" y="230" textAnchor="middle" fontSize="20" fontStyle="italic" fill="#2b7cc4" opacity="0.7">
            Mediterranean Sea
          </text>
          <rect x={HOLY_LAND_BOX.x * 6} y={HOLY_LAND_BOX.y * 4} width={HOLY_LAND_BOX.w * 6} height={HOLY_LAND_BOX.h * 4} fill="none" stroke="#ff7a59" strokeWidth="3" strokeDasharray="6 4" rx="8" />
          {world.map((p) => marker(p, p.x * 6, p.y * 4))}
        </svg>
        <figcaption className="px-4 py-2 text-xs text-ink-soft">Simplified map. Coastlines and positions are approximate.</figcaption>
      </figure>
      <figure className="overflow-hidden rounded-3xl border-4 border-coral/60 bg-[#e9f6d9] shadow-[var(--shadow-card)]">
        <svg viewBox="0 0 300 360" className="h-auto w-full" role="group" aria-label="Close-up map of ancient Israel">
          <path d="M0 0 H70 Q60 120 40 220 Q30 300 20 360 H0 Z" fill="#9fd3ff" />
          <ellipse cx="190" cy="95" rx="16" ry="24" fill="#6fc3ff" />
          <path d="M190 118 Q196 170 184 220 Q178 250 182 270" stroke="#4aa8ff" strokeWidth="6" fill="none" />
          <ellipse cx="185" cy="300" rx="14" ry="40" fill="#8fb8d8" />
          <text x="185" y="355" textAnchor="middle" fontSize="10" fill="#2b5c80">Dead Sea</text>
          <text x="30" y="200" fontSize="11" fill="#2b7cc4" transform="rotate(-80 30 200)">Mediterranean Sea</text>
          {holy.map((p) => marker(p, p.x * 3, p.y * 3.6, true))}
        </svg>
        <figcaption className="px-4 py-2 text-xs text-ink-soft">Close-up of ancient Israel (the dashed box on the big map).</figcaption>
      </figure>
    </div>
  );
}
