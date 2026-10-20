"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, RotateCcw, Sparkles, Type, Volume2 } from "lucide-react";
import type { AgeLevel, Lesson, SceneProp } from "@/lib/curriculum/types";
import { sceneText } from "@/lib/curriculum";
import { SceneArt } from "@/components/bible/SceneArt";
import { ArtImage } from "@/components/bible/ArtImage";
import { IconButton, PrimaryButton } from "@/components/ui/Button";
import { StepDots } from "@/components/ui/ProgressTracker";
import { ContentLabel } from "@/components/ui/ScriptureText";
import { QuizQuestion } from "./QuizQuestion";
import { narrationUrl } from "@/lib/audio/narration";
import { sceneArt } from "@/lib/art";
import { useKQ } from "@/lib/progress/store";
import { play } from "@/lib/audio/sfx";

/**
 * Interactive storybook player: illustrated scenes, tap-to-discover objects, check-in questions,
 * recorded narration when available, auto-turn, resume, text size and full-screen mode.
 */
export function StoryPlayer({ lesson, level, onDone }: { lesson: Lesson; level: AgeLevel; onDone: () => void }) {
  const saved = useKQ((s) => s.progress.scenes[lesson.id] ?? 0);
  const saveScene = useKQ((s) => s.saveScene);
  const settings = useKQ((s) => s.settings);
  const setSettings = useKQ((s) => s.setSettings);
  const [i, setI] = useState(() => Math.min(saved, lesson.scenes.length - 1));
  const [revealed, setRevealed] = useState<string | null>(null);
  const [checkDone, setCheckDone] = useState<Record<string, boolean>>({});
  const [auto, setAuto] = useState(false);
  const [full, setFull] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scene = lesson.scenes[i];
  const last = i === lesson.scenes.length - 1;
  const text = settings.minimalReading && scene.short ? scene.short : sceneText(scene, level);
  const audioKey = `${lesson.id}/${scene.id}${level === "disciples" && scene.short ? "-short" : ""}`;
  const audio = narrationUrl(audioKey) ?? narrationUrl(`${lesson.id}/${scene.id}`);
  const needsCheck = Boolean(scene.question) && !checkDone[scene.id];

  const go = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(lesson.scenes.length - 1, n));
      setI(next);
      setRevealed(null);
      saveScene(lesson.id, next);
      play("flip");
    },
    [lesson.id, lesson.scenes.length, saveScene],
  );

  // Auto-turn: with a recording, turn when it ends; without one, wait long enough to read.
  useEffect(() => {
    if (!auto || needsCheck) return;
    if (audio) return; // handled by onEnded
    const ms = Math.max(5000, text.length * 70);
    const t = setTimeout(() => (last ? setAuto(false) : go(i + 1)), ms);
    return () => clearTimeout(t);
  }, [auto, i, text, audio, last, go, needsCheck]);

  useEffect(() => {
    if (auto && audio && audioRef.current) void audioRef.current.play().catch(() => setAuto(false));
  }, [auto, audio, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea,button")) return;
      if (e.key === "ArrowRight" && !needsCheck && !last) go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go, last, needsCheck]);

  useEffect(() => {
    const onFs = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function toggleFull() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void boxRef.current?.requestFullscreen?.().catch(() => undefined);
  }

  function tapProp(p: SceneProp) {
    if (scene.tap && scene.tap.prop === p) {
      setRevealed(scene.tap.reveal);
      play("star");
    }
  }

  const textSize = settings.textSize === "xl" ? "text-3xl" : settings.textSize === "large" ? "text-2xl" : level === "disciples" ? "text-2xl" : "text-xl";

  return (
    <div ref={boxRef} className={`relative overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-card)] ${full ? "flex h-screen flex-col overflow-y-auto" : ""}`} data-testid="story-player">
      <div className="relative aspect-[16/9] w-full bg-sky-soft md:aspect-[16/8]">
        <ArtImage
          src={scene.image ?? sceneArt(lesson.id, scene.id)}
          alt={scene.alt}
          fallback={<SceneArt theme={scene.theme} props={scene.props} alt={scene.alt} className="h-full w-full" pulse={scene.tap?.prop} onPropClick={tapProp} />}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-4 py-1 font-display text-sm font-bold text-royal-dark shadow">
          Page {i + 1} of {lesson.scenes.length}
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <IconButton label={full ? "Exit full screen" : "Full screen"} onClick={toggleFull}>
            {full ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
          </IconButton>
          <IconButton
            label="Change text size"
            onClick={() => setSettings({ textSize: settings.textSize === "normal" ? "large" : settings.textSize === "large" ? "xl" : "normal" })}
          >
            <Type aria-hidden />
          </IconButton>
        </div>
        {scene.tap && (
          <button
            type="button"
            onClick={() => tapProp(scene.tap!.prop)}
            className="absolute bottom-3 left-1/2 flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-sun px-5 font-display font-bold text-ink shadow-[var(--shadow-toy)]"
          >
            <Sparkles size={20} aria-hidden /> {scene.tap.label}
          </button>
        )}
      </div>

      <div className="space-y-4 p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-royal-dark md:text-3xl">{scene.title}</h2>
          <ContentLabel kind="retelling" />
        </div>
        <p className={`${textSize} leading-relaxed text-ink`} aria-live="polite">
          {text}
        </p>
        {scene.illustrative && level !== "disciples" && (
          <div className="rounded-2xl bg-ink/5 p-3">
            <ContentLabel kind="illustrative" />
            <p className="mt-1 italic text-ink-soft">{scene.illustrative}</p>
          </div>
        )}
        {revealed && (
          <div className="animate-pop rounded-2xl border-2 border-sun bg-sun/20 p-4" role="status">
            <p className="font-bold text-ink">Did you know?</p>
            <p className="text-ink">{revealed}</p>
          </div>
        )}
        {scene.question && !checkDone[scene.id] && (
          <QuizQuestion key={scene.question.id} q={scene.question} big={level === "disciples"} onAnswered={() => setCheckDone((c) => ({ ...c, [scene.id]: true }))} />
        )}

        {/* narration + navigation */}
        <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
          {audio ? (
            <>
              <audio ref={audioRef} src={audio} onEnded={() => auto && !last && !needsCheck && go(i + 1)} />
              <IconButton label="Play narration" onClick={() => void audioRef.current?.play()}>
                <Volume2 aria-hidden />
              </IconButton>
              <IconButton label="Replay narration" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; void audioRef.current.play(); } }}>
                <RotateCcw aria-hidden />
              </IconButton>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            aria-pressed={auto}
            className="flex min-h-12 items-center gap-2 rounded-full bg-royal-soft px-4 font-display font-semibold text-royal-dark"
          >
            {auto ? <Pause size={20} aria-hidden /> : <Play size={20} aria-hidden />} {auto ? "Pause auto-turn" : "Auto-turn pages"}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <PrimaryButton tone="white" onClick={() => go(i - 1)} disabled={i === 0} icon={<ChevronLeft aria-hidden />} aria-label="Previous page">
              <span className="hidden sm:inline">Back</span>
            </PrimaryButton>
            {last ? (
              <PrimaryButton tone="emerald" size="lg" onClick={onDone} disabled={needsCheck} data-testid="story-finish">
                Finish story
              </PrimaryButton>
            ) : (
              <PrimaryButton tone="royal" size="lg" onClick={() => go(i + 1)} disabled={needsCheck} icon={<ChevronRight aria-hidden />} data-testid="story-next">
                Next
              </PrimaryButton>
            )}
          </div>
        </div>
        {!audio && <p className="text-xs text-ink-soft">Read-aloud recordings for this story haven&apos;t been added yet. A grown-up can read it aloud, or use Auto-turn.</p>}
        <StepDots count={lesson.scenes.length} current={i} label="Story page" />
      </div>
    </div>
  );
}
