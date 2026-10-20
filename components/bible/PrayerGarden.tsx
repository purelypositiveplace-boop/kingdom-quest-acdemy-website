"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX, Volume2, HeartHandshake } from "lucide-react";
import { PRAYER_TOPICS, PRAYER_PROMISE_NOTE, type PrayerTopic } from "@/data/prayers";
import { CharacterBubble } from "@/components/characters/CharacterBubble";
import { ScriptureText } from "@/components/ui/ScriptureText";
import { useKQ } from "@/lib/progress/store";
import { narrationUrl } from "@/lib/audio/narration";
import { art } from "@/lib/art";
import { NOTE_FREQ, tone } from "@/lib/audio/sfx";

const CARE_NOTE = "If you feel worried, afraid, unsafe or upset, please tell a trusted grown-up, like a parent, teacher or another safe adult. They want to help you.";

/**
 * Prayer Garden. Children choose guided prayers; nothing is typed or collected, and there is no
 * chat or AI counsellor. Music is off by default and only plays if a grown-up allows it.
 */
export function PrayerGarden() {
  const [topic, setTopic] = useState<PrayerTopic>(PRAYER_TOPICS[0]);
  const visit = useKQ((s) => s.visitPrayer);
  const musicAllowed = useKQ((s) => s.settings.music);
  const [musicOn, setMusicOn] = useState(false);
  const loop = useRef<ReturnType<typeof setInterval> | null>(null);
  const audio = topic.prayer ? narrationUrl(`prayer/${topic.id}`) : null;

  useEffect(() => {
    visit(topic.id);
  }, [topic.id, visit]);

  useEffect(() => {
    if (!musicOn) return;
    const notes = ["C4", "E4", "G4", "E4", "F4", "A4", "G4", "E4"];
    let i = 0;
    const playNext = () => {
      tone(NOTE_FREQ[notes[i % notes.length]], 0, 1.6, "sine", 0.05);
      i++;
    };
    playNext();
    loop.current = setInterval(playNext, 1400);
    return () => {
      if (loop.current) clearInterval(loop.current);
    };
  }, [musicOn]);

  return (
    <div className="relative overflow-hidden">
      {/* garden scenery */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#fff3d6] via-[#e9fbe7] to-[#c9f0c7]">
        <div className="absolute right-10 top-8 h-32 w-32 rounded-full bg-sun/60 blur-xl" />
        {[10, 30, 55, 75, 90].map((x, i) => (
          <svg key={x} className="animate-flutter absolute" style={{ left: `${x}%`, top: `${15 + (i % 3) * 18}%`, animationDelay: `${-i * 2}s` }} width="30" height="24" viewBox="0 0 34 28">
            <ellipse cx="9" cy="10" rx="8" ry="9" fill={["#ff8fc1", "#b9a6ff", "#ffd23f", "#6fc3ff", "#ff7a59"][i]} />
            <ellipse cx="25" cy="10" rx="8" ry="9" fill={["#ff8fc1", "#b9a6ff", "#ffd23f", "#6fc3ff", "#ff7a59"][i]} />
            <rect x="16" y="6" width="2.5" height="16" rx="1" fill="#1f2547" />
          </svg>
        ))}
        <svg className="absolute bottom-0 h-40 w-full" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path d="M0 90 q200 -40 400 0 t400 0 t400 0 V160 H0 Z" fill="#8fdc8f" />
          <path d="M0 120 q300 -30 600 10 t600 -10 V160 H0 Z" fill="#6fc3ff" opacity="0.6" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-royal-dark md:text-5xl">Prayer Garden</h1>
            <p className="text-lg text-ink-soft">A quiet place to learn how to talk with God.</p>
          </div>
          {musicAllowed ? (
            <button type="button" onClick={() => setMusicOn(!musicOn)} aria-pressed={musicOn} className="flex min-h-12 items-center gap-2 self-start rounded-full bg-white px-4 font-bold text-royal-dark shadow">
              {musicOn ? <VolumeX aria-hidden /> : <Music aria-hidden />} {musicOn ? "Stop calm music" : "Play calm music"}
            </button>
          ) : (
            <p className="text-sm text-ink-soft">Calm music is off. A grown-up can turn it on in the parent settings.</p>
          )}
        </header>

        {art("/art/pages/prayer-garden.webp") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={art("/art/pages/prayer-garden.webp")} alt="A peaceful garden with flowers, butterflies and a stream" className="aspect-[3/1] w-full rounded-[2rem] object-cover shadow-[var(--shadow-card)]" />
        )}
        <CharacterBubble id="grace" size={100} expression="calm">
          Hello, dear one. Pick a flower to learn about a kind of prayer.
        </CharacterBubble>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <nav aria-label="Prayer topics">
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {PRAYER_TOPICS.map((t) => (
                <li key={t.id}>
                  <button type="button" onClick={() => setTopic(t)} aria-current={topic.id === t.id} className={`flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left font-display font-semibold transition ${topic.id === t.id ? "bg-white shadow-md ring-4 ring-sun" : "bg-white/70 hover:bg-white"}`}>
                    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
                      {[0, 72, 144, 216, 288].map((a) => (
                        <circle key={a} cx={17 + Math.round(Math.cos((a * Math.PI) / 180) * 800) / 100} cy={17 + Math.round(Math.sin((a * Math.PI) / 180) * 800) / 100} r="7" fill={t.flower} />
                      ))}
                      <circle cx="17" cy="17" r="5" fill="#fff3a0" />
                    </svg>
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <article className="card space-y-4 p-6 md:p-8" aria-live="polite" data-testid="prayer-topic">
            <h2 className="text-3xl font-bold text-royal-dark">{topic.title}</h2>
            <p className="text-lg text-ink">{topic.intro}</p>
            {topic.steps && (
              <ol className="space-y-2">
                {topic.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 rounded-2xl bg-sky-soft p-3 text-ink">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royal font-bold text-white">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
            {topic.id === "lords-prayer" && topic.ref ? (
              <ScriptureText refText={topic.ref} size="lg" />
            ) : (
              <div className="rounded-3xl bg-gradient-to-br from-white to-lavender-soft p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">A prayer you can pray</p>
                <p className="mt-2 text-2xl italic leading-relaxed text-ink">{topic.prayer}</p>
                {audio ? (
                  <button type="button" onClick={() => void new Audio(audio).play()} className="mt-3 flex min-h-12 items-center gap-2 rounded-full bg-royal-soft px-4 font-bold text-royal-dark">
                    <Volume2 aria-hidden /> Listen
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-ink-soft">Read it aloud yourself, or with a grown-up. You can also use your own words!</p>
                )}
              </div>
            )}
            {topic.ref && topic.id !== "lords-prayer" && <ScriptureText refText={topic.ref} size="sm" />}
            {topic.care && (
              <p className="flex gap-3 rounded-2xl bg-coral-soft p-4 font-semibold text-ink">
                <HeartHandshake className="shrink-0 text-coral" aria-hidden /> {CARE_NOTE}
              </p>
            )}
            <p className="text-sm text-ink-soft">{PRAYER_PROMISE_NOTE}</p>
          </article>
        </div>
      </div>
    </div>
  );
}
