"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Home, Play, Star, Users, ChevronDown } from "lucide-react";
import type { Lesson } from "@/lib/curriculum/types";
import { getLesson, lessonArtProps, nextLesson, quizForLevel } from "@/lib/curriculum";
import { GAME_BY_ID } from "@/data/games";
import { WORLD_BY_ID } from "@/data/worlds";
import { useKQ } from "@/lib/progress/store";
import { useLevel } from "@/lib/progress/useLevel";
import { LEVELS } from "@/lib/curriculum/levels";
import { StoryPlayer } from "./StoryPlayer";
import { QuizRunner, QuizResult } from "./QuizRunner";
import { GameShell } from "@/components/games/GameShell";
import { SceneArt } from "@/components/bible/SceneArt";
import { ArtImage } from "@/components/bible/ArtImage";
import { lessonCover } from "@/lib/art";
import { ScriptureText, ContentLabel } from "@/components/ui/ScriptureText";
import { PrimaryButton } from "@/components/ui/Button";
import { CharacterBubble } from "@/components/characters/CharacterBubble";
import { Mascot } from "@/components/characters/Mascot";
import { StoryCard } from "@/components/ui/Cards";
import { Confetti } from "@/components/rewards/RewardCelebration";
import { refHref } from "@/lib/bible/reference";
import { play } from "@/lib/audio/sfx";

type Step = "intro" | "story" | "quiz" | "activity" | "complete";
const STEPS: { id: Step; label: string }[] = [
  { id: "intro", label: "Start" },
  { id: "story", label: "Story" },
  { id: "quiz", label: "Quiz" },
  { id: "activity", label: "Activity" },
  { id: "complete", label: "Celebrate" },
];

/** The full lesson journey for one Bible story, adapted to the child's level. */
export function LessonExperience({ lesson }: { lesson: Lesson }) {
  const level = useLevel();
  const info = LEVELS[level];
  const [step, setStep] = useState<Step>("intro");
  const [score, setScore] = useState({ score: 0, total: 0 });
  const savedScene = useKQ((s) => s.progress.scenes[lesson.id] ?? 0);
  const done = useKQ((s) => s.progress.lessons);
  const completeLesson = useKQ((s) => s.completeLesson);
  const gamified = useKQ((s) => s.settings.gamification);
  const questions = useMemo(() => quizForLevel(lesson, level), [lesson, level]);
  const topRef = useRef<HTMLDivElement>(null);
  const world = WORLD_BY_ID[lesson.world];

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const next = useMemo(() => nextLesson(lesson.id, new Set([...Object.keys(done), lesson.id]), level), [lesson.id, done, level]);

  function finishLesson() {
    completeLesson(lesson.id, lesson.version, score.score, score.total, lesson.reward.stars);
    play("star");
    setStep("complete");
  }

  return (
    <div ref={topRef} className="mx-auto max-w-5xl scroll-mt-24 space-y-6 px-4 py-6">
      <nav aria-label="Lesson steps" className="no-print">
        <ol className="flex flex-wrap items-center gap-2">
          {STEPS.map((s, i) => {
            const idx = STEPS.findIndex((x) => x.id === step);
            return (
              <li key={s.id} className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${s.id === step ? "bg-royal text-white" : i < idx ? "bg-emerald-soft text-emerald" : "bg-ink/5 text-ink-soft"}`} aria-current={s.id === step ? "step" : undefined}>
                <span>{i + 1}</span> {s.label}
              </li>
            );
          })}
        </ol>
      </nav>

      {step === "intro" && (
        <section className="space-y-6">
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/7]">
              <ArtImage src={lesson.art.image ?? lessonCover(lesson.id)} alt={lesson.art.alt} fallback={<SceneArt theme={lesson.art.theme} props={lessonArtProps(lesson)} alt={lesson.art.alt} className="h-full w-full" />} />
            </div>
            <div className="space-y-4 p-6 md:p-8">
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                {lesson.refs.map((r) => (
                  <Link key={r} href={refHref(r)} className="flex items-center gap-1 rounded-full bg-royal-soft px-3 py-1 text-royal-dark hover:underline">
                    <BookOpen size={14} aria-hidden /> {r}
                  </Link>
                ))}
                <span className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1 text-ink-soft">
                  <Clock size={14} aria-hidden /> about {lesson.minutes[level]} minutes
                </span>
                {world && (
                  <Link href={`/world/${world.id}`} className="rounded-full px-3 py-1 text-white" style={{ background: world.color }}>
                    {world.name}
                  </Link>
                )}
              </div>
              <h1 className="text-4xl font-bold text-royal-dark md:text-5xl">{lesson.title}</h1>
              <p className="text-xl text-ink">{lesson.summary}</p>
              <CharacterBubble id={info.guide} size={90} expression="excited">
                {level === "disciples" ? "Let's hear a Bible story together!" : `Ready, ${info.name}? Let's discover what happened!`}
              </CharacterBubble>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton tone="sun" size="xl" icon={<Play aria-hidden />} onClick={() => setStep("story")} data-testid="lesson-start">
                  {savedScene > 0 ? `Continue from page ${savedScene + 1}` : "Start the story"}
                </PrimaryButton>
              </div>
            </div>
          </div>

          {level !== "disciples" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-royal-dark">You will learn to...</h2>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-ink">
                  {lesson.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-royal-dark">Words to know</h2>
                <dl className="mt-3 space-y-2">
                  {lesson.vocabulary.map((v) => (
                    <div key={v.word}>
                      <dt className="font-display text-lg font-bold text-ink">{v.word}</dt>
                      <dd className="text-ink-soft">{v.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
          <LessonDetails lesson={lesson} />
        </section>
      )}

      {step === "story" && <StoryPlayer lesson={lesson} level={level} onDone={() => setStep("quiz")} />}

      {step === "quiz" && (
        <section className="space-y-4" aria-labelledby="quiz-title">
          <h2 id="quiz-title" className="text-3xl font-bold text-royal-dark">
            Story quiz
          </h2>
          <QuizRunner
            questions={questions}
            guide={info.guide}
            big={level === "disciples"}
            onFinish={(s, t) => {
              setScore({ score: s, total: t });
              setStep("activity");
            }}
          />
        </section>
      )}

      {step === "activity" && (
        <section className="space-y-4" aria-labelledby="activity-title">
          <div className="card flex flex-col gap-3 p-5 md:flex-row md:items-center">
            <Mascot id="finn" size={80} expression="excited" />
            <div>
              <QuizResult score={score.score} total={score.total} />
              <h2 id="activity-title" className="mt-1 text-2xl font-bold text-royal-dark">
                Activity: {lesson.activity.text}
              </h2>
            </div>
          </div>
          {lesson.activity.kind === "game" && lesson.activity.gameId && GAME_BY_ID[lesson.activity.gameId] ? (
            <GameShell game={GAME_BY_ID[lesson.activity.gameId]} level={level} embedded onComplete={finishLesson} />
          ) : (
            <div className="card space-y-4 p-6">
              {lesson.activity.kind === "printable" && lesson.activity.printableId && (
                <PrimaryButton tone="royal" href={`/printables/${lesson.activity.printableId}`}>
                  Open the printable
                </PrimaryButton>
              )}
              {lesson.activity.kind === "do" && <p className="text-lg text-ink">Do this with a grown-up, then tap the button when you&apos;re done.</p>}
              <div className="flex flex-wrap gap-3">
                <PrimaryButton tone="emerald" size="lg" onClick={finishLesson} data-testid="activity-done">
                  I did it!
                </PrimaryButton>
                <PrimaryButton tone="white" onClick={finishLesson}>
                  Save it for later
                </PrimaryButton>
              </div>
            </div>
          )}
          <button type="button" onClick={finishLesson} className="text-sm font-semibold text-ink-soft underline">
            Skip the activity and finish the lesson
          </button>
        </section>
      )}

      {step === "complete" && (
        <section className="space-y-6" data-testid="lesson-complete">
          <div className="card relative overflow-hidden p-6 text-center md:p-10">
            {gamified && <Confetti count={50} />}
            <Mascot id="leo" size={150} expression="excited" animate="bounce" className="mx-auto" />
            <h2 className="mt-2 text-4xl font-bold text-royal-dark">Lesson complete!</h2>
            <p className="mt-2 text-xl text-ink">You finished &quot;{lesson.title}&quot;.</p>
            {gamified && (
              <p className="mt-3 flex items-center justify-center gap-1 font-display text-2xl font-bold text-gold-dark">
                {Array.from({ length: lesson.reward.stars }, (_, i) => (
                  <Star key={i} size={32} fill="currentColor" className="animate-pop" style={{ animationDelay: `${i * 0.2}s` }} aria-hidden />
                ))}
                <span className="ml-2">+{lesson.reward.stars} Bible Stars</span>
              </p>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-2xl font-bold text-royal-dark">Three big ideas</h3>
              <ol className="mt-3 space-y-2">
                {lesson.takeaways.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sun font-bold">{i + 1}</span>
                    <span className="pt-1 text-ink">{t}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-2xl bg-emerald-soft p-3 text-ink">
                <span className="font-bold">Try this: </span>
                {lesson.application}
              </p>
            </div>
            <div className="space-y-4">
              <ScriptureText refText={lesson.memoryVerse} />
              <div className="card p-5">
                <ContentLabel kind="reflection" />
                <p className="mt-2 text-lg text-ink">{lesson.reflection}</p>
              </div>
              <div className="card p-5">
                <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">A prayer you can pray (if you want to)</p>
                <p className="mt-1 text-lg italic text-ink">{lesson.prayer}</p>
              </div>
            </div>
          </div>
          {next && next.id !== lesson.id && (
            <div>
              <h3 className="mb-3 text-2xl font-bold text-royal-dark">Next adventure</h3>
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div data-testid="next-lesson">
                  <StoryCard lesson={next} minutes={next.minutes[level]} />
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <PrimaryButton tone="sun" size="lg" href={`/lessons/${next.id}`}>
                    Start {getLesson(next.id)?.title}
                  </PrimaryButton>
                  <PrimaryButton tone="white" href="/learn" icon={<Home aria-hidden />}>
                    Back to My Quest
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/** Full written lesson for older kids and grown-ups, with each kind of text clearly labelled. */
function LessonDetails({ lesson }: { lesson: Lesson }) {
  return (
    <details className="card group p-6">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-2xl font-bold text-royal-dark">
        <span className="flex items-center gap-2">
          <Users aria-hidden /> Read the full lesson (for older kids and grown-ups)
        </span>
        <ChevronDown className="transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4 space-y-5">
        <div>
          <ContentLabel kind="retelling" />
          {lesson.narrative.map((p) => (
            <p key={p.slice(0, 20)} className="mt-2 text-lg leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
        <div>
          <ContentLabel kind="interpretation" />
          <p className="mt-2 text-lg text-ink">{lesson.explanation}</p>
        </div>
        <ScriptureText refText={lesson.memoryVerse} />
        <div>
          <h3 className="text-xl font-bold text-royal-dark">Family conversation starters</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-ink">
            {lesson.parentPrompts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        {lesson.sensitiveNote && (
          <div className="rounded-2xl bg-coral-soft p-4">
            <p className="font-bold text-ink">Note for grown-ups</p>
            <p className="text-ink">{lesson.sensitiveNote}</p>
          </div>
        )}
        <p className="text-sm text-ink-soft">
          Main people: {lesson.characters.join(", ")} · Topics: {lesson.topics.join(", ")} · Review status: {lesson.review === "approved" ? "approved" : "awaiting theological review"}
        </p>
      </div>
    </details>
  );
}
