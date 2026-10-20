"use client";

import { Component, useState, type ReactNode } from "react";
import { Pause, Play, RotateCcw, Star, ArrowLeft } from "lucide-react";
import type { GameInfo } from "@/data/games";
import type { AgeLevel } from "@/lib/curriculum/types";
import type { GameResult } from "@/lib/games/types";
import { GAME_COMPONENTS } from "./registry";
import { Mascot } from "@/components/characters/Mascot";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/states";
import { Confetti } from "@/components/rewards/RewardCelebration";
import { useKQ } from "@/lib/progress/store";
import { MASCOTS, pick } from "@/data/mascots";
import { play } from "@/lib/audio/sfx";

type Phase = "intro" | "playing" | "done";

/**
 * Shared frame for every game: instructions, start, pause, restart, completion with educational
 * feedback, rewards and progress saving, plus an error boundary with retry.
 * Games are always free and never ask children to pay or wait.
 */
export function GameShell({ game, level, embedded, onComplete }: { game: GameInfo; level: AgeLevel; embedded?: boolean; onComplete?: (r: GameResult) => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const recordGame = useKQ((s) => s.recordGame);
  const settings = useKQ((s) => s.settings);
  const [timers, setTimers] = useState(settings.timers);
  const Game = GAME_COMPONENTS[game.id];
  const host = MASCOTS[game.host];

  function start() {
    setResult(null);
    setPaused(false);
    setRun((r) => r + 1);
    setPhase("playing");
    play("tap");
  }

  function finish(r: GameResult) {
    setResult(r);
    setPhase("done");
    recordGame(game.id, r.won, r.score, r.mode);
    if (r.won) play("win");
  }

  return (
    <section className="relative" aria-labelledby={`game-${game.id}-title`} data-testid={`game-shell-${game.id}`}>
      {phase === "intro" && (
        <div className="card overflow-hidden">
          <div className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:text-left" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${game.color} 25%, white), white)` }}>
            <Mascot id={game.host} size={130} expression="excited" animate="bounce" />
            <div>
              <h2 id={`game-${game.id}-title`} className="text-3xl font-bold text-royal-dark">
                {game.title}
              </h2>
              <p className="mt-1 text-lg text-ink">{game.blurb}</p>
              <p className="mt-1 text-sm text-ink-soft">Your host: {host.name}</p>
            </div>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xl font-bold text-royal-dark">How to play</h3>
              <ol className="space-y-2">
                {game.howTo.map((h, i) => (
                  <li key={h} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royal font-bold text-white">{i + 1}</span>
                    <span className="pt-1 text-ink">{h}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-soft p-4">
                <h3 className="font-bold text-emerald">What you&apos;ll learn</h3>
                <p className="text-ink">{game.learn}</p>
              </div>
              {["trivia", "jonah-ocean"].includes(game.id) && (
                <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <input type="checkbox" className="h-6 w-6" checked={timers} onChange={(e) => setTimers(e.target.checked)} />
                  <span className="font-semibold">Timer challenge (optional)</span>
                </label>
              )}
              <PrimaryButton tone="sun" size="xl" onClick={start} className="w-full" icon={<Play aria-hidden />} data-testid="game-start">
                Start
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {phase === "playing" && Game && (
        <div className="card relative overflow-hidden p-3 md:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id={`game-${game.id}-title`} className="text-xl font-bold text-royal-dark md:text-2xl">
              {game.title}
            </h2>
            <div className="flex gap-2">
              <SecondaryButton onClick={() => setPaused(true)} icon={<Pause aria-hidden />} aria-label="Pause game">
                <span className="hidden sm:inline">Pause</span>
              </SecondaryButton>
              <SecondaryButton onClick={start} icon={<RotateCcw aria-hidden />} aria-label="Restart game">
                <span className="hidden sm:inline">Restart</span>
              </SecondaryButton>
            </div>
          </div>
          <GameErrorBoundary onRetry={start}>
            <div aria-hidden={paused} className={paused ? "invisible" : ""}>
              <Game key={run} level={level} paused={paused} timers={timers} onFinish={finish} />
            </div>
          </GameErrorBoundary>
          {paused && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/95 p-6 text-center" role="dialog" aria-label="Game paused">
              <Mascot id={game.host} size={110} expression="calm" />
              <p className="font-display text-3xl font-bold text-royal-dark">Paused</p>
              <p className="text-ink-soft">Take a break! Your game is waiting.</p>
              <PrimaryButton tone="emerald" size="lg" onClick={() => setPaused(false)} icon={<Play aria-hidden />} autoFocus>
                Keep playing
              </PrimaryButton>
            </div>
          )}
        </div>
      )}

      {phase === "done" && result && (
        <div className="card relative overflow-hidden p-6 text-center md:p-10" data-testid="game-complete">
          {result.won && settings.gamification && <Confetti count={40} />}
          <Mascot id={game.host} size={140} expression={result.won ? "excited" : "happy"} animate="bounce" className="mx-auto" />
          <h2 className="mt-2 text-3xl font-bold text-royal-dark">{result.won ? pick(host.lines.finished) : "Good try!"}</h2>
          {settings.gamification && result.won && (
            <p className="mt-2 flex items-center justify-center gap-2 font-display text-xl font-bold text-gold-dark">
              <Star fill="currentColor" aria-hidden /> Quest complete!
            </p>
          )}
          {result.message && <p className="mx-auto mt-3 max-w-xl text-lg text-ink">{result.message}</p>}
          <div className="mx-auto mt-4 max-w-xl rounded-2xl bg-emerald-soft p-4 text-left">
            <p className="font-bold text-emerald">Remember</p>
            <p className="text-ink">{game.learn}</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {embedded && onComplete ? (
              <PrimaryButton tone="emerald" size="lg" onClick={() => onComplete(result)} data-testid="game-continue">
                Continue
              </PrimaryButton>
            ) : (
              <PrimaryButton tone="white" href="/games" icon={<ArrowLeft aria-hidden />}>
                All games
              </PrimaryButton>
            )}
            <PrimaryButton tone="royal" onClick={start} icon={<RotateCcw aria-hidden />}>
              Play again
            </PrimaryButton>
          </div>
        </div>
      )}
    </section>
  );
}

class GameErrorBoundary extends Component<{ children: ReactNode; onRetry: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <ErrorState
          title="This game tripped over its shoelaces."
          message="Let's start it again."
          action={
            <PrimaryButton
              tone="royal"
              onClick={() => {
                this.setState({ failed: false });
                this.props.onRetry();
              }}
            >
              Try again
            </PrimaryButton>
          }
        />
      );
    return this.props.children;
  }
}
