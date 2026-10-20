"use client";

import { Star } from "lucide-react";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useHydrated, useKQ } from "@/lib/progress/store";
import { AchievementBadge } from "./AchievementBadge";
import { PrimaryButton } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/states";

export function RewardsView() {
  const hydrated = useHydrated();
  const progress = useKQ((s) => s.progress);
  const gamified = useKQ((s) => s.settings.gamification);
  if (!hydrated) return <LoadingState />;
  if (!gamified)
    return (
      <div className="card p-6 text-center">
        <p className="text-lg text-ink">Stars and badges are turned off by your grown-up. Keep learning and exploring!</p>
      </div>
    );
  const earned = ACHIEVEMENTS.filter((a) => progress.badges[a.id]);
  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-center gap-6 p-6 text-center">
        <div>
          <Star size={48} className="mx-auto fill-gold text-gold" aria-hidden />
          <p className="font-display text-4xl font-bold text-ink">{progress.stars}</p>
          <p className="font-bold text-ink-soft">Bible Stars</p>
        </div>
        <div>
          <p className="font-display text-4xl font-bold text-ink">
            {earned.length} / {ACHIEVEMENTS.length}
          </p>
          <p className="font-bold text-ink-soft">Badges collected</p>
        </div>
        <PrimaryButton href="/printables/certificate" tone="royal">
          Print my certificate
        </PrimaryButton>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {ACHIEVEMENTS.map((a) => (
          <div key={a.id} className="card p-4" data-testid={`badge-${a.id}`} data-earned={Boolean(progress.badges[a.id])}>
            <AchievementBadge a={a} earned={Boolean(progress.badges[a.id])} />
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-soft">Missed a day? That&apos;s fine! There are no streaks to lose here. Come back whenever you like.</p>
    </div>
  );
}
