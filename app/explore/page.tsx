import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Cross, Heart, Map, Music, Printer, ScrollText, Search, Sparkles, Star, Trophy, Users, Flower2 } from "lucide-react";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = { title: "Explore Everything", alternates: { canonical: "/explore" } };

const TILES = [
  { href: "/prayer", label: "Prayer Garden", icon: Flower2, color: "#ff8fc1" },
  { href: "/jesus", label: "Learn About Jesus", icon: Cross, color: "#f0a92e" },
  { href: "/bible/listen", label: "Read Me the Bible", icon: BookOpen, color: "#8a5a33" },
  { href: "/bible", label: "Bible Reader", icon: ScrollText, color: "#2a48d4" },
  { href: "/characters", label: "Bible People", icon: Users, color: "#ff7a59" },
  { href: "/map", label: "Bible Map", icon: Map, color: "#e0a045" },
  { href: "/timeline", label: "Timeline", icon: Clock, color: "#6c7bff" },
  { href: "/values", label: "Living with Love", icon: Heart, color: "#ff7eb6" },
  { href: "/music", label: "Songs", icon: Music, color: "#8c6bff" },
  { href: "/printables", label: "Printables", icon: Printer, color: "#2ec4c4" },
  { href: "/rewards", label: "My Rewards", icon: Trophy, color: "#ffd23f" },
  { href: "/verses", label: "Memory Verses", icon: Sparkles, color: "#1fa463" },
  { href: "/stories", label: "Bible Stories", icon: BookOpen, color: "#ff7a59" },
  { href: "/search", label: "Search", icon: Search, color: "#4a5078" },
  { href: "/world", label: "Kingdom Quest World", icon: Star, color: "#1fa463" },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Explore" subtitle="Every corner of Kingdom Quest Academy." color="#2ec4c4" mascot={<Mascot id="finn" size={100} expression="excited" />} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {TILES.map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href} className="card flex min-h-36 flex-col items-center justify-center gap-3 p-4 text-center transition hover:-translate-y-1">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl shadow-[var(--shadow-toy)]" style={{ background: color }}>
              <Icon size={34} color="#fff" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold text-royal-dark">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
