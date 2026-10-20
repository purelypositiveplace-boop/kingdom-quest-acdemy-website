import { BookOpen, Cross, Fish, Grid3x3, Heart, Layers, Leaf, Map, Puzzle, ScrollText, Shield, Ship, Sun, HelpCircle, Type } from "lucide-react";
import type { GameInfo } from "@/data/games";

const ICONS: Record<GameInfo["icon"], typeof Ship> = {
  ark: Ship, cards: Layers, lion: Shield, fish: Fish, sun: Sun, tablets: ScrollText, leaf: Leaf, book: BookOpen,
  question: HelpCircle, grid: Grid3x3, cross: Cross, puzzle: Puzzle, heart: Heart, map: Map, words: Type,
};

export function GameIcon({ icon, size = 64 }: { icon: GameInfo["icon"]; size?: number }) {
  const I = ICONS[icon] ?? Puzzle;
  return (
    <span className="flex items-center justify-center rounded-3xl bg-white/25 p-3 shadow-inner">
      <I size={size} color="#fff" strokeWidth={2.2} aria-hidden />
    </span>
  );
}
