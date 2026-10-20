"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { WORLD_BY_ID } from "@/data/worlds";
import { GAME_BY_ID } from "@/data/games";
import { ACHIEVEMENT_BY_ID } from "@/data/achievements";
import { VALUES } from "@/data/values";
import { lessonsInWorld } from "@/lib/curriculum";
import { useHydrated, useKQ } from "@/lib/progress/store";
import { useLevel } from "@/lib/progress/useLevel";
import { SceneArt } from "@/components/bible/SceneArt";
import { CharacterBubble } from "@/components/characters/CharacterBubble";
import { StoryCard, GameCard } from "@/components/ui/Cards";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { AchievementBadge } from "@/components/rewards/AchievementBadge";
import { Confetti } from "@/components/rewards/RewardCelebration";
import { MASCOTS } from "@/data/mascots";

/** One land in Kingdom Quest World: intro, lessons, games, facts, badge and progress. */
export function AdventureLocation({ id }: { id: string }) {
  const w = WORLD_BY_ID[id];
  const level = useLevel();
  const hydrated = useHydrated();
  const done = useKQ((s) => s.progress.lessons);
  const badges = useKQ((s) => s.progress.badges);
  const games = useKQ((s) => s.progress.games);
  const gamified = useKQ((s) => s.settings.gamification);
  const profile = useKQ((s) => s.profile);
  const setProfile = useKQ((s) => s.setProfile);
  const lessons = lessonsInWorld(id);
  const d = lessons.filter((l) => done[l.id]).length;
  const complete = hydrated && lessons.length > 0 && d === lessons.length;
  const badge = ACHIEVEMENT_BY_ID[w.badge];

  useEffect(() => {
    if (hydrated && profile && profile.world !== id) setProfile({ world: id });
  }, [hydrated, profile, id, setProfile]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6" data-testid={`world-${id}`}>
      <Link href="/world" className="inline-flex min-h-11 items-center gap-1 font-bold text-royal underline">
        <ArrowLeft size={18} aria-hidden /> Kingdom Quest World map
      </Link>
      <header className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
        <SceneArt theme={w.theme} props={w.theme === "sea" ? ["ark", "rainbow"] : w.theme === "garden" ? ["trees", "flowers", "animals"] : w.theme === "desert" ? ["palm", "camels", "sun"] : ["sun", "clouds"]} alt={`${w.name} scenery`} className="h-56 w-full md:h-80" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6">
          <p className="font-display text-lg font-bold text-sun">{w.tagline}</p>
          <h1 className="text-4xl font-bold text-white drop-shadow md:text-6xl">{w.name}</h1>
        </div>
      </header>
      <div className="animate-pop">
        <CharacterBubble id={w.guide} size={100} expression="excited">
          {w.intro} <span className="text-sm text-ink-soft">— {MASCOTS[w.guide].name}</span>
        </CharacterBubble>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section aria-labelledby="land-lessons" className="space-y-4">
          <h2 id="land-lessons" className="text-2xl font-bold text-royal-dark">
            Bible stories in {w.name}
          </h2>
          {lessons.length === 0 ? (
            <p className="text-ink-soft">Practise the lessons below while new stories for this land are being written.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {lessons.map((l) => (
                <StoryCard key={l.id} lesson={l} done={Boolean(done[l.id])} minutes={l.minutes[level]} />
              ))}
            </div>
          )}
          {id === "kindness-garden" && (
            <div className="card p-5">
              <h3 className="text-xl font-bold text-royal-dark">Living with Love lessons</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {VALUES.map((v) => (
                  <li key={v.id}>
                    <Link href={`/values/${v.id}`} className="inline-flex min-h-11 items-center rounded-full bg-coral-soft px-4 font-semibold text-ink">
                      {v.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h2 className="pt-4 text-2xl font-bold text-royal-dark">Games in this land</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {w.games.map((g) => GAME_BY_ID[g] && <GameCard key={g} game={GAME_BY_ID[g]} wins={games[g]?.wins ?? 0} />)}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="card space-y-3 p-5">
            <h2 className="text-xl font-bold text-royal-dark">Your progress</h2>
            <ProgressTracker value={hydrated ? d : 0} max={lessons.length} label="Lessons finished" color={w.color} />
            {gamified && badge && <AchievementBadge a={badge} earned={Boolean(badges[badge.id])} size="lg" />}
          </div>
          <div className="card space-y-2 p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-royal-dark">
              <Lightbulb className="text-gold" aria-hidden /> Fun facts
            </h2>
            <ul className="space-y-2">
              {w.facts.map((f) => (
                <li key={f} className="rounded-2xl bg-sun/20 p-3 text-ink">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {complete && (
        <section className="card relative overflow-hidden p-8 text-center" role="status">
          {gamified && <Confetti count={40} />}
          <h2 className="text-3xl font-bold text-royal-dark">You explored every story in {w.name}!</h2>
          <p className="mt-2 text-lg text-ink-soft">Choose another land on the map to keep your quest going.</p>
          <Link href="/world" className="btn-toy mt-4 bg-sun text-ink">
            Back to the map
          </Link>
        </section>
      )}
    </div>
  );
}
