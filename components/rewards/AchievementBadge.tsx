import { Award, BookOpen, Crown, Feather, Flame, Heart, Leaf, Map, Ship, Star, Sun, Fish, Medal } from "lucide-react";
import type { Achievement } from "@/data/achievements";
import { badgeArt } from "@/lib/art";

const ICONS = { star: Star, leaf: Leaf, ark: Ship, crown: Crown, heart: Heart, book: BookOpen, dove: Feather, lion: Award, map: Map, fish: Fish, flame: Flame, sun: Sun };

/** A collectible badge. Locked badges are shown softly with a clear text label (not colour only). */
export function AchievementBadge({ a, earned, size = "md" }: { a: Achievement; earned: boolean; size?: "md" | "lg" }) {
  const Icon = ICONS[a.icon] ?? Medal;
  const dim = size === "lg" ? "h-28 w-28" : "h-20 w-20";
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={`relative flex ${dim} items-center justify-center rounded-full border-4 ${earned ? "border-white shadow-[var(--shadow-toy)]" : "border-dashed border-ink/20 bg-ink/5"}`}
        style={earned ? { background: `radial-gradient(circle at 35% 30%, #fff8, transparent 40%), ${a.color}` } : undefined}
      >
        {earned && badgeArt(a.id) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={badgeArt(a.id)} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          <Icon size={size === "lg" ? 52 : 36} color={earned ? "#fff" : "#9aa0bd"} strokeWidth={2.4} aria-hidden />
        )}
        {a.kind !== "badge" && earned && <span className="absolute -bottom-2 rounded-full bg-royal px-2 text-[10px] font-bold uppercase text-white">{a.kind}</span>}
      </div>
      <div>
        <p className={`font-display font-bold ${earned ? "text-royal-dark" : "text-ink-soft"}`}>{a.title}</p>
        <p className="text-xs text-ink-soft">{earned ? "Earned!" : a.description}</p>
      </div>
    </div>
  );
}
