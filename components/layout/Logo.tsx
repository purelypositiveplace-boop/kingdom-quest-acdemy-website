import { r2, cos as kcos, sin as ksin } from "@/lib/geom";
import { brandArt } from "@/lib/art";
/**
 * Kingdom Quest Academy logo concept: a golden academy castle behind an open storybook,
 * with Leo the Lion cub peeking over the pages.
 */
export function LogoMark({ size = 56 }: { size?: number }) {
  const logo = brandArt.logo();
  if (logo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} width={size} height={size} alt="" aria-hidden style={{ width: size, height: size }} className="object-contain" />;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="kqa-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#f0a92e" />
        </linearGradient>
      </defs>
      {/* castle */}
      <g fill="url(#kqa-gold)" stroke="#b9741a" strokeWidth="2">
        <path d="M18 70 V36 h8 v-6 h6 v6 h6 v-6 h6 v6 h4 V70 z" />
        <path d="M72 70 V36 h4 v-6 h6 v6 h6 v-6 h6 v6 h8 V70 z" />
        <path d="M40 70 V22 l20 -14 l20 14 V70 z" />
      </g>
      <path d="M60 4 v10" stroke="#b9741a" strokeWidth="2" />
      <path d="M60 4 l12 4 l-12 4 z" fill="#ff7a59" />
      {/* Leo peeking */}
      <g transform="translate(60 62)">
        {Array.from({ length: 10 }, (_, i) => {
          const a = Math.PI + (i / 9) * Math.PI;
          return <circle key={i} cx={r2(kcos(a) * 22)} cy={r2(ksin(a) * 20)} r="9" fill="#d9822b" />;
        })}
        <circle r="19" fill="#f6b73c" />
        <circle cx="-15" cy="-15" r="6" fill="#f6b73c" />
        <circle cx="15" cy="-15" r="6" fill="#f6b73c" />
        <ellipse cy="7" rx="10" ry="7" fill="#fff3dc" />
        <ellipse cx="-7" cy="-2" rx="3.4" ry="4" fill="#2b1a0e" />
        <ellipse cx="7" cy="-2" rx="3.4" ry="4" fill="#2b1a0e" />
        <circle cx="-6" cy="-3.5" r="1.2" fill="#fff" />
        <circle cx="8" cy="-3.5" r="1.2" fill="#fff" />
        <path d="M-3 4 h6 l-3 3 z" fill="#7a4a1d" />
        <path d="M-5 9 q5 4 10 0" stroke="#7a4a1d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
      {/* open storybook */}
      <path d="M8 78 q26 -8 52 4 q26 -12 52 -4 v32 q-26 -8 -52 4 q-26 -12 -52 -4 z" fill="#2a48d4" />
      <path d="M12 80 q24 -6 46 4 v28 q-22 -10 -46 -4 z" fill="#fffaf0" />
      <path d="M108 80 q-24 -6 -46 4 v28 q22 -10 46 -4 z" fill="#fffaf0" />
      <path d="M20 88 q16 -3 30 3 M20 95 q16 -3 30 3 M70 91 q14 -6 30 -3 M70 98 q14 -6 30 -3" stroke="#b9c5ff" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={compact ? 44 : 56} />
      <span className="leading-none">
        <span className="block font-display text-xl font-bold text-royal-dark md:text-2xl">Kingdom Quest</span>
        <span className="block font-display text-sm font-semibold tracking-[0.25em] text-gold-dark">ACADEMY</span>
      </span>
    </span>
  );
}
