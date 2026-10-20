import { r2, cos as kcos, sin as ksin } from "@/lib/geom";
import type { MascotId } from "@/lib/curriculum/types";
import { MASCOTS } from "@/data/mascots";
import { mascotArt } from "@/lib/art";

export type Expression = "happy" | "excited" | "thinking" | "calm" | "proud";

interface Props {
  id: MascotId;
  expression?: Expression;
  size?: number;
  animate?: "idle" | "wave" | "bounce" | "none";
  /** black-and-white line art for colouring pages */
  outline?: boolean;
  className?: string;
  title?: string;
}

/**
 * Original Kingdom Quest Academy mascots, drawn in SVG so they stay crisp, light and consistent.
 * Replace with illustrated PNGs later by passing them through <ArtImage> with this as fallback.
 */
export function Mascot({ id, expression = "happy", size = 160, animate = "idle", outline = false, className = "", title }: Props) {
  const m = MASCOTS[id];
  const anim = animate === "bounce" ? "animate-[float_2.2s_ease-in-out_infinite]" : animate === "idle" ? "animate-[float_5s_ease-in-out_infinite]" : animate === "wave" ? "animate-[wiggle_1.4s_ease-in-out_infinite]" : "";
  const label = title ?? `${m.name}, a friendly ${m.species.toLowerCase()} guide`;
  const c = outline
    ? { body: "#fff", accent: "#fff", detail: "#222", soft: "#fff", eye: "#222", stroke: "#222", cheek: "transparent" }
    : { body: m.colors.body, accent: m.colors.accent, detail: m.colors.detail, soft: "#fff3dc", eye: "#2b1a0e", stroke: "none", cheek: "#ff9eb0" };
  const sw = outline ? 3 : 0;
  const img = outline || size < 80 ? undefined : mascotArt(id);
  if (img)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={img} width={size} height={size} alt={label} className={`${anim} object-contain ${className}`} style={{ width: size, height: size }} />
    );
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={label} className={`${anim} ${className}`} style={{ overflow: "visible" }}>
      <title>{label}</title>
      <g stroke={c.stroke} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
        {id === "leo" && <Leo c={c} expression={expression} />}
        {id === "sunny" && <Sunny c={c} expression={expression} />}
        {id === "oliver" && <Oliver c={c} expression={expression} />}
        {id === "grace" && <Grace c={c} expression={expression} />}
        {id === "finn" && <Finn c={c} expression={expression} />}
      </g>
    </svg>
  );
}

type C = { body: string; accent: string; detail: string; soft: string; eye: string; stroke: string; cheek: string };

function Eyes({ x1, x2, y, r = 10, expression, color }: { x1: number; x2: number; y: number; r?: number; expression: Expression; color: string }) {
  if (expression === "calm" || expression === "proud") {
    const d = (x: number) => `M ${x - r} ${y + 2} Q ${x} ${y - r} ${x + r} ${y + 2}`;
    return (
      <g fill="none" stroke={color} strokeWidth={4} strokeLinecap="round">
        <path d={d(x1)} />
        <path d={d(x2)} />
      </g>
    );
  }
  const dy = expression === "thinking" ? -3 : 0;
  return (
    <g>
      {[x1, x2].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 1.18} fill={color} stroke="none" />
          <circle cx={x + r * 0.35} cy={y - r * 0.4 + dy} r={r * 0.38} fill="#fff" stroke="none" />
          <circle cx={x - r * 0.3} cy={y + r * 0.45 + dy} r={r * 0.16} fill="#fff" stroke="none" />
        </g>
      ))}
    </g>
  );
}

function Mouth({ x, y, w = 16, expression, color }: { x: number; y: number; w?: number; expression: Expression; color: string }) {
  if (expression === "excited")
    return <path d={`M ${x - w} ${y} Q ${x} ${y + w * 1.4} ${x + w} ${y} Z`} fill="#7a2e2e" stroke={color} strokeWidth={3} strokeLinejoin="round" />;
  if (expression === "thinking") return <path d={`M ${x - w * 0.5} ${y + 4} Q ${x} ${y + 1} ${x + w * 0.6} ${y + 5}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />;
  return <path d={`M ${x - w} ${y} Q ${x} ${y + w} ${x + w} ${y}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />;
}

function Cheeks({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  return (
    <g fill={color} opacity={0.55} stroke="none">
      <ellipse cx={x1} cy={y} rx={9} ry={6} />
      <ellipse cx={x2} cy={y} rx={9} ry={6} />
    </g>
  );
}

function Leo({ c, expression }: { c: C; expression: Expression }) {
  const mane = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return { x: r2(100 + kcos(a) * 56), y: r2(92 + ksin(a) * 54)};
  });
  return (
    <g>
      {/* body and paws */}
      <ellipse cx="100" cy="172" rx="40" ry="24" fill={c.body} />
      <ellipse cx="78" cy="186" rx="13" ry="9" fill={c.soft} />
      <ellipse cx="122" cy="186" rx="13" ry="9" fill={c.soft} />
      <path d="M140 168 q26 -6 24 -30" fill="none" stroke={c.accent} strokeWidth={7} strokeLinecap="round" />
      <circle cx="164" cy="136" r="8" fill={c.accent} />
      {/* fluffy mane */}
      {mane.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="20" fill={c.accent} />
      ))}
      {/* ears */}
      <circle cx="64" cy="54" r="16" fill={c.body} />
      <circle cx="136" cy="54" r="16" fill={c.body} />
      <circle cx="64" cy="54" r="8" fill={c.soft} />
      <circle cx="136" cy="54" r="8" fill={c.soft} />
      {/* head */}
      <circle cx="100" cy="94" r="50" fill={c.body} />
      <path d="M92 46 q8 -14 18 -4 q-8 0 -6 10" fill={c.accent} />
      <ellipse cx="100" cy="117" rx="27" ry="19" fill={c.soft} />
      <Eyes x1={80} x2={120} y={90} expression={expression} color={c.eye} />
      <path d="M92 106 h16 q-2 9 -8 10 q-6 -1 -8 -10 z" fill={c.detail} />
      <Mouth x={100} y={121} w={11} expression={expression} color={c.detail} />
      <Cheeks x1={68} x2={132} y={110} color={c.cheek} />
    </g>
  );
}

function Sunny({ c, expression }: { c: C; expression: Expression }) {
  const wool = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { x: r2(100 + kcos(a) * 50), y: r2(96 + ksin(a) * 48)};
  });
  return (
    <g>
      <ellipse cx="100" cy="172" rx="44" ry="24" fill={c.body} stroke={c.stroke === "none" ? "#e8dccb" : c.stroke} strokeWidth={2} />
      <rect x="74" y="180" width="12" height="16" rx="6" fill="#6b5b4b" />
      <rect x="114" y="180" width="12" height="16" rx="6" fill="#6b5b4b" />
      {wool.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="22" fill={c.body} stroke={c.stroke === "none" ? "#efe4d4" : c.stroke} strokeWidth={2} />
      ))}
      <ellipse cx="52" cy="98" rx="22" ry="10" fill="#f7dcc9" transform="rotate(-20 52 98)" />
      <ellipse cx="148" cy="98" rx="22" ry="10" fill="#f7dcc9" transform="rotate(20 148 98)" />
      <ellipse cx="100" cy="104" rx="38" ry="42" fill="#fbe9dc" />
      <circle cx="88" cy="58" r="14" fill={c.body} />
      <circle cx="110" cy="56" r="15" fill={c.body} />
      <Eyes x1={86} x2={114} y={98} r={8} expression={expression} color={c.eye} />
      <ellipse cx="100" cy="116" rx="7" ry="5" fill="#d98c8c" />
      <Mouth x={100} y={124} w={9} expression={expression} color="#8a5a4a" />
      <Cheeks x1={74} x2={126} y={114} color={c.cheek} />
      {/* golden bell */}
      <path d="M78 146 q22 12 44 0" fill="none" stroke="#ff8fa3" strokeWidth={5} />
      <circle cx="100" cy="156" r="10" fill={c.stroke === "none" ? c.accent : "#fff"} />
      <circle cx="100" cy="160" r="2.5" fill="#8a6400" />
    </g>
  );
}

function Oliver({ c, expression }: { c: C; expression: Expression }) {
  return (
    <g>
      <path d="M58 54 l10 -26 l16 22 z" fill={c.body} />
      <path d="M142 54 l-10 -26 l-16 22 z" fill={c.body} />
      <ellipse cx="100" cy="112" rx="62" ry="74" fill={c.body} />
      <ellipse cx="50" cy="124" rx="16" ry="38" fill={c.detail} transform="rotate(12 50 124)" />
      <ellipse cx="150" cy="124" rx="16" ry="38" fill={c.detail} transform="rotate(-12 150 124)" />
      <ellipse cx="100" cy="138" rx="38" ry="44" fill={c.accent} />
      {[120, 138, 156].map((y) => (
        <path key={y} d={`M84 ${y} q8 6 16 0 q8 6 16 0`} fill="none" stroke={c.stroke === "none" ? "#d9c3a0" : c.stroke} strokeWidth={3} />
      ))}
      <circle cx="78" cy="84" r="24" fill="#fff" />
      <circle cx="122" cy="84" r="24" fill="#fff" />
      <g fill="none" stroke={c.stroke === "none" ? "#4a3020" : c.stroke} strokeWidth={4}>
        <circle cx="78" cy="84" r="26" />
        <circle cx="122" cy="84" r="26" />
        <path d="M104 82 h-8" />
      </g>
      <Eyes x1={78} x2={122} y={86} r={10} expression={expression} color={c.eye} />
      <path d="M92 104 l8 14 l8 -14 z" fill="#f2a33a" />
      <ellipse cx="80" cy="190" rx="12" ry="5" fill="#f2a33a" />
      <ellipse cx="120" cy="190" rx="12" ry="5" fill="#f2a33a" />
    </g>
  );
}

function Grace({ c, expression }: { c: C; expression: Expression }) {
  return (
    <g>
      <path d="M40 140 q-30 -20 -20 -60 q30 10 56 40 z" fill={c.accent} />
      <path d="M46 132 q-18 -16 -14 -40 q20 8 36 30 z" fill={c.body} />
      <ellipse cx="104" cy="138" rx="58" ry="40" fill={c.body} stroke={c.stroke === "none" ? "#e3eef8" : c.stroke} strokeWidth={2} />
      <path d="M150 150 l38 -6 l-8 18 l10 12 z" fill={c.body} stroke={c.stroke === "none" ? "#e3eef8" : c.stroke} strokeWidth={2} />
      <path d="M112 120 q34 -30 52 6 q-22 22 -52 16 z" fill={c.accent} />
      <circle cx="80" cy="88" r="36" fill={c.body} stroke={c.stroke === "none" ? "#e3eef8" : c.stroke} strokeWidth={2} />
      <path d="M48 92 l-16 6 l16 6 z" fill="#f2a33a" />
      <Eyes x1={68} x2={92} y={84} r={7} expression={expression} color={c.eye} />
      <Cheeks x1={60} x2={100} y={100} color={c.cheek} />
      <path d="M72 102 q8 6 16 0" fill="none" stroke={c.detail} strokeWidth={3} strokeLinecap="round" />
      <path d="M96 176 v14 M112 176 v14" stroke="#f2a33a" strokeWidth={4} />
    </g>
  );
}

function Finn({ c, expression }: { c: C; expression: Expression }) {
  return (
    <g>
      <path d="M150 104 l40 -36 q-8 36 0 72 z" fill={c.accent} />
      <path d="M86 58 q20 -30 46 -6 q-22 2 -34 16 z" fill={c.accent} />
      <ellipse cx="96" cy="104" rx="66" ry="50" fill={c.body} />
      <path d="M96 150 q16 18 34 10 q-14 -6 -18 -16 z" fill={c.accent} />
      {[[112, 82], [128, 108], [110, 124]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill={c.stroke === "none" ? c.accent : "#fff"} opacity={0.8} />
      ))}
      <circle cx="70" cy="90" r="18" fill="#fff" />
      <Eyes x1={70} x2={70} y={92} r={10} expression={expression} color={c.eye} />
      <path d="M44 118 q26 22 52 4" fill={expression === "excited" ? "#7a2e2e" : "none"} stroke={c.detail} strokeWidth={4} strokeLinecap="round" />
      <ellipse cx="52" cy="108" rx="8" ry="5" fill={c.cheek} opacity={0.55} stroke="none" />
    </g>
  );
}
