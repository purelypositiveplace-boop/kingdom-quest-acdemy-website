import { r2, cos as kcos, sin as ksin } from "@/lib/geom";
import type { SceneProp, SceneTheme } from "@/lib/curriculum/types";

/**
 * Draws a storybook scene from a theme and a list of props. This is the designed fallback used
 * whenever an illustration file isn't available, so a scene never shows a broken image.
 */
const SKIES: Record<SceneTheme, [string, string, string?]> = {
  void: ["#1b1f4a", "#3b2f6b"],
  dawn: ["#ffcf7a", "#ffefc9", "#ffd9a8"],
  sky: ["#6fc3ff", "#d8f1ff"],
  sea: ["#7fd0ff", "#e3f6ff"],
  garden: ["#8fd6ff", "#e9f8ff"],
  night: ["#1c2a6b", "#45399a"],
  rain: ["#8e9bb8", "#cdd6e6"],
  rainbow: ["#9ad8ff", "#fff6dc"],
  desert: ["#ffd48a", "#fff1d0"],
  river: ["#a3dcff", "#f2fbff"],
  village: ["#ffc98f", "#fff4dd"],
  palace: ["#c9b6ff", "#fff0f7"],
  hills: ["#83d0ff", "#eaf8ff"],
  city: ["#ffbf8a", "#ffeedb"],
  lake: ["#8fd7ff", "#eefaff"],
  storm: ["#3d4a6b", "#7c87a3"],
  temple: ["#6b4f9e", "#c6a8e8"],
  underwater: ["#0e6aa8", "#2bb3d6"],
  stable: ["#2a3577", "#5a4b9b"],
};

const GROUND: Partial<Record<SceneTheme, string>> = {
  garden: "#57c46b", hills: "#5cc26e", rainbow: "#64c873", desert: "#f0c070", village: "#e8b878",
  palace: "#d9b8ff", city: "#e7b58a", river: "#6ccf7c", lake: "#6ccf7c", stable: "#4a3b2a", temple: "#7a5c9e",
  dawn: "#7fcf7a", night: "#2f3f7a", rain: "#6b8f73", sky: "#6fd08a",
};

const WATER: Partial<Record<SceneTheme, string>> = { sea: "#2e9be6", lake: "#3fb1e8", river: "#4fb8e8", storm: "#2c4b73", rain: "#4a7fa8" };

interface Props {
  theme: SceneTheme;
  props?: SceneProp[];
  alt: string;
  className?: string;
  /** highlight a tappable prop */
  pulse?: SceneProp;
  onPropClick?: (p: SceneProp) => void;
}

export function SceneArt({ theme, props = [], alt, className = "", pulse, onPropClick }: Props) {
  const [top, bottom, mid] = SKIES[theme];
  const gid = `sky-${theme}`;
  const ground = GROUND[theme];
  const water = WATER[theme];
  const dark = ["void", "night", "storm", "underwater", "stable", "temple"].includes(theme);
  return (
    <svg viewBox="0 0 400 250" className={className} role="img" aria-label={alt} preserveAspectRatio="xMidYMid slice">
      <title>{alt}</title>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          {mid && <stop offset="0.6" stopColor={mid} />}
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#fff7c2" stopOpacity="1" />
          <stop offset="1" stopColor="#fff7c2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${gid})`} />
      {theme === "void" && <VoidSwirls />}
      {theme === "underwater" && <Underwater />}
      {dark && theme !== "underwater" && theme !== "void" && <Stars count={18} />}
      {theme === "rainbow" && <Rainbow />}
      {theme === "storm" && <StormClouds />}
      {theme === "rain" && <Rain />}
      {theme === "palace" && <Palace />}
      {theme === "temple" && <Temple />}
      {theme === "city" && <CitySkyline />}
      {theme === "village" && <Houses />}
      {theme === "stable" && <Stable />}
      {ground && !water && <Hills color={ground} />}
      {water && <Water color={water} rough={theme === "storm"} shore={theme === "lake" || theme === "river" ? ground : undefined} />}
      {props.map((p, i) => (
        <g
          key={`${p}-${i}`}
          className={onPropClick ? "cursor-pointer" : undefined}
          onClick={onPropClick ? () => onPropClick(p) : undefined}
          style={pulse === p ? { animation: "twinkle 1.6s ease-in-out infinite", transformOrigin: "center", transformBox: "fill-box" } : undefined}
        >
          <Prop p={p} theme={theme} />
        </g>
      ))}
    </svg>
  );
}

function Prop({ p, theme }: { p: SceneProp; theme: SceneTheme }) {
  switch (p) {
    case "sun":
      return (
        <g>
          <circle cx="340" cy="52" r="46" fill="url(#glow)" />
          <circle cx="340" cy="52" r="24" fill="#ffd23f" />
        </g>
      );
    case "moon":
      return <path d="M60 40 a22 22 0 1 0 22 30 a17 17 0 1 1 -22 -30 z" fill="#fff4c2" />;
    case "stars":
      return <Stars count={22} />;
    case "bigstar":
      return (
        <g>
          <circle cx="300" cy="44" r="40" fill="url(#glow)" />
          <path d="M300 18 l7 19 h20 l-16 12 l6 20 l-17 -12 l-17 12 l6 -20 l-16 -12 h20 z" fill="#ffe680" />
          <path d="M300 64 L300 120" stroke="#ffe680" strokeWidth="2" opacity="0.5" />
        </g>
      );
    case "clouds":
      return (
        <g fill="#fff" opacity={theme === "rain" || theme === "storm" ? 0.6 : 0.95}>
          <Cloud x={70} y={50} s={1} />
          <Cloud x={250} y={36} s={1.3} />
        </g>
      );
    case "light":
      return (
        <g>
          <circle cx="200" cy="90" r="110" fill="url(#glow)" />
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M200 90 L${r2(200 + kcos((i / 10) * Math.PI * 2) * 160)} ${r2(90 + ksin((i / 10) * Math.PI * 2) * 160)}`} stroke="#fff6c9" strokeWidth="6" opacity="0.35" />
          ))}
        </g>
      );
    case "trees":
      return (
        <g>
          <Tree x={60} y={190} s={1.1} />
          <Tree x={330} y={185} s={1.3} fruit />
          <Tree x={280} y={200} s={0.8} />
        </g>
      );
    case "palm":
      return (
        <g>
          <path d="M70 215 q-6 -50 6 -90" stroke="#9b6a3a" strokeWidth="8" fill="none" />
          {[-60, -20, 20, 60, 100].map((a) => (
            <ellipse key={a} cx="76" cy="125" rx="34" ry="8" fill="#3fa34d" transform={`rotate(${a} 76 125) translate(26 0)`} />
          ))}
        </g>
      );
    case "flowers":
      return (
        <g>
          {[[40, 222, "#ff7eb6"], [120, 230, "#ffd23f"], [210, 226, "#b58cff"], [300, 232, "#ff8a5c"], [370, 222, "#ff7eb6"]].map(([x, y, col]) => (
            <g key={`${x}`}>
              <path d={`M${x} ${y} v14`} stroke="#2f8f46" strokeWidth="3" />
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={r2((x as number) + kcos((a * Math.PI) / 180) * 6)} cy={r2((y as number) + ksin((a * Math.PI) / 180) * 6)} r="5" fill={col as string} />
              ))}
              <circle cx={x as number} cy={y as number} r="3.5" fill="#fff3a0" />
            </g>
          ))}
        </g>
      );
    case "fish":
      return (
        <g>
          {[[90, 200, "#ff8a5c"], [160, 215, "#ffd23f"], [250, 205, "#ff7eb6"], [320, 222, "#9b6dff"]].map(([x, y, col]) => (
            <g key={`${x}`} transform={`translate(${x} ${y})`}>
              <ellipse rx="14" ry="8" fill={col as string} />
              <path d="M12 0 l10 -7 v14 z" fill={col as string} />
              <circle cx="-6" cy="-2" r="2" fill="#1f2547" />
            </g>
          ))}
        </g>
      );
    case "birds":
      return (
        <g fill="none" stroke="#1f2547" strokeWidth="2.5" strokeLinecap="round">
          {[[120, 60], [150, 48], [200, 70], [240, 52]].map(([x, y]) => (
            <path key={`${x}`} d={`M${x - 8} ${y} q8 -8 8 0 q0 -8 8 0`} />
          ))}
        </g>
      );
    case "animals":
      return (
        <g>
          <Animal x={70} y={200} kind="lion" />
          <Animal x={130} y={206} kind="elephant" />
          <Animal x={270} y={204} kind="giraffe" />
          <Animal x={330} y={210} kind="sheep" />
        </g>
      );
    case "sheep":
      return (
        <g>
          <Animal x={90} y={212} kind="sheep" />
          <Animal x={140} y={220} kind="sheep" />
          <Animal x={320} y={214} kind="sheep" />
        </g>
      );
    case "lion":
      return <Animal x={300} y={204} kind="lion" big />;
    case "camels":
      return (
        <g fill="#c99a5b">
          {[250, 310].map((x) => (
            <g key={x} transform={`translate(${x} 188)`}>
              <ellipse cx="0" cy="0" rx="26" ry="14" />
              <circle cx="-6" cy="-12" r="9" />
              <path d="M22 -4 q14 -18 10 -30 l8 -2 q6 16 -8 34 z" />
              <path d="M-18 8 v24 M-6 10 v22 M8 10 v22 M18 8 v24" stroke="#c99a5b" strokeWidth="5" />
            </g>
          ))}
        </g>
      );
    case "people":
      return (
        <g>
          <Person x={150} y={205} robe="#ff8a5c" />
          <Person x={190} y={210} robe="#6c7bff" />
          <Person x={232} y={206} robe="#34c38f" small />
        </g>
      );
    case "ark":
      return (
        <g transform="translate(200 175)">
          <path d="M-110 0 h220 l-24 40 h-172 z" fill="#a0673a" />
          <path d="M-110 0 h220" stroke="#7a4a1d" strokeWidth="5" />
          <rect x="-70" y="-38" width="140" height="38" rx="6" fill="#c98a52" />
          <path d="M-80 -38 L0 -66 L80 -38 z" fill="#7a4a1d" />
          <rect x="-12" y="-30" width="24" height="30" rx="4" fill="#5b3415" />
          {[-50, -30, 30, 50].map((x) => (
            <rect key={x} x={x - 6} y="-28" width="12" height="10" rx="2" fill="#ffe7b0" />
          ))}
          {[-90, -50, -10, 30, 70].map((x) => (
            <path key={x} d={`M${x} 12 h30`} stroke="#7a4a1d" strokeWidth="3" />
          ))}
        </g>
      );
    case "dove":
      return (
        <g transform="translate(240 70)">
          <ellipse rx="18" ry="11" fill="#fff" />
          <circle cx="-16" cy="-6" r="8" fill="#fff" />
          <path d="M-24 -6 l-6 2 l6 2 z" fill="#f2a33a" />
          <path d="M-2 -6 q10 -26 26 -16 q-6 14 -26 16 z" fill="#e4f2ff" />
          <path d="M-30 -2 q-14 4 -18 -6" stroke="#3fa34d" strokeWidth="3" fill="none" />
          <ellipse cx="-46" cy="-8" rx="5" ry="3" fill="#3fa34d" />
        </g>
      );
    case "rainbow":
      return <Rainbow />;
    case "manger":
      return (
        <g transform="translate(200 200)">
          <path d="M-50 -10 h100 l-12 30 h-76 z" fill="#a0673a" />
          <path d="M-40 20 l-10 22 M40 20 l10 22" stroke="#7a4a1d" strokeWidth="6" />
          <path d="M-46 -10 q46 -16 92 0" fill="#ffd66b" />
          <ellipse cx="0" cy="-16" rx="26" ry="11" fill="#fff4e3" />
          <circle cx="-16" cy="-20" r="9" fill="#f2c9a0" />
          <circle cx="0" cy="-16" r="34" fill="url(#glow)" opacity="0.6" />
        </g>
      );
    case "angel":
      return (
        <g transform="translate(110 90)">
          <circle r="44" fill="url(#glow)" />
          <path d="M-8 -6 q-34 -20 -40 8 q22 4 40 6 z M8 -6 q34 -20 40 8 q-22 4 -40 6 z" fill="#fff" opacity="0.95" />
          <path d="M-14 0 h28 l10 44 h-48 z" fill="#fffbe9" />
          <circle cy="-12" r="10" fill="#f2c9a0" />
          <ellipse cy="-27" rx="11" ry="3" fill="none" stroke="#ffd23f" strokeWidth="3" />
        </g>
      );
    case "boat":
      return (
        <g transform="translate(200 168)">
          <path d="M-60 0 h120 l-18 24 h-84 z" fill="#a0673a" />
          <path d="M0 0 v-60" stroke="#7a4a1d" strokeWidth="4" />
          <path d="M2 -58 l40 46 h-40 z" fill="#fff" />
        </g>
      );
    case "basket":
      return (
        <g transform="translate(200 200)">
          <ellipse rx="34" ry="12" fill="#c98a52" />
          <path d="M-34 0 q34 26 68 0" fill="#a0673a" />
          <ellipse cy="-4" rx="20" ry="7" fill="#fff4e3" />
          {[-24, -12, 0, 12, 24].map((x) => (
            <path key={x} d={`M${x} 2 v10`} stroke="#7a4a1d" strokeWidth="2" />
          ))}
          {[-60, -45, 48, 62].map((x) => (
            <path key={x} d={`M${x} 10 q2 -40 -4 -60`} stroke="#3fa34d" strokeWidth="4" fill="none" />
          ))}
        </g>
      );
    case "bush":
      return (
        <g transform="translate(200 196)">
          <circle cx="-20" cy="0" r="22" fill="#2f8f46" />
          <circle cx="16" cy="-4" r="26" fill="#3fa34d" />
          <circle cx="0" cy="-20" r="22" fill="#47b26b" />
        </g>
      );
    case "flame":
      return (
        <g transform="translate(200 170)">
          <circle r="60" fill="url(#glow)" />
          <path d="M0 -50 q30 30 14 54 q-14 16 -28 0 q-16 -24 14 -54 z" fill="#ff8a3c" />
          <path d="M0 -24 q14 16 6 30 q-6 8 -12 0 q-8 -14 6 -30 z" fill="#ffd23f" />
        </g>
      );
    case "tablets":
      return (
        <g transform="translate(200 160)">
          {[-26, 26].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <path d="M-22 40 v-56 q0 -18 22 -18 q22 0 22 18 v56 z" fill="#c9c3b6" stroke="#8c8577" strokeWidth="3" />
              {[-14, -4, 6, 16, 26].map((y) => (
                <path key={y} d={`M-12 ${y} h24`} stroke="#8c8577" strokeWidth="2" />
              ))}
            </g>
          ))}
        </g>
      );
    case "walls":
      return (
        <g transform="translate(200 160)">
          <rect x="-130" y="-30" width="260" height="70" fill="#d6b07c" />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-130 + i * 19} y="-42" width="12" height="14" fill="#d6b07c" />
          ))}
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 9 }, (_, c) => <rect key={`${r}-${c}`} x={-128 + c * 29 + (r % 2) * 14} y={-28 + r * 14} width="26" height="11" fill="none" stroke="#b58a52" strokeWidth="1.5" />),
          )}
          <rect x="-16" y="4" width="32" height="36" rx="16" fill="#7a4a1d" />
        </g>
      );
    case "crown":
      return (
        <g transform="translate(200 120)">
          <path d="M-30 10 l-6 -34 l18 16 l18 -26 l18 26 l18 -16 l-6 34 z" fill="#ffd23f" stroke="#b9741a" strokeWidth="3" />
          <circle cx="0" cy="-4" r="5" fill="#ff7eb6" />
        </g>
      );
    case "whale":
      return (
        <g transform="translate(220 150)">
          <ellipse rx="90" ry="44" fill="#3d7fd6" />
          <ellipse cy="16" rx="70" ry="22" fill="#9fd3ff" />
          <path d="M84 -6 l40 -30 q-6 30 0 60 z" fill="#3d7fd6" />
          <circle cx="-50" cy="-12" r="7" fill="#1f2547" />
          <circle cx="-48" cy="-14" r="2.5" fill="#fff" />
          <path d="M-80 10 q20 12 40 4" stroke="#1f2547" strokeWidth="3" fill="none" />
        </g>
      );
    case "bread":
      return (
        <g transform="translate(200 210)">
          {[-40, 0, 40].map((x) => (
            <ellipse key={x} cx={x} cy="0" rx="18" ry="10" fill="#e3a65a" stroke="#b9741a" strokeWidth="2" />
          ))}
        </g>
      );
    case "cross":
      return (
        <g transform="translate(200 120)">
          <rect x="-6" y="-46" width="12" height="96" rx="3" fill="#8a5a33" />
          <rect x="-34" y="-28" width="68" height="12" rx="3" fill="#8a5a33" />
        </g>
      );
    case "tomb":
      return (
        <g transform="translate(220 180)">
          <path d="M-90 40 q0 -100 90 -100 q90 0 90 100 z" fill="#a59c8c" />
          <ellipse cx="0" cy="18" rx="30" ry="26" fill="#3d3a33" />
        </g>
      );
    case "stone":
      return <circle cx="150" cy="210" r="28" fill="#9a9384" stroke="#7a7466" strokeWidth="3" />;
    case "coat":
      return (
        <g transform="translate(200 150)">
          <path d="M-30 -40 h60 l26 30 l-14 10 l-12 -14 v64 h-60 v-64 l-12 14 l-14 -10 z" fill="#ff7eb6" />
          {["#ffd23f", "#6c7bff", "#34c38f", "#ff8a5c"].map((col, i) => (
            <rect key={col} x="-30" y={-26 + i * 16} width="60" height="8" fill={col} />
          ))}
        </g>
      );
    case "well":
      return (
        <g transform="translate(110 200)">
          <ellipse rx="30" ry="9" fill="#5b5446" />
          <path d="M-30 0 v22 h60 v-22" fill="#a59c8c" />
        </g>
      );
    case "heart":
      return (
        <g transform="translate(200 90)">
          <circle r="40" fill="url(#glow)" />
          <path d="M0 18 C -40 -10 -20 -40 0 -20 C 20 -40 40 -10 0 18 z" fill="#ff5d8f" />
        </g>
      );
    case "water":
      return (
        <g fill="none" stroke="#fff" strokeWidth="3" opacity="0.7">
          {[60, 150, 250, 330].map((x) => (
            <path key={x} d={`M${x - 20} 215 q10 -8 20 0 t20 0`} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="30" ry="14" />
      <circle cx="-14" cy="-8" r="13" />
      <circle cx="8" cy="-12" r="16" />
    </g>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <g fill="#fff8c9">
      {Array.from({ length: count }, (_, i) => {
        const x = (i * 97) % 390 + 5;
        const y = (i * 53) % 120 + 8;
        return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.4} style={{ animation: `twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.2}s infinite` }} />;
      })}
    </g>
  );
}

function Hills({ color }: { color: string }) {
  return (
    <g>
      <path d="M0 190 Q100 150 200 185 T400 175 V250 H0 Z" fill={color} opacity="0.75" />
      <path d="M0 215 Q120 180 240 210 T400 205 V250 H0 Z" fill={color} />
    </g>
  );
}

function Water({ color, rough, shore }: { color: string; rough?: boolean; shore?: string }) {
  return (
    <g>
      {shore && <path d="M0 175 Q60 160 120 172 V250 H0 Z" fill={shore} />}
      <path d={rough ? "M0 175 q25 -22 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V250 H0 Z" : "M0 180 q40 -8 80 0 t80 0 t80 0 t80 0 t80 0 V250 H0 Z"} fill={color} />
      <path d="M0 205 q40 -6 80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" />
    </g>
  );
}

function Rainbow() {
  const cols = ["#ff5d5d", "#ff9f43", "#ffd23f", "#4cd17b", "#4aa8ff", "#8c6bff"];
  return (
    <g fill="none" strokeWidth="9" opacity="0.85">
      {cols.map((c, i) => (
        <path key={c} d={`M${40 + i * 9} 200 A ${160 - i * 9} ${150 - i * 9} 0 0 1 ${360 - i * 9} 200`} stroke={c} />
      ))}
    </g>
  );
}

function StormClouds() {
  return (
    <g fill="#5a6585">
      <Cloud x={80} y={40} s={2} />
      <Cloud x={260} y={30} s={2.4} />
      <path d="M210 60 l-14 30 h12 l-10 28 l26 -36 h-12 l10 -22 z" fill="#ffe680" />
    </g>
  );
}

function Rain() {
  return (
    <g stroke="#e3f1ff" strokeWidth="2" opacity="0.7">
      {Array.from({ length: 40 }, (_, i) => (
        <path key={i} d={`M${(i * 37) % 400} ${(i * 23) % 150} l-6 14`} />
      ))}
    </g>
  );
}

function VoidSwirls() {
  return (
    <g fill="none" stroke="#7f8cff" strokeOpacity="0.35" strokeWidth="3">
      <path d="M40 160 q80 -60 160 0 t160 0" />
      <path d="M20 190 q90 -40 180 0 t180 0" />
      <path d="M60 130 q70 -50 140 0 t140 0" />
    </g>
  );
}

function Underwater() {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={(i * 41) % 400} cy={240} r={3 + (i % 3)} fill="#fff" opacity="0.5" className="animate-bubble" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      <path d="M0 230 q60 -14 120 0 t120 0 t160 0 V250 H0 Z" fill="#e8d39a" />
      {[40, 340].map((x) => (
        <path key={x} d={`M${x} 240 q-10 -30 0 -60 q10 -30 0 -50`} stroke="#2f8f46" strokeWidth="6" fill="none" />
      ))}
    </g>
  );
}

function Palace() {
  return (
    <g fill="#f6e2ff" stroke="#c9a6ef" strokeWidth="2">
      <rect x="110" y="90" width="180" height="110" />
      {[120, 170, 220, 270].map((x) => (
        <rect key={x} x={x} y="110" width="10" height="90" fill="#e8ccff" />
      ))}
      <path d="M100 90 L200 50 L300 90 Z" fill="#ffd23f" />
    </g>
  );
}

function Temple() {
  return (
    <g fill="#e9dcff" opacity="0.9">
      <rect x="120" y="90" width="160" height="120" />
      <path d="M110 90 L200 56 L290 90 Z" fill="#ffd23f" />
      <rect x="185" y="140" width="30" height="70" fill="#7a5c9e" />
    </g>
  );
}

function CitySkyline() {
  return (
    <g fill="#e9c49c">
      {[[20, 120, 50, 90], [80, 100, 60, 110], [150, 130, 40, 80], [200, 90, 70, 120], [280, 115, 50, 95], [340, 105, 60, 105]].map(([x, y, w, h]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} />
          <rect x={x + w / 2 - 6} y={y + 20} width="12" height="14" fill="#a87a4e" />
        </g>
      ))}
    </g>
  );
}

function Houses() {
  return (
    <g>
      {[[50, 150], [140, 160], [290, 150]].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="56" height="46" fill="#f3d3a6" />
          <rect x={x - 4} y={y - 6} width="64" height="8" fill="#c99a5b" />
          <rect x={x + 22} y={y + 22} width="12" height="24" fill="#8a5a33" />
        </g>
      ))}
    </g>
  );
}

function Stable() {
  return (
    <g>
      <path d="M90 210 V120 L200 70 L310 120 V210 Z" fill="#7a5a3c" />
      <path d="M110 210 V130 L200 90 L290 130 V210 Z" fill="#4a3424" />
      <path d="M80 122 L200 64 L320 122" stroke="#5b3e26" strokeWidth="10" fill="none" />
    </g>
  );
}

function Tree({ x, y, s = 1, fruit = false }: { x: number; y: number; s?: number; fruit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="-10" width="10" height="34" rx="3" fill="#9b6a3a" />
      <circle cx="0" cy="-26" r="26" fill="#3fa34d" />
      <circle cx="-16" cy="-14" r="16" fill="#47b26b" />
      <circle cx="16" cy="-16" r="18" fill="#47b26b" />
      {fruit && [[-10, -30], [8, -20], [12, -36]].map(([fx, fy]) => <circle key={`${fx}`} cx={fx} cy={fy} r="4" fill="#ff5d5d" />)}
    </g>
  );
}

function Person({ x, y, robe, small }: { x: number; y: number; robe: string; small?: boolean }) {
  const s = small ? 0.75 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 0 q14 -44 28 0 v20 h-28 z" fill={robe} />
      <circle cx="0" cy="-30" r="11" fill="#d9a77c" />
      <path d="M-12 -34 q12 -14 24 0 v6 q-12 -6 -24 0 z" fill="#fffaf0" />
    </g>
  );
}

function Animal({ x, y, kind, big }: { x: number; y: number; kind: "lion" | "elephant" | "giraffe" | "sheep"; big?: boolean }) {
  const s = big ? 1.6 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {kind === "lion" && (
        <g>
          <ellipse cx="6" cy="6" rx="20" ry="12" fill="#f6b73c" />
          <circle cx="-14" cy="-6" r="15" fill="#d9822b" />
          <circle cx="-14" cy="-6" r="10" fill="#f6b73c" />
          <circle cx="-17" cy="-8" r="1.8" fill="#1f2547" />
          <circle cx="-11" cy="-8" r="1.8" fill="#1f2547" />
        </g>
      )}
      {kind === "elephant" && (
        <g fill="#9aa5b8">
          <ellipse cx="0" cy="0" rx="24" ry="16" />
          <circle cx="-22" cy="-8" r="13" />
          <ellipse cx="-14" cy="-8" rx="9" ry="12" fill="#b3bccb" />
          <path d="M-32 -4 q-6 16 2 22" stroke="#9aa5b8" strokeWidth="6" fill="none" />
          <circle cx="-26" cy="-11" r="1.8" fill="#1f2547" />
        </g>
      )}
      {kind === "giraffe" && (
        <g fill="#f5c04a">
          <ellipse cx="0" cy="4" rx="18" ry="11" />
          <rect x="-16" y="-40" width="8" height="44" rx="4" />
          <ellipse cx="-14" cy="-44" rx="9" ry="6" />
          <circle cx="-16" cy="-46" r="1.6" fill="#1f2547" />
          {[[-4, 2], [6, 6], [-12, -18]].map(([sx, sy]) => <circle key={`${sx}`} cx={sx} cy={sy} r="3" fill="#c98a2b" />)}
        </g>
      )}
      {kind === "sheep" && (
        <g>
          {[[-8, 0], [4, -4], [12, 2], [0, 4]].map(([sx, sy]) => <circle key={`${sx}${sy}`} cx={sx} cy={sy} r="9" fill="#fff" stroke="#e5ddd0" />)}
          <ellipse cx="-16" cy="-2" rx="6" ry="7" fill="#6b5b4b" />
          <circle cx="-17" cy="-4" r="1.4" fill="#fff" />
        </g>
      )}
    </g>
  );
}
