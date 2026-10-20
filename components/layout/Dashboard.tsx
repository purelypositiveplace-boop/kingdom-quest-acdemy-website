"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookOpen, Play, Sparkles, Star, Trophy, Map as MapIcon } from "lucide-react";
import { useHydrated, useKQ } from "@/lib/progress/store";
import { LESSONS, LESSON_BY_ID, nextLesson } from "@/lib/curriculum";
import { LEVELS } from "@/lib/curriculum/levels";
import { WORLDS, WORLD_BY_ID, STARTER_WORLDS } from "@/data/worlds";
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID } from "@/data/achievements";
import { GAMES } from "@/data/games";
import { MEMORY_VERSES } from "@/data/verses/memory-verses";
import { Mascot } from "@/components/characters/Mascot";
import { CharacterBubble } from "@/components/characters/CharacterBubble";
import { PrimaryButton } from "@/components/ui/Button";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { StoryCard } from "@/components/ui/Cards";
import { AchievementBadge } from "@/components/rewards/AchievementBadge";
import { LoadingState } from "@/components/ui/states";
import { SceneArt } from "@/components/bible/SceneArt";
import type { MascotId } from "@/lib/curriculum/types";
import { DailyVerse } from "@/components/bible/DailyVerse";

/** A gentle daily challenge that rotates by date. Missing a day never costs anything. */
function dailyChallenge(date = new Date()) {
  const day = Math.floor(date.getTime() / 86400000);
  const g = GAMES[day % GAMES.length];
  return { title: `Play ${g.title}`, href: `/games/${g.id}`, color: g.color };
}

export function Dashboard() {
  const hydrated = useHydrated();
  const profile = useKQ((s) => s.profile);
  const progress = useKQ((s) => s.progress);
  const gamified = useKQ((s) => s.settings.gamification);
  const account = useKQ((s) => s.account);
  const recommended = useKQ((s) => s.settings.recommended);
  const level = profile?.level ?? "explorers";
  const done = useMemo(() => new Set(Object.keys(progress.lessons)), [progress.lessons]);
  const levelLessons = LESSONS.filter((l) => l.ages.includes(level));
  const inProgress = Object.entries(progress.scenes)
    .filter(([id, n]) => n > 0 && !done.has(id) && LESSON_BY_ID[id])
    .map(([id]) => LESSON_BY_ID[id])[0];
  const lastDone = [...progress.history].reverse().find((h) => h.type === "lesson")?.id;
  const world = WORLD_BY_ID[profile?.world ?? "creation-garden"];
  const worldFirst = LESSONS.find((l) => l.world === world?.id && !done.has(l.id));
  const suggested = inProgress ?? (done.size === 0 ? worldFirst : undefined) ?? nextLesson(lastDone, done, level);
  const versesLearned = Object.values(progress.verses).filter((v) => v.box >= 3).length;
  const earned = ACHIEVEMENTS.filter((a) => progress.badges[a.id]).sort((a, b) => progress.badges[b.id] - progress.badges[a.id]);
  const challenge = dailyChallenge();

  if (!hydrated) return <LoadingState />;
  if (!profile)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card p-8 text-center">
          <Mascot id="leo" size={150} expression="excited" className="mx-auto" />
          <h1 className="mt-3 text-3xl font-bold text-royal-dark">Let&apos;s start your Kingdom Quest!</h1>
          <p className="mt-2 text-ink-soft">Pick a nickname and a level, and your adventure begins.</p>
          <PrimaryButton href="/start" size="xl" className="mt-6">
            Start my quest
          </PrimaryButton>
        </div>
      </div>
    );

  const greeter: MascotId = done.size === 0 ? "sunny" : LEVELS[level].guide;
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6" data-testid="dashboard">
      <section className="card relative overflow-hidden p-6 md:p-8" style={{ background: "linear-gradient(135deg, #e3e9ff, #fff7d6)" }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-white p-2 shadow-[var(--shadow-toy)]">
              <Mascot id={(profile.avatar as MascotId) ?? "leo"} size={96} animate="none" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
                {LEVELS[level].short} · {LEVELS[level].name} · {LEVELS[level].ages}
              </p>
              <h1 className="text-3xl font-bold text-royal-dark md:text-4xl" data-testid="dashboard-name">
                Hi, {profile.nickname}!
              </h1>
              {account && <p className="text-sm text-ink-soft">Saved to your family account</p>}
            </div>
          </div>
          <div className="flex-1">
            <CharacterBubble id={greeter} size={84} expression="happy" side="right">
              {done.size === 0 ? "Welcome! I'm Sunny. Pick an adventure and we'll learn about God's big love!" : `Welcome back! You've finished ${done.size} ${done.size === 1 ? "lesson" : "lessons"}. Let's keep going!`}
            </CharacterBubble>
          </div>
        </div>
        {gamified && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Star, label: "Bible Stars", value: progress.stars, color: "#f0a92e" },
              { icon: Trophy, label: "Badges", value: earned.length, color: "#8c6bff" },
              { icon: Sparkles, label: "Verses learned", value: versesLearned, color: "#1fa463" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center rounded-3xl bg-white p-3 text-center shadow-sm">
                <Icon size={28} color={color} fill={label === "Bible Stars" ? color : "none"} aria-hidden />
                <span className="font-display text-3xl font-bold text-ink" data-testid={`stat-${label}`}>
                  {value}
                </span>
                <span className="text-xs font-bold text-ink-soft">{label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {recommended?.length > 0 && LESSON_BY_ID[recommended[0]] && (
        <section className="card flex flex-wrap items-center gap-4 p-5" aria-label="Recommended by your grown-up">
          <Star className="fill-sun text-gold" size={32} aria-hidden />
          <div className="mr-auto">
            <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">Recommended by your grown-up</p>
            <p className="font-display text-2xl font-bold text-royal-dark">{LESSON_BY_ID[recommended[0]].title}</p>
          </div>
          <PrimaryButton href={`/lessons/${recommended[0]}`} tone="sun">
            Let&apos;s go
          </PrimaryButton>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-royal-dark">{inProgress ? "Continue learning" : "Suggested next lesson"}</h2>
          {suggested && (
            <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
              <StoryCard lesson={suggested} minutes={suggested.minutes[level]} />
              <div className="flex flex-col justify-center gap-3">
                <PrimaryButton href={`/lessons/${suggested.id}`} tone="sun" size="lg" icon={<Play aria-hidden />} data-testid="continue-learning">
                  {inProgress ? "Continue" : "Start"}
                </PrimaryButton>
                <p className="text-sm text-ink-soft">About {suggested.minutes[level]} minutes</p>
              </div>
            </div>
          )}
          <ProgressTracker value={levelLessons.filter((l) => done.has(l.id)).length} max={levelLessons.length} label="My learning journey" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-royal-dark">Daily Bible challenge</h2>
          <Link href={challenge.href} className="card flex items-center gap-4 p-4 transition hover:-translate-y-1" style={{ borderLeft: `10px solid ${challenge.color}` }}>
            <Sparkles size={36} color={challenge.color} aria-hidden />
            <span>
              <span className="block font-display text-xl font-bold text-royal-dark">{challenge.title}</span>
              <span className="text-sm text-ink-soft">A fun pick for today. No pressure!</span>
            </span>
          </Link>
          <div className="card p-4">
            <h3 className="mb-2 font-display text-lg font-bold text-royal-dark">Verse of the day</h3>
            <DailyVerse size="sm" />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold text-royal-dark">Choose an adventure world</h2>
          <Link href="/world" className="flex items-center gap-1 font-bold text-royal underline">
            <MapIcon size={18} aria-hidden /> See the whole map
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {WORLDS.filter((w) => STARTER_WORLDS.includes(w.id) || w.id === world?.id)
            .slice(0, 3)
            .map((w) => {
              const ls = LESSONS.filter((l) => l.world === w.id);
              const d = ls.filter((l) => done.has(l.id)).length;
              return (
                <Link key={w.id} href={`/world/${w.id}`} className="card overflow-hidden transition hover:-translate-y-1" data-testid={`dash-world-${w.id}`}>
                  <SceneArt theme={w.theme} props={[]} alt="" className="h-28 w-full" />
                  <span className="block space-y-2 p-4">
                    <span className="block font-display text-xl font-bold text-royal-dark">
                      {w.name} {world?.id === w.id && <span className="ml-1 rounded-full bg-sun px-2 text-xs">Current</span>}
                    </span>
                    <ProgressTracker value={d} max={ls.length} label="Lessons" color={w.color} />
                  </span>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-2xl font-bold text-royal-dark">Completed Bible stories</h2>
          {done.size === 0 ? (
            <p className="mt-2 text-ink-soft">Your finished stories will show up here.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {[...done].slice(-8).reverse().map((id) => (
                <li key={id}>
                  <Link href={`/lessons/${id}`} className="flex items-center gap-2 rounded-xl px-2 py-2 font-semibold text-ink hover:bg-sky-soft">
                    <BookOpen size={18} className="text-emerald" aria-hidden /> {LESSON_BY_ID[id]?.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {gamified && (
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-royal-dark">Recent achievements</h2>
              <Link href="/rewards" className="font-bold text-royal underline">
                All rewards
              </Link>
            </div>
            {earned.length === 0 ? (
              <p className="mt-2 text-ink-soft">Finish your first lesson to earn the Bible Story Beginner badge!</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3" data-testid="recent-badges">
                {earned.slice(0, 6).map((a) => (
                  <AchievementBadge key={a.id} a={ACHIEVEMENT_BY_ID[a.id]} earned />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <p className="text-center text-xs text-ink-soft">{MEMORY_VERSES.length} memory verses and {LESSONS.length} lessons are waiting for you.</p>
    </div>
  );
}
