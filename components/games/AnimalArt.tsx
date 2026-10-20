import { r2, cos as kcos, sin as ksin } from "@/lib/geom";
/** Original cartoon animal faces for Noah's Ark games (SVG, no licensed art). */
export type AnimalKind = "lion" | "elephant" | "giraffe" | "sheep" | "bear" | "rabbit" | "monkey" | "pig" | "cow" | "fox" | "owl" | "zebra";

export const ANIMAL_FACTS: Record<AnimalKind, { name: string; fact: string }> = {
  lion: { name: "Lion", fact: "A lion's roar can be heard about 5 miles (8 km) away!" },
  elephant: { name: "Elephant", fact: "Elephants use their trunks to drink, smell, and say hello." },
  giraffe: { name: "Giraffe", fact: "Giraffes are the tallest animals in the world." },
  sheep: { name: "Sheep", fact: "Sheep know their shepherd's voice. Jesus called himself the Good Shepherd." },
  bear: { name: "Bear", fact: "Some bears sleep through most of the winter." },
  rabbit: { name: "Rabbit", fact: "A rabbit's teeth never stop growing!" },
  monkey: { name: "Monkey", fact: "Many monkeys use their tails like an extra hand." },
  pig: { name: "Pig", fact: "Pigs are very smart and can learn tricks." },
  cow: { name: "Cow", fact: "Cows have best friends and feel calmer together." },
  fox: { name: "Fox", fact: "Foxes use their fluffy tails like a warm blanket." },
  owl: { name: "Owl", fact: "Owls can turn their heads much farther than we can." },
  zebra: { name: "Zebra", fact: "No two zebras have exactly the same stripes." },
};

export function AnimalArt({ kind, size = 72 }: { kind: AnimalKind; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={ANIMAL_FACTS[kind].name}>
      <Face kind={kind} />
    </svg>
  );
}

function Eyes({ y = 46, gap = 14, color = "#1f2547" }: { y?: number; gap?: number; color?: string }) {
  return (
    <g>
      <circle cx={50 - gap} cy={y} r="5" fill={color} />
      <circle cx={50 + gap} cy={y} r="5" fill={color} />
      <circle cx={50 - gap + 1.6} cy={y - 1.8} r="1.8" fill="#fff" />
      <circle cx={50 + gap + 1.6} cy={y - 1.8} r="1.8" fill="#fff" />
    </g>
  );
}
const Smile = ({ y = 64 }: { y?: number }) => <path d={`M42 ${y} q8 7 16 0`} stroke="#1f2547" strokeWidth="3" fill="none" strokeLinecap="round" />;

function Face({ kind }: { kind: AnimalKind }) {
  switch (kind) {
    case "lion":
      return (
        <g>
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={r2(50 + kcos((i / 12) * 6.283) * 32)} cy={r2(52 + ksin((i / 12) * 6.283) * 32)} r="13" fill="#d9822b" />)}
          <circle cx="50" cy="52" r="30" fill="#f6b73c" />
          <ellipse cx="50" cy="63" rx="13" ry="9" fill="#fff3dc" />
          <Eyes y={48} gap={11} />
          <path d="M46 58 h8 l-4 4 z" fill="#7a4a1d" />
          <Smile y={66} />
        </g>
      );
    case "elephant":
      return (
        <g>
          <ellipse cx="22" cy="48" rx="18" ry="24" fill="#9aa5b8" />
          <ellipse cx="78" cy="48" rx="18" ry="24" fill="#9aa5b8" />
          <circle cx="50" cy="48" r="28" fill="#b3bccb" />
          <path d="M50 58 q-4 22 6 32" stroke="#b3bccb" strokeWidth="12" fill="none" strokeLinecap="round" />
          <Eyes y={44} gap={12} />
        </g>
      );
    case "giraffe":
      return (
        <g>
          <rect x="34" y="6" width="5" height="18" fill="#c98a2b" />
          <rect x="61" y="6" width="5" height="18" fill="#c98a2b" />
          <circle cx="36" cy="6" r="5" fill="#c98a2b" />
          <circle cx="64" cy="6" r="5" fill="#c98a2b" />
          <ellipse cx="50" cy="50" rx="26" ry="34" fill="#f5c04a" />
          {[[36, 30], [62, 36], [44, 76], [64, 66]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="5" fill="#c98a2b" />)}
          <ellipse cx="50" cy="70" rx="15" ry="11" fill="#f8d98a" />
          <Eyes y={46} gap={11} />
          <Smile y={72} />
        </g>
      );
    case "sheep":
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={r2(50 + kcos((i / 10) * 6.283) * 30)} cy={r2(50 + ksin((i / 10) * 6.283) * 30)} r="14" fill="#fff" stroke="#e5ddd0" />)}
          <ellipse cx="50" cy="54" rx="20" ry="24" fill="#6b5b4b" />
          <Eyes y={50} gap={8} color="#fff" />
          <path d="M44 66 q6 5 12 0" stroke="#fff" strokeWidth="3" fill="none" />
        </g>
      );
    case "bear":
      return (
        <g>
          <circle cx="24" cy="24" r="12" fill="#8a5a33" />
          <circle cx="76" cy="24" r="12" fill="#8a5a33" />
          <circle cx="50" cy="52" r="34" fill="#a0673a" />
          <ellipse cx="50" cy="64" rx="15" ry="11" fill="#e3c4a0" />
          <Eyes y={46} gap={12} />
          <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#1f2547" />
          <Smile y={67} />
        </g>
      );
    case "rabbit":
      return (
        <g>
          <ellipse cx="36" cy="20" rx="8" ry="20" fill="#f1e7f5" />
          <ellipse cx="64" cy="20" rx="8" ry="20" fill="#f1e7f5" />
          <ellipse cx="36" cy="20" rx="4" ry="14" fill="#ffb3c8" />
          <ellipse cx="64" cy="20" rx="4" ry="14" fill="#ffb3c8" />
          <circle cx="50" cy="58" r="28" fill="#f1e7f5" />
          <Eyes y={54} gap={11} />
          <ellipse cx="50" cy="64" rx="4" ry="3" fill="#ff8fa3" />
          <Smile y={70} />
        </g>
      );
    case "monkey":
      return (
        <g>
          <circle cx="18" cy="50" r="12" fill="#8a5a33" />
          <circle cx="82" cy="50" r="12" fill="#8a5a33" />
          <circle cx="50" cy="50" r="32" fill="#8a5a33" />
          <path d="M28 52 q0 -26 22 -18 q22 -8 22 18 q0 26 -22 26 q-22 0 -22 -26 z" fill="#e3c4a0" />
          <Eyes y={46} gap={10} />
          <Smile y={64} />
        </g>
      );
    case "pig":
      return (
        <g>
          <path d="M22 26 l10 16 l-16 0 z" fill="#ffa3b8" />
          <path d="M78 26 l-10 16 l16 0 z" fill="#ffa3b8" />
          <circle cx="50" cy="54" r="32" fill="#ffc2d1" />
          <ellipse cx="50" cy="62" rx="14" ry="10" fill="#ff9eb5" />
          <circle cx="45" cy="62" r="2.5" fill="#c4627a" />
          <circle cx="55" cy="62" r="2.5" fill="#c4627a" />
          <Eyes y={46} gap={12} />
        </g>
      );
    case "cow":
      return (
        <g>
          <path d="M26 20 q-6 -10 -12 -4" stroke="#f2e6c9" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M74 20 q6 -10 12 -4" stroke="#f2e6c9" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="50" rx="30" ry="32" fill="#fff" stroke="#e5ddd0" />
          <circle cx="34" cy="34" r="9" fill="#1f2547" />
          <ellipse cx="50" cy="70" rx="20" ry="12" fill="#ffc2d1" />
          <Eyes y={48} gap={12} />
          <circle cx="44" cy="70" r="2.5" fill="#c4627a" />
          <circle cx="56" cy="70" r="2.5" fill="#c4627a" />
        </g>
      );
    case "fox":
      return (
        <g>
          <path d="M18 14 l18 26 l-22 8 z" fill="#ff8a3c" />
          <path d="M82 14 l-18 26 l22 8 z" fill="#ff8a3c" />
          <path d="M14 46 q36 -30 72 0 q-10 34 -36 44 q-26 -10 -36 -44 z" fill="#ff8a3c" />
          <path d="M28 58 q22 10 44 0 q-8 24 -22 30 q-14 -6 -22 -30 z" fill="#fff" />
          <Eyes y={50} gap={12} />
          <circle cx="50" cy="80" r="4" fill="#1f2547" />
        </g>
      );
    case "owl":
      return (
        <g>
          <path d="M22 18 l12 14 l-16 4 z M78 18 l-12 14 l16 4 z" fill="#a7774f" />
          <ellipse cx="50" cy="56" rx="34" ry="36" fill="#a7774f" />
          <circle cx="36" cy="46" r="13" fill="#fff" />
          <circle cx="64" cy="46" r="13" fill="#fff" />
          <Eyes y={46} gap={14} />
          <path d="M45 58 l5 8 l5 -8 z" fill="#f2a33a" />
        </g>
      );
    case "zebra":
      return (
        <g>
          <ellipse cx="32" cy="18" rx="7" ry="13" fill="#fff" stroke="#1f2547" strokeWidth="2" />
          <ellipse cx="68" cy="18" rx="7" ry="13" fill="#fff" stroke="#1f2547" strokeWidth="2" />
          <ellipse cx="50" cy="52" rx="26" ry="36" fill="#fff" stroke="#1f2547" strokeWidth="2" />
          {[30, 40, 50].map((y) => <path key={y} d={`M26 ${y} q10 4 14 0 M60 ${y} q4 4 14 0`} stroke="#1f2547" strokeWidth="4" fill="none" />)}
          <ellipse cx="50" cy="74" rx="16" ry="12" fill="#3d3a4f" />
          <Eyes y={48} gap={11} />
        </g>
      );
  }
}
