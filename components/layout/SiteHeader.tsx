"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Gamepad2, Home, Map, Sparkles, Star, Users, Grid3x3 } from "lucide-react";
import { Logo } from "./Logo";
import { useHydrated, useKQ } from "@/lib/progress/store";
import { LEVELS } from "@/lib/curriculum/levels";

export const CHILD_NAV = [
  { href: "/learn", label: "My Quest", icon: Home, color: "#2a48d4" },
  { href: "/stories", label: "Stories", icon: BookOpen, color: "#ff7a59" },
  { href: "/world", label: "World", icon: Map, color: "#1fa463" },
  { href: "/games", label: "Games", icon: Gamepad2, color: "#8c6bff" },
  { href: "/verses", label: "Verses", icon: Sparkles, color: "#f0a92e" },
  { href: "/explore", label: "More", icon: Grid3x3, color: "#2ec4c4" },
];

export function SiteHeader() {
  const path = usePathname();
  const hydrated = useHydrated();
  const profile = useKQ((s) => s.profile);
  const stars = useKQ((s) => s.progress.stars);
  const gamified = useKQ((s) => s.settings.gamification);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-royal focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" aria-label="Kingdom Quest Academy home" className="shrink-0">
          <Logo compact />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {CHILD_NAV.map(({ href, label, icon: Icon, color }) => {
            const active = path === href || path?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center gap-2 rounded-full px-4 font-display font-semibold transition hover:bg-royal-soft ${active ? "bg-royal-soft text-royal-dark" : "text-ink"}`}
              >
                <Icon size={22} color={color} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {hydrated && profile && gamified && (
            <Link href="/rewards" className="flex min-h-11 items-center gap-1 rounded-full bg-sun px-3 font-display font-bold text-ink shadow" aria-label={`${stars} Bible Stars. See rewards`}>
              <Star size={20} fill="#fff" aria-hidden /> {stars}
            </Link>
          )}
          {hydrated && profile && (
            <span className="hidden rounded-full bg-royal-soft px-3 py-2 text-sm font-bold text-royal-dark sm:inline">
              {profile.nickname} · {LEVELS[profile.level].name}
            </span>
          )}
          <Link href="/parents" className="flex min-h-11 items-center gap-1 rounded-full border-2 border-royal-soft px-3 text-sm font-bold text-royal-dark hover:bg-royal-soft">
            <Users size={18} aria-hidden /> <span className="hidden sm:inline">Grown-ups</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Large picture tabs pinned to the bottom on phones and tablets. */
export function ChildNavigation() {
  const path = usePathname();
  if (path?.startsWith("/parents") || path?.startsWith("/admin")) return null;
  return (
    <nav aria-label="Learning" className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-6">
        {CHILD_NAV.map(({ href, label, icon: Icon, color }) => {
          const active = path === href || path?.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${active ? "text-royal-dark" : "text-ink-soft"}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${active ? "bg-royal-soft" : ""}`}>
                  <Icon size={24} color={color} aria-hidden />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
