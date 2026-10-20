"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENT_BY_ID } from "@/data/achievements";
import { useKQ } from "@/lib/progress/store";
import { AchievementBadge } from "./AchievementBadge";
import { Mascot } from "@/components/characters/Mascot";
import { PrimaryButton } from "@/components/ui/Button";
import { play } from "@/lib/audio/sfx";

/** Global overlay that celebrates newly earned badges. Hidden when gamification is off. */
export function RewardCelebration() {
  const earned = useKQ((s) => s.justEarned);
  const clear = useKQ((s) => s.clearJustEarned);
  const gamified = useKQ((s) => s.settings.gamification);
  const ref = useRef<HTMLDialogElement>(null);
  const show = gamified && earned.length > 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (show && !d.open) {
      d.showModal();
      play("win");
    }
    if (!show && d.open) d.close();
  }, [show]);

  useEffect(() => {
    if (!gamified && earned.length) clear();
  }, [gamified, earned, clear]);

  return (
    <dialog ref={ref} onCancel={clear} aria-labelledby="reward-title" className="m-auto w-[min(92vw,30rem)] overflow-visible rounded-[2rem] bg-transparent p-0 backdrop:bg-royal-dark/60">
      {show && <Confetti />}
      <div className="relative rounded-[2rem] bg-white p-6 text-center shadow-2xl">
        <Mascot id="leo" size={110} expression="excited" animate="bounce" className="mx-auto -mt-16" />
        <h2 id="reward-title" className="mt-2 text-3xl font-bold text-royal-dark">
          {earned.length > 1 ? "New badges!" : "New badge!"}
        </h2>
        <div className="my-5 flex flex-wrap justify-center gap-6">
          {earned.map((id) => ACHIEVEMENT_BY_ID[id] && <AchievementBadge key={id} a={ACHIEVEMENT_BY_ID[id]} earned size="lg" />)}
        </div>
        <p className="mb-4 text-ink-soft">You earned this by learning. Great job!</p>
        <PrimaryButton tone="royal" size="lg" onClick={clear} autoFocus>
          Hooray!
        </PrimaryButton>
      </div>
    </dialog>
  );
}

export function Confetti({ count = 60 }: { count?: number }) {
  const colors = ["#ffd23f", "#ff7a59", "#2a48d4", "#1fa463", "#b9a6ff", "#ff8fc1", "#6fc3ff"];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute top-0 block h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animation: `confetti-fall ${2.5 + (i % 5) * 0.4}s linear ${(i % 10) * 0.12}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
