import { brandArt } from "@/lib/art";
import { r2, cos as kcos, sin as ksin } from "@/lib/geom";
/**
 * Decorative Kingdom Quest scenery: bright sky, drifting clouds, rolling hills, the golden
 * academy castle, flowers and fluttering butterflies. Purely decorative (aria-hidden); all motion
 * stops under reduced-motion.
 */
export function KingdomScenery({ className = "" }: { className?: string }) {
  const hero = brandArt.hero();
  if (hero)
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero} alt="" className="h-full w-full object-cover object-[70%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent md:from-white/55" />
      </div>
    );
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#5fb8ff] via-[#a9dbff] to-[#e9f7ff]" />
      <div className="absolute left-[8%] top-[6%] h-28 w-28 rounded-full bg-sun shadow-[0_0_80px_30px_rgba(255,210,63,0.55)]" />
      {[
        { top: "10%", delay: "0s", scale: 1 },
        { top: "22%", delay: "-22s", scale: 0.7 },
        { top: "4%", delay: "-40s", scale: 1.3 },
      ].map((c, i) => (
        <div key={i} className="absolute left-0 animate-[drift_70s_linear_infinite]" style={{ top: c.top, animationDelay: c.delay }}>
          <svg width={180 * c.scale} height={70 * c.scale} viewBox="0 0 180 70">
            <g fill="#fff" opacity="0.95">
              <ellipse cx="90" cy="48" rx="80" ry="20" />
              <circle cx="60" cy="34" r="26" />
              <circle cx="104" cy="26" r="30" />
              <circle cx="134" cy="40" r="20" />
            </g>
          </svg>
        </div>
      ))}
      <svg className="absolute inset-x-0 bottom-0 h-[62%] w-full" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="castle-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe27a" />
            <stop offset="1" stopColor="#f0a92e" />
          </linearGradient>
        </defs>
        {/* distant hills */}
        <path d="M0 330 Q200 250 420 310 T820 290 T1200 300 V500 H0 Z" fill="#8fdc8f" />
        {/* golden academy castle */}
        <g transform="translate(820 120)">
          <g fill="url(#castle-gold)" stroke="#d08a20" strokeWidth="3">
            <rect x="0" y="80" width="60" height="140" />
            <rect x="200" y="80" width="60" height="140" />
            <rect x="50" y="40" width="160" height="180" />
            <rect x="105" y="0" width="50" height="220" />
          </g>
          {[[0, 80, 60], [200, 80, 60], [50, 40, 160], [105, 0, 50]].map(([x, y, w]) => (
            <g key={`${x}`} fill="#ffe27a" stroke="#d08a20" strokeWidth="2">
              {Array.from({ length: Math.floor(w / 15) }, (_, i) => (
                <rect key={i} x={x + i * 15} y={y - 10} width="9" height="12" />
              ))}
            </g>
          ))}
          <path d="M130 -10 v-40" stroke="#b9741a" strokeWidth="4" />
          <path d="M130 -50 l34 10 l-34 10 z" fill="#ff7a59" />
          <path d="M110 220 v-50 a20 20 0 0 1 40 0 v50 z" fill="#2a48d4" />
          {[70, 170].map((x) => (
            <path key={x} d={`M${x} 120 v-24 a10 10 0 0 1 20 0 v24 z`} fill="#6fc3ff" stroke="#d08a20" strokeWidth="2" />
          ))}
        </g>
        {/* near hills with winding path */}
        <path d="M0 400 Q300 320 600 380 T1200 360 V500 H0 Z" fill="#5fcb72" />
        <path d="M560 500 C 600 440, 760 430, 940 345" stroke="#f6dfa5" strokeWidth="38" fill="none" strokeLinecap="round" />
        <path d="M0 450 Q250 410 520 450 T1200 440 V500 H0 Z" fill="#43b85c" />
        {/* trees */}
        {[[90, 360], [180, 380], [1100, 360], [400, 395]].map(([x, y]) => (
          <g key={`${x}`} transform={`translate(${x} ${y})`}>
            <rect x="-6" y="0" width="12" height="40" rx="4" fill="#9b6a3a" />
            <circle cy="-10" r="34" fill="#2f9d4e" />
            <circle cx="-18" cy="4" r="22" fill="#3fb35f" />
            <circle cx="20" cy="2" r="24" fill="#3fb35f" />
          </g>
        ))}
        {/* flowers */}
        {Array.from({ length: 26 }, (_, i) => {
          const x = (i * 47) % 1200;
          const y = 455 + ((i * 13) % 35);
          const col = ["#ff7eb6", "#ffd23f", "#b9a6ff", "#ff7a59", "#fff"][i % 5];
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={r2(kcos((a * Math.PI) / 180) * 5)} cy={r2(ksin((a * Math.PI) / 180) * 5)} r="4.5" fill={col} />
              ))}
              <circle r="3" fill="#ffe680" />
            </g>
          );
        })}
      </svg>
      {[
        { left: "18%", top: "48%", color: "#ff8fc1", d: "0s" },
        { left: "62%", top: "40%", color: "#b9a6ff", d: "-3s" },
        { left: "40%", top: "60%", color: "#ffd23f", d: "-6s" },
      ].map((b, i) => (
        <svg key={i} className="animate-flutter absolute" style={{ left: b.left, top: b.top, animationDelay: b.d }} width="34" height="28" viewBox="0 0 34 28">
          <ellipse cx="9" cy="10" rx="8" ry="9" fill={b.color} />
          <ellipse cx="25" cy="10" rx="8" ry="9" fill={b.color} />
          <ellipse cx="10" cy="21" rx="6" ry="6" fill={b.color} opacity="0.8" />
          <ellipse cx="24" cy="21" rx="6" ry="6" fill={b.color} opacity="0.8" />
          <rect x="16" y="6" width="2.5" height="18" rx="1.2" fill="#1f2547" />
        </svg>
      ))}
    </div>
  );
}
