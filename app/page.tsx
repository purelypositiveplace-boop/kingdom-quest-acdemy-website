import Link from "next/link";
import { BookOpen, Gamepad2, Heart, Map, Music, Printer, ScrollText, ShieldCheck, Sparkles, Clock, Users, Ban, Gift } from "lucide-react";
import { KingdomScenery } from "@/components/layout/KingdomScenery";
import { Mascot } from "@/components/characters/Mascot";
import { CharacterBubble, MascotCard } from "@/components/characters/CharacterBubble";
import { PrimaryButton } from "@/components/ui/Button";
import { AgeSelector } from "@/components/ui/AgeSelector";
import { StoryCard, GameCard } from "@/components/ui/Cards";
import { DailyVerse } from "@/components/bible/DailyVerse";
import { getLesson, categoriesWithLessons } from "@/lib/curriculum";
import { GAME_BY_ID } from "@/data/games";
import { MASCOT_NOTE } from "@/data/mascots";
import { BRAND } from "@/lib/site";

const FEATURES = [
  { href: "/stories", title: "Bible Stories", text: "30 interactive lessons with storybooks and quizzes.", icon: BookOpen, color: "#ff7a59" },
  { href: "/games", title: "Learning Games", text: "16 games: matching, sorting, puzzles, trivia and more.", icon: Gamepad2, color: "#8c6bff" },
  { href: "/world", title: "Kingdom Quest World", text: "Explore 10 Bible lands on an adventure map.", icon: Map, color: "#1fa463" },
  { href: "/verses", title: "Memory Verses", text: "Flashcards, verse builder and gentle review.", icon: Sparkles, color: "#f0a92e" },
  { href: "/prayer", title: "Prayer Garden", text: "A peaceful place to learn how to pray.", icon: Heart, color: "#ff8fc1" },
  { href: "/bible", title: "Bible Reader", text: "All 66 books with kid-friendly help.", icon: ScrollText, color: "#2a48d4" },
  { href: "/music", title: "Songs", text: "Original sing-along songs.", icon: Music, color: "#6c7bff" },
  { href: "/printables", title: "Printables", text: "Colouring pages, worksheets and certificates.", icon: Printer, color: "#2ec4c4" },
];

export default function Home() {
  const featured = getLesson("creation")!;
  const featuredGame = GAME_BY_ID["ark-match"];
  const cats = categoriesWithLessons().slice(0, 12);
  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[640px] overflow-hidden md:min-h-[600px]">
        <KingdomScenery />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-4 pb-48 pt-10 md:grid-cols-[1.2fr_1fr] md:pb-40 md:pt-16">
          <div>
            <p className="inline-block rounded-full bg-white/80 px-4 py-1 font-display font-bold text-royal-dark shadow">100% free · No ads · Ages 3–12</p>
            <h1 className="mt-4 break-words font-display text-[2.1rem] font-bold leading-[1.05] min-[380px]:text-4xl sm:text-5xl text-royal-dark drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] md:text-7xl">
              BIG FAITH.
              <br />
              BIG ADVENTURES.
              <br />
              <span className="text-[#c46a00]">ENDLESS DISCOVERIES.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg font-semibold text-ink md:text-xl">
              Explore the Bible, discover amazing stories, play exciting games, and learn about God&apos;s love — one adventure at a time!
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton href="/start" size="xl" tone="sun" data-testid="start-learning">
                START LEARNING
              </PrimaryButton>
              <PrimaryButton href="/stories" size="lg" tone="royal">
                EXPLORE BIBLE STORIES
              </PrimaryButton>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <CharacterBubble id="leo" size={150} expression="excited">
              Hi! I&apos;m Leo. Let&apos;s go on a Kingdom Quest together!
            </CharacterBubble>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4">
        {/* LEVELS */}
        <section aria-labelledby="levels" className="-mt-24 relative z-10">
          <div className="card p-6 md:p-8">
            <h2 id="levels" className="text-center text-3xl font-bold text-royal-dark md:text-4xl">
              Choose your adventure level
            </h2>
            <p className="mb-6 text-center text-ink-soft">Every level explores the same Kingdom Quest World, with learning that fits your age.</p>
            <AgeSelector goTo="/start" />
          </div>
        </section>

        {/* FEATURED + VERSE */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-2xl font-bold text-royal-dark">Featured Bible story</h2>
            <StoryCard lesson={featured} minutes={featured.minutes.explorers} />
          </div>
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-2xl font-bold text-royal-dark">Today&apos;s memory verse</h2>
            <div className="card p-5">
              <DailyVerse />
              <Link href="/verses" className="mt-4 inline-block font-bold text-royal underline underline-offset-4">
                Practise memory verses →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-2xl font-bold text-royal-dark">Featured game</h2>
            <GameCard game={featuredGame} />
          </div>
        </section>

        {/* FEATURES */}
        <section aria-labelledby="features">
          <h2 id="features" className="mb-6 text-center text-3xl font-bold text-royal-dark md:text-4xl">
            So much to discover
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {FEATURES.map(({ href, title, text, icon: Icon, color }) => (
              <Link key={href} href={href} className="card group flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-1">
                <span className="flex h-16 w-16 items-center justify-center rounded-3xl shadow-[var(--shadow-toy)] transition group-hover:scale-110" style={{ background: color }}>
                  <Icon size={34} color="#fff" aria-hidden />
                </span>
                <span className="font-display text-lg font-bold text-royal-dark">{title}</span>
                <span className="hidden text-sm text-ink-soft sm:block">{text}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* TOPICS */}
        <section aria-labelledby="topics">
          <h2 id="topics" className="mb-4 text-3xl font-bold text-royal-dark">
            Bible topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {cats.map((c) => (
              <Link key={c.id} href={`/stories?category=${c.id}`} className="min-h-12 rounded-full bg-white px-5 py-3 font-display font-semibold text-royal-dark shadow transition hover:bg-royal hover:text-white">
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* MASCOTS */}
        <section aria-labelledby="guides">
          <h2 id="guides" className="mb-2 text-center text-3xl font-bold text-royal-dark md:text-4xl">
            Meet your guides
          </h2>
          <p className="mb-6 text-center text-sm text-ink-soft">{MASCOT_NOTE}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {(["leo", "sunny", "oliver", "grace", "finn"] as const).map((id) => (
              <MascotCard key={id} id={id} />
            ))}
          </div>
        </section>

        {/* PARENTS */}
        <section aria-labelledby="parents" className="card overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <h2 id="parents" className="text-3xl font-bold text-royal-dark">
                For parents and grown-ups
              </h2>
              <p className="mt-2 max-w-2xl text-lg text-ink-soft">{BRAND.tagline} Kingdom Quest Academy teaches the Bible warmly and accurately, with Scripture clearly marked and kept separate from retellings and explanations.</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Gift, t: "Free forever", d: "Every lesson, game and activity is free. No subscriptions or locked content." },
                  { icon: Ban, t: "No ads or trackers", d: "No advertising, no third-party tracking scripts." },
                  { icon: ShieldCheck, t: "Safe by design", d: "No chat, no public profiles, no posting. Children never need an email." },
                  { icon: Users, t: "You're in control", d: "Parent accounts own child profiles. Export or delete data any time." },
                  { icon: BookOpen, t: "Real Scripture", d: "Bible text from the public-domain World English Bible. No invented verses." },
                  { icon: Clock, t: "Short sessions", d: "3–20 minute sessions sized for each age. No guilt-trip streaks." },
                ].map(({ icon: Icon, t, d }) => (
                  <li key={t} className="flex gap-3">
                    <Icon className="mt-1 shrink-0 text-royal" size={26} aria-hidden />
                    <span>
                      <span className="block font-bold text-ink">{t}</span>
                      <span className="text-sm text-ink-soft">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton href="/parents" tone="royal">
                  Parent dashboard
                </PrimaryButton>
                <PrimaryButton href="/safety" tone="white">
                  Privacy &amp; safety
                </PrimaryButton>
              </div>
            </div>
            <div className="hidden items-end md:flex">
              <Mascot id="grace" size={180} expression="calm" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
