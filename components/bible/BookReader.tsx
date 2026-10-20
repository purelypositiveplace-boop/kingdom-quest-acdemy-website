"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Minus, Pause, Play, Plus, BookOpen, Volume2 } from "lucide-react";
import { BOOK_BY_ID, BOOKS } from "@/data/bible/books";
import { chapterAudio, type ChapterTiming } from "@/lib/bible/audio";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { PrimaryButton } from "@/components/ui/Button";
import { Mascot } from "@/components/characters/Mascot";
import { play as sfx } from "@/lib/audio/sfx";

type BookJson = { chapters: string[][] };
const cache = new Map<string, BookJson>();

/** Splits a chapter's verses into book pages by a character budget, never splitting a verse. */
export function paginate(verses: { v: number; t: string }[], budget: number): { v: number; t: string }[][] {
  const pages: { v: number; t: string }[][] = [];
  let cur: { v: number; t: string }[] = [];
  let used = 220; // room for the chapter heading on the first page
  for (const verse of verses) {
    if (cur.length && used + verse.t.length > budget) {
      pages.push(cur);
      cur = [];
      used = 0;
    }
    cur.push(verse);
    used += verse.t.length + 8;
  }
  if (cur.length) pages.push(cur);
  return pages;
}

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

/**
 * "Read me the Bible": the chapter laid out as an open book with page turning. When a recording
 * exists, "Read to me" plays a natural voice, highlights each verse and turns the pages itself,
 * then (optionally) carries on to the next chapter.
 */
export function BookReader({ bookId, chapter, chapters }: { bookId: string; chapter: number; chapters: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const book = BOOK_BY_ID[bookId];
  const wide = useWide();
  const [data, setData] = useState<BookJson | null>(cache.get(bookId) ?? null);
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState(1.3);
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [timing, setTiming] = useState<ChapterTiming | null>(null);
  const [speed, setSpeed] = useState(1);
  const [carryOn, setCarryOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touch = useRef<number | null>(null);
  const audio = chapterAudio(bookId, chapter);

  useEffect(() => {
    if (cache.has(bookId)) return;
    let alive = true;
    fetch(`/bible/web/${bookId}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: BookJson) => {
        cache.set(bookId, j);
        if (alive) setData(j);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [bookId]);

  useEffect(() => {
    if (!audio) return;
    fetch(audio.timing)
      .then((r) => r.json())
      .then(setTiming)
      .catch(() => setTiming(null));
  }, [audio?.timing]); // eslint-disable-line react-hooks/exhaustive-deps

  const verses = useMemo(() => (data?.chapters[chapter - 1] ?? []).map((t, i) => ({ v: i + 1, t })).filter((x) => x.t), [data, chapter]);
  const budget = Math.round((wide ? 900 : 650) / (size / 1.3) ** 2);
  const pages = useMemo(() => paginate(verses, budget), [verses, budget]);
  const perSpread = wide ? 2 : 1;
  const spreads = Math.max(1, Math.ceil(pages.length / perSpread));
  const shown = pages.slice(spread * perSpread, spread * perSpread + perSpread);

  useEffect(() => setSpread((s) => Math.min(s, spreads - 1)), [spreads]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = spread + dir;
      if (next < 0 || next >= spreads) return;
      setTurn(dir === 1 ? "next" : "prev");
      setSpread(next);
      sfx("flip");
      setTimeout(() => setTurn(null), 450);
    },
    [spread, spreads],
  );

  // keyboard page turning
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,select,textarea")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // follow the narrator: highlight the verse and turn to its page
  function onTime() {
    const t = audioRef.current?.currentTime ?? 0;
    if (!timing) return;
    let v: number | null = null;
    for (const x of timing.verses) if (x.start <= t + 0.05) v = x.v;
    if (v === current) return;
    setCurrent(v);
    if (v !== null) {
      const pageIdx = pages.findIndex((p) => p.some((x) => x.v === v));
      const target = Math.floor(pageIdx / perSpread);
      if (pageIdx >= 0 && target !== spread) {
        setTurn(target > spread ? "next" : "prev");
        setSpread(target);
        setTimeout(() => setTurn(null), 450);
      }
    }
  }

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.playbackRate = speed;
      void a.play();
    } else a.pause();
  }

  // continue from the previous chapter automatically
  useEffect(() => {
    if (params.get("autoplay") === "1" && audioRef.current && audio) {
      audioRef.current.playbackRate = speed;
      void audioRef.current.play().catch(() => undefined);
    }
  }, [params, audio]); // eslint-disable-line react-hooks/exhaustive-deps

  const idx = BOOKS.findIndex((b) => b.id === bookId);
  const nextHref = chapter < chapters ? `/bible/listen/${bookId}/${chapter + 1}` : idx < BOOKS.length - 1 ? `/bible/listen/${BOOKS[idx + 1].id}/1` : null;
  const prevHref = chapter > 1 ? `/bible/listen/${bookId}/${chapter - 1}` : idx > 0 ? `/bible/listen/${BOOKS[idx - 1].id}/1` : null;
  const title = bookId === "psalms" ? `Psalm ${chapter}` : `${book.name} ${chapter}`;

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6" data-testid="book-reader">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/bible/listen" className="inline-flex min-h-11 items-center gap-1 font-bold text-royal underline">
          <ChevronLeft size={18} aria-hidden /> All books
        </Link>
        <h1 className="mr-auto text-3xl font-bold text-royal-dark">{title}</h1>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Chapter
          <select value={chapter} onChange={(e) => router.push(`/bible/listen/${bookId}/${e.target.value}`)} className="min-h-11 rounded-full border-2 border-royal-soft bg-white px-3">
            {Array.from({ length: chapters }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <button type="button" aria-label="Smaller words" onClick={() => setSize((s) => Math.max(1, s - 0.15))} className="tap-target flex items-center justify-center rounded-full bg-white shadow">
          <Minus aria-hidden />
        </button>
        <button type="button" aria-label="Bigger words" onClick={() => setSize((s) => Math.min(2.2, s + 0.15))} className="tap-target flex items-center justify-center rounded-full bg-white shadow">
          <Plus aria-hidden />
        </button>
        <Link href={`/bible/${bookId}/${chapter}`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-white px-4 text-sm font-bold text-royal-dark shadow">
          <BookOpen size={16} aria-hidden /> Study view
        </Link>
      </div>

      {/* narration controls */}
      {audio ? (
        <div className="card flex flex-wrap items-center gap-3 p-3">
          <audio
            ref={audioRef}
            src={audio.mp3}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={onTime}
            onEnded={() => {
              setPlaying(false);
              setCurrent(null);
              if (carryOn && nextHref) router.push(`${nextHref}?autoplay=1`);
            }}
          />
          <PrimaryButton tone="sun" size="lg" onClick={toggle} icon={playing ? <Pause aria-hidden /> : <Play aria-hidden />} data-testid="read-to-me">
            {playing ? "Pause" : "Read to me"}
          </PrimaryButton>
          <label className="flex items-center gap-2 text-sm font-semibold">
            Speed
            <select
              value={speed}
              onChange={(e) => {
                const s = Number(e.target.value);
                setSpeed(s);
                if (audioRef.current) audioRef.current.playbackRate = s;
              }}
              className="min-h-11 rounded-full border-2 border-royal-soft bg-white px-3"
            >
              <option value={0.8}>Slower</option>
              <option value={1}>Normal</option>
              <option value={1.15}>Faster</option>
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={carryOn} onChange={(e) => setCarryOn(e.target.checked)} className="h-5 w-5" /> Keep reading the next chapter
          </label>
        </div>
      ) : (
        <div className="card flex items-center gap-3 p-3 text-ink-soft" data-testid="audio-coming">
          <Volume2 className="shrink-0 text-royal" aria-hidden />
          <span>A grown-up voice reading this chapter is coming soon. For now, turn the pages and read along, or read it together with a grown-up!</span>
        </div>
      )}

      {/* the open book */}
      {failed ? (
        <ErrorState title="We couldn't open this book." message="Check your internet connection and try again." />
      ) : !data ? (
        <LoadingState label="Opening the book..." />
      ) : (
        <div
          className="relative select-none [perspective:2000px]"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="rounded-[1.75rem] bg-gradient-to-b from-[#8a5a33] to-[#6b4423] p-2 shadow-2xl md:p-3">
            <div
              key={spread}
              className={`grid min-h-[60vh] overflow-hidden rounded-[1.4rem] ${wide ? "grid-cols-2" : "grid-cols-1"} ${turn === "next" ? "animate-[pageNext_0.45s_ease-out]" : turn === "prev" ? "animate-[pagePrev_0.45s_ease-out]" : ""}`}
              style={{ transformOrigin: turn === "prev" ? "right center" : "left center" }}
            >
              {Array.from({ length: perSpread }, (_, k) => {
                const page = shown[k];
                const pageNo = spread * perSpread + k;
                return (
                  <article
                    key={k}
                    aria-label={page ? `Page ${pageNo + 1} of ${pages.length}` : "Blank page"}
                    className={`relative bg-[#fffaf0] px-6 py-8 md:px-10 ${wide && k === 0 ? "shadow-[inset_-18px_0_24px_-18px_rgba(0,0,0,0.35)]" : ""} ${wide && k === 1 ? "shadow-[inset_18px_0_24px_-18px_rgba(0,0,0,0.35)]" : ""}`}
                  >
                    {page && pageNo === 0 && (
                      <header className="mb-4 text-center">
                        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-gold-dark">{book.name}</p>
                        <p className="font-display text-4xl font-bold text-royal-dark">{bookId === "psalms" ? `Psalm ${chapter}` : `Chapter ${chapter}`}</p>
                      </header>
                    )}
                    {page && (
                      <p className="scripture leading-[1.9] text-ink" style={{ fontSize: `${size}rem` }}>
                        {page.map((x, i) => (
                          <span key={x.v} className={`rounded transition-colors ${current === x.v ? "bg-sun/60" : ""}`} data-verse={x.v}>
                            {!(pageNo === 0 && i === 0) && <sup className="mr-0.5 font-sans text-[0.55em] font-bold text-royal">{x.v}</sup>}
                            {pageNo === 0 && i === 0 ? (
                              <>
                                <span className="float-left mr-2 font-display text-[3.2em] font-bold leading-[0.85] text-gold-dark">{x.t[0]}</span>
                                {x.t.slice(1)}
                              </>
                            ) : (
                              x.t
                            )}{" "}
                          </span>
                        ))}
                      </p>
                    )}
                    {!page && (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-soft">
                        <Mascot id="oliver" size={90} expression="happy" animate="none" />
                        <p className="font-display text-lg">End of {title}</p>
                      </div>
                    )}
                    {page && <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-ink-soft">{pageNo + 1}</p>}
                  </article>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-ink-soft">World English Bible (public domain) · Swipe or use the arrow keys to turn pages</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <PrimaryButton tone="white" onClick={() => go(-1)} disabled={spread === 0} icon={<ChevronLeft aria-hidden />} aria-label="Previous page" data-testid="page-prev">
          Back
        </PrimaryButton>
        <span className="font-semibold text-ink-soft" aria-live="polite">
          {wide ? `Pages ${spread * 2 + 1}–${Math.min(pages.length, spread * 2 + 2)}` : `Page ${spread + 1}`} of {pages.length}
        </span>
        {spread < spreads - 1 ? (
          <PrimaryButton tone="royal" onClick={() => go(1)} icon={<ChevronRight aria-hidden />} data-testid="page-next">
            Turn page
          </PrimaryButton>
        ) : nextHref ? (
          <PrimaryButton tone="emerald" href={nextHref} icon={<ChevronRight aria-hidden />} data-testid="next-chapter">
            Next chapter
          </PrimaryButton>
        ) : (
          <span />
        )}
      </div>
      {prevHref && spread === 0 && (
        <p className="text-center text-sm">
          <Link href={prevHref} className="font-bold text-royal underline">
            ← Previous chapter
          </Link>
        </p>
      )}
    </div>
  );
}
