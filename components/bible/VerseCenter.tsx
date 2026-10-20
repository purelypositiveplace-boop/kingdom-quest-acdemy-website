"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Printer, RotateCcw, Shuffle, Layers, PenLine, ListChecks, Clock, Volume2 } from "lucide-react";
import { MEMORY_VERSES, VERSE_THEMES } from "@/data/verses/memory-verses";
import type { MemoryVerse } from "@/lib/curriculum/types";
import { ScriptureText, getVerseText } from "@/components/ui/ScriptureText";
import { useKQ } from "@/lib/progress/store";
import { useLevel } from "@/lib/progress/useLevel";
import { shuffle } from "@/lib/games/random";
import { play } from "@/lib/audio/sfx";
import { dailyVerseIndex, weeklyVerseIndex } from "./DailyVerse";
import { versesDue } from "@/lib/progress/logic";
import { narrationUrl } from "@/lib/audio/narration";
import { refKey } from "@/lib/bible/reference";

type Mode = "flash" | "missing" | "scramble" | "choice";
const BOX_LABEL = ["New", "Seen it", "Getting it", "Learned", "Strong", "Super strong"];

export function VerseCenter() {
  const level = useLevel();
  const progress = useKQ((s) => s.progress);
  const toggleFavorite = useKQ((s) => s.toggleFavorite);
  const [theme, setTheme] = useState<string>("All");
  const [selected, setSelected] = useState<MemoryVerse | null>(null);
  const [mode, setMode] = useState<Mode>("flash");
  const [today, setToday] = useState<{ d: number; w: number } | null>(null);
  useEffect(() => setToday({ d: dailyVerseIndex(), w: weeklyVerseIndex() }), []);

  const list = MEMORY_VERSES.filter((v) => (theme === "All" ? true : theme === "Favourites" ? progress.favorites.includes(`verse:${v.ref}`) : v.themes.includes(theme)));
  const sorted = [...list].sort((a, b) => Number(b.ages.includes(level)) - Number(a.ages.includes(level)));
  const due = versesDue(progress, MEMORY_VERSES.map((v) => v.ref));

  return (
    <div className="space-y-8">
      {today && (
        <section className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Verse of the day", v: MEMORY_VERSES[today.d] },
            { label: "Verse of the week", v: MEMORY_VERSES[today.w] },
          ].map(({ label, v }) => (
            <div key={label} className="card space-y-3 p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-gold-dark">{label}</p>
              <ScriptureText refText={v.ref} />
              <button type="button" onClick={() => setSelected(v)} className="btn-toy bg-royal text-white">
                Practise this verse
              </button>
            </div>
          ))}
        </section>
      )}

      {due.length > 0 && (
        <section className="card flex flex-wrap items-center gap-3 p-4" aria-label="Verses ready to review">
          <Clock className="text-royal" aria-hidden />
          <span className="font-bold text-ink">Ready to review:</span>
          {due.map((r) => (
            <button key={r} type="button" onClick={() => setSelected(MEMORY_VERSES.find((v) => v.ref === r)!)} className="min-h-11 rounded-full bg-sun px-4 font-display font-semibold">
              {r}
            </button>
          ))}
        </section>
      )}

      {selected && (
        <section className="card space-y-4 p-5 md:p-7" aria-labelledby="practice-title" data-testid="verse-practice">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="practice-title" className="text-2xl font-bold text-royal-dark">
              Practise {selected.ref}
            </h2>
            <span className="rounded-full bg-emerald-soft px-3 py-1 text-sm font-bold text-emerald">{BOX_LABEL[progress.verses[selected.ref]?.box ?? 0]}</span>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Practice type">
            {(
              [
                ["flash", "Flashcard", Layers],
                ["missing", "Missing word", PenLine],
                ["scramble", "Word scramble", Shuffle],
                ["choice", "Which verse?", ListChecks],
              ] as const
            ).map(([m, label, Icon]) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`flex min-h-11 items-center gap-2 rounded-full px-4 font-display font-semibold ${mode === m ? "bg-royal text-white" : "bg-royal-soft text-royal-dark"}`}>
                <Icon size={18} aria-hidden /> {label}
              </button>
            ))}
          </div>
          <Practice key={`${selected.ref}-${mode}`} verse={selected} mode={mode} />
        </section>
      )}

      <section aria-labelledby="collections" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="collections" className="text-2xl font-bold text-royal-dark">
            Verse collections
          </h2>
          <Link href="/printables/verse-cards" className="flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-bold text-royal-dark shadow">
            <Printer size={18} aria-hidden /> Printable verse cards
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Favourites", ...VERSE_THEMES].map((t) => (
            <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)} className={`min-h-11 rounded-full px-4 font-display font-semibold ${theme === t ? "bg-gold text-ink" : "bg-white text-royal-dark shadow-sm"}`}>
              {t}
            </button>
          ))}
        </div>
        {sorted.length === 0 && <p className="text-ink-soft">No verses here yet. Tap the heart on a verse to add it to your favourites.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((v) => {
            const fav = progress.favorites.includes(`verse:${v.ref}`);
            const box = progress.verses[v.ref]?.box ?? 0;
            return (
              <article key={v.ref} className="card flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-royal-dark">{v.ref}</h3>
                  <button type="button" onClick={() => toggleFavorite(`verse:${v.ref}`)} aria-pressed={fav} aria-label={fav ? `Remove ${v.ref} from favourites` : `Add ${v.ref} to favourites`} className="tap-target flex items-center justify-center rounded-full hover:bg-coral-soft">
                    <Heart className={fav ? "fill-coral text-coral" : "text-ink-soft"} aria-hidden />
                  </button>
                </div>
                <p className="scripture text-lg text-ink">{getVerseText(v.ref)}</p>
                <p className="text-sm text-ink-soft">
                  <span className="font-bold">Meaning:</span> {v.meaning}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-ink-soft">
                    {v.themes.join(" · ")} · {BOX_LABEL[box]}
                  </span>
                  <button type="button" onClick={() => setSelected(v)} className="min-h-11 rounded-full bg-royal px-4 font-display font-semibold text-white" data-testid={`practise-${refKey(v.ref)}`}>
                    Practise
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Practice({ verse, mode }: { verse: MemoryVerse; mode: Mode }) {
  const review = useKQ((s) => s.reviewVerse);
  const text = getVerseText(verse.ref) ?? "";
  const words = text.split(/\s+/);
  const audio = narrationUrl(`verse/${refKey(verse.ref)}`);
  const [result, setResult] = useState<null | boolean>(null);

  function grade(ok: boolean) {
    setResult(ok);
    review(verse.ref, ok);
    play(ok ? "correct" : "gentle");
  }

  const feedback = result !== null && (
    <p className={`rounded-2xl p-3 font-semibold ${result ? "bg-emerald-soft text-emerald" : "bg-sky-soft text-royal-dark"}`} role="status">
      {result ? "Wonderful! That verse is growing stronger in your heart." : "Good practice! Saying it again helps you remember. Try once more."}
    </p>
  );

  if (mode === "flash") return <Flashcard verse={verse} text={text} audio={audio} onGrade={grade} feedback={feedback} />;
  if (mode === "missing") return <MissingWord words={words} onGrade={grade} feedback={feedback} />;
  if (mode === "scramble") return <Scramble words={words} onGrade={grade} feedback={feedback} />;
  return <WhichVerse verse={verse} onGrade={grade} feedback={feedback} />;
}

function Flashcard({ verse, text, audio, onGrade, feedback }: { verse: MemoryVerse; text: string; audio: string | null; onGrade: (ok: boolean) => void; feedback: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="space-y-4">
      <button type="button" onClick={() => setFlipped(!flipped)} className="flex min-h-48 w-full flex-col items-center justify-center rounded-3xl border-4 border-gold bg-gradient-to-br from-white to-sun/20 p-6 text-center" aria-live="polite">
        {flipped ? <span className="scripture text-2xl text-ink">{text}</span> : <span className="font-display text-4xl font-bold text-royal-dark">{verse.ref}</span>}
        <span className="mt-3 text-sm text-ink-soft">{flipped ? "Tap to hide" : "Say the verse, then tap to check"}</span>
      </button>
      <div className="flex flex-wrap gap-3">
        {audio && (
          <button type="button" onClick={() => void new Audio(audio).play()} className="flex min-h-12 items-center gap-2 rounded-full bg-royal-soft px-4 font-bold text-royal-dark">
            <Volume2 aria-hidden /> Listen
          </button>
        )}
        <button type="button" onClick={() => onGrade(true)} disabled={!flipped} className="btn-toy bg-emerald text-white">
          I remembered it!
        </button>
        <button type="button" onClick={() => onGrade(false)} disabled={!flipped} className="btn-toy bg-white text-royal-dark">
          <RotateCcw size={18} aria-hidden /> Still learning
        </button>
      </div>
      {!audio && <p className="text-xs text-ink-soft">Tip: say the verse out loud together with a grown-up. Recorded verse audio will appear here once it&apos;s added.</p>}
      {feedback}
    </div>
  );
}

function MissingWord({ words, onGrade, feedback }: { words: string[]; onGrade: (ok: boolean) => void; feedback: React.ReactNode }) {
  const blank = useMemo(() => {
    const candidates = words.map((w, i) => ({ w: w.replace(/[^\p{L}’']/gu, ""), i })).filter((x) => x.w.length > 3);
    return candidates[Math.floor(Math.random() * candidates.length)] ?? { w: words[0], i: 0 };
  }, [words]);
  const options = useMemo(() => {
    const others = [...new Set(words.map((w) => w.replace(/[^\p{L}’']/gu, "")).filter((w) => w.length > 3 && w !== blank.w))];
    const extras = ["light", "kindness", "mountain", "promise", "river", "heart"].filter((x) => x !== blank.w);
    return shuffle([blank.w, ...shuffle([...others, ...extras]).slice(0, 3)]);
  }, [words, blank]);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="scripture rounded-3xl bg-white p-5 text-2xl leading-relaxed text-ink">
        {words.map((w, i) => (i === blank.i ? <span key={i} className="mx-1 inline-block min-w-24 rounded-lg border-b-4 border-royal bg-royal-soft px-2 text-center">{picked ?? "?"}</span> : <span key={i}>{w} </span>))}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              setPicked(o);
              onGrade(o === blank.w);
            }}
            className="min-h-12 rounded-2xl border-4 border-royal-soft bg-white px-4 font-display text-lg font-semibold hover:border-royal"
          >
            {o}
          </button>
        ))}
      </div>
      {feedback}
    </div>
  );
}

function Scramble({ words, onGrade, feedback }: { words: string[]; onGrade: (ok: boolean) => void; feedback: React.ReactNode }) {
  const chunk = words.length > 14 ? words.slice(0, 12) : words;
  const pool = useMemo(() => shuffle(chunk.map((w, k) => ({ w, k }))), [chunk]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  return (
    <div className="space-y-4">
      {words.length > 14 && <p className="text-sm text-ink-soft">This is a long verse, so let&apos;s build the first part.</p>}
      <p className="scripture min-h-16 rounded-3xl bg-white p-5 text-2xl text-ink">{placed.map((k) => chunk[k]).join(" ")}</p>
      <div className="flex flex-wrap gap-2">
        {pool
          .filter((p) => !placed.includes(p.k))
          .map((p) => (
            <button
              key={p.k}
              type="button"
              onClick={() => {
                if (chunk[p.k] === chunk[placed.length]) {
                  const np = [...placed, p.k];
                  setPlaced(np);
                  play("tap");
                  if (np.length === chunk.length) onGrade(misses <= 2);
                } else {
                  setMisses((m) => m + 1);
                  play("gentle");
                }
              }}
              className="min-h-12 rounded-2xl border-4 border-royal-soft bg-white px-4 font-display text-lg font-semibold hover:border-royal"
            >
              {p.w}
            </button>
          ))}
      </div>
      {feedback}
    </div>
  );
}

function WhichVerse({ verse, onGrade, feedback }: { verse: MemoryVerse; onGrade: (ok: boolean) => void; feedback: React.ReactNode }) {
  const options = useMemo(() => shuffle([verse, ...shuffle(MEMORY_VERSES.filter((v) => v.ref !== verse.ref)).slice(0, 2)]), [verse]);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">Which reference matches this meaning?</p>
      <p className="rounded-3xl bg-sun/20 p-5 text-2xl font-semibold text-ink">&ldquo;{verse.meaning}&rdquo;</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.ref}
            type="button"
            onClick={() => {
              setPicked(o.ref);
              onGrade(o.ref === verse.ref);
            }}
            className={`min-h-14 rounded-2xl border-4 px-4 font-display text-lg font-bold ${picked === o.ref ? (o.ref === verse.ref ? "border-emerald bg-emerald-soft" : "border-coral bg-coral-soft") : "border-royal-soft bg-white hover:border-royal"}`}
          >
            {o.ref}
          </button>
        ))}
      </div>
      {feedback}
    </div>
  );
}
