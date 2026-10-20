"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookOpenText, ChevronLeft, ChevronRight, Heart, Minus, Plus, Search, Volume2 } from "lucide-react";
import { BOOK_BY_ID, BOOKS } from "@/data/bible/books";
import { LESSONS } from "@/lib/curriculum";
import { parseRef } from "@/lib/bible/reference";
import { useKQ } from "@/lib/progress/store";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { ContentLabel } from "@/components/ui/ScriptureText";
import { PrimaryButton } from "@/components/ui/Button";

type BookJson = { id: string; name: string; translation: string; chapters: string[][] };
const cache = new Map<string, BookJson>();

/** Lessons whose passages include this chapter, for kid-friendly study notes. */
function lessonsFor(bookId: string, chapter: number) {
  return LESSONS.filter((l) =>
    l.refs.some((r) => {
      const p = parseRef(r);
      return p && p.book.id === bookId && chapter >= p.chapter && chapter <= (p.endChapter ?? p.chapter);
    }),
  );
}

export function ChapterReader({ bookId, chapter, chapters }: { bookId: string; chapter: number; chapters: number }) {
  const book = BOOK_BY_ID[bookId];
  const [data, setData] = useState<BookJson | null>(cache.get(bookId) ?? null);
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState(1.25);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const progress = useKQ((s) => s.progress);
  const toggleBookmark = useKQ((s) => s.toggleBookmark);
  const toggleFavorite = useKQ((s) => s.toggleFavorite);
  const bmKey = `chapter:${bookId}:${chapter}`;

  useEffect(() => {
    if (cache.has(bookId)) return;
    let alive = true;
    fetch(`/bible/web/${bookId}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
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
    if (!data || !location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    el?.scrollIntoView({ block: "center" });
    setPicked(Number(location.hash.replace("#v", "")) || null);
  }, [data, chapter]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!data || q.length < 3) return [];
    const out: { c: number; v: number; t: string }[] = [];
    data.chapters.forEach((ch, ci) => ch.forEach((t, vi) => t.toLowerCase().includes(q) && out.push({ c: ci + 1, v: vi + 1, t })));
    return out.slice(0, 50);
  }, [data, query]);

  const study = lessonsFor(bookId, chapter);
  const idx = BOOKS.findIndex((b) => b.id === bookId);
  const prev = chapter > 1 ? `/bible/${bookId}/${chapter - 1}` : idx > 0 ? `/bible/${BOOKS[idx - 1].id}/1` : null;
  const next = chapter < chapters ? `/bible/${bookId}/${chapter + 1}` : idx < BOOKS.length - 1 ? `/bible/${BOOKS[idx + 1].id}/1` : null;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
      <article className="card p-5 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/bible" className="text-sm font-bold text-royal underline">
              All books
            </Link>
            <h1 className="text-4xl font-bold text-royal-dark">
              {book.name} {chapter}
            </h1>
            {book.say && <p className="text-ink-soft">Say it: <span className="font-bold">{book.say}</span></p>}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Smaller text" onClick={() => setSize((s) => Math.max(1, s - 0.125))} className="tap-target flex items-center justify-center rounded-full bg-royal-soft">
              <Minus aria-hidden />
            </button>
            <button type="button" aria-label="Bigger text" onClick={() => setSize((s) => Math.min(2.25, s + 0.125))} className="tap-target flex items-center justify-center rounded-full bg-royal-soft">
              <Plus aria-hidden />
            </button>
            <Link href={`/bible/listen/${bookId}/${chapter}`} className="flex min-h-12 items-center gap-1 rounded-full bg-sun px-4 font-bold text-ink">
              <BookOpenText size={18} aria-hidden /> Read like a book
            </Link>
            <button type="button" aria-pressed={progress.bookmarks.includes(bmKey)} onClick={() => toggleBookmark(bmKey)} className={`flex min-h-12 items-center gap-1 rounded-full px-4 font-bold ${progress.bookmarks.includes(bmKey) ? "bg-sun text-ink" : "bg-royal-soft text-royal-dark"}`}>
              <Bookmark size={18} aria-hidden /> {progress.bookmarks.includes(bmKey) ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>
        <nav aria-label="Chapters" className="mb-4 flex flex-wrap gap-1">
          {Array.from({ length: chapters }, (_, i) => (
            <Link key={i} href={`/bible/${bookId}/${i + 1}`} aria-current={i + 1 === chapter ? "page" : undefined} className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-bold ${i + 1 === chapter ? "bg-royal text-white" : "bg-ink/5 text-ink hover:bg-royal-soft"}`}>
              {i + 1}
            </Link>
          ))}
        </nav>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-dark">
          Bible text · World English Bible (public domain)
        </div>
        {failed ? (
          <ErrorState title="We couldn't open this chapter." message="Check your internet connection and try again." action={<PrimaryButton tone="royal" onClick={() => location.reload()}>Try again</PrimaryButton>} />
        ) : !data ? (
          <LoadingState label="Opening the Bible..." />
        ) : (
          <div className="scripture leading-[1.9] text-ink" style={{ fontSize: `${size}rem` }}>
            {data.chapters[chapter - 1].map((t, i) => {
              const v = i + 1;
              const favKey = `bible:${bookId}:${chapter}:${v}`;
              const fav = progress.favorites.includes(favKey);
              if (!t)
                return (
                  <span key={v} id={`v${v}`} className="scroll-mt-28 font-sans text-sm italic text-ink-soft">
                    <span className="mr-1 align-super text-xs font-bold not-italic text-royal">{v}</span>
                    (Verse {v} isn&apos;t in the World English Bible because the oldest handwritten copies of {book.name} don&apos;t include it. Some other Bibles print it.){" "}
                  </span>
                );
              return (
                <span key={v} id={`v${v}`} className={`scroll-mt-28 rounded ${picked === v ? "bg-sun/40" : ""}`}>
                  <button type="button" onClick={() => setPicked(picked === v ? null : v)} className="mr-1 align-super font-sans text-xs font-bold text-royal" aria-label={`Verse ${v} options`} aria-expanded={picked === v}>
                    {v}
                  </button>
                  {t}{" "}
                  {picked === v && (
                    <span className="mx-1 inline-flex gap-1 align-middle font-sans">
                      <button type="button" onClick={() => toggleFavorite(favKey)} className="inline-flex min-h-9 items-center gap-1 rounded-full bg-coral-soft px-3 text-sm font-bold text-ink" aria-pressed={fav}>
                        <Heart size={14} className={fav ? "fill-coral text-coral" : ""} aria-hidden /> {fav ? "Favourite" : "Add favourite"}
                      </button>
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}
        <div className="mt-8 flex justify-between gap-3">
          {prev ? (
            <PrimaryButton tone="white" href={prev} icon={<ChevronLeft aria-hidden />}>
              Previous
            </PrimaryButton>
          ) : (
            <span />
          )}
          {next && (
            <PrimaryButton tone="royal" href={next} icon={<ChevronRight aria-hidden />}>
              Next
            </PrimaryButton>
          )}
        </div>
      </article>

      <aside className="space-y-4">
        <div className="card space-y-2 p-5">
          <ContentLabel kind="context" />
          <h2 className="text-xl font-bold text-royal-dark">About {book.name}</h2>
          <p className="text-ink">{book.about}</p>
          <p className="text-sm text-ink-soft">
            {book.testament === "OT" ? "Old Testament" : "New Testament"} · {book.group}
          </p>
        </div>
        {study.length > 0 && (
          <div className="card space-y-2 p-5">
            <ContentLabel kind="explanation" />
            <h2 className="text-xl font-bold text-royal-dark">Kid-friendly lessons for this chapter</h2>
            <ul className="space-y-2">
              {study.map((l) => (
                <li key={l.id}>
                  <Link href={`/lessons/${l.id}`} className="block rounded-2xl bg-sky-soft p-3 font-semibold text-royal-dark hover:bg-sky">
                    {l.title}
                    <span className="block text-sm font-normal text-ink">{l.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="card space-y-2 p-5">
          <label className="block">
            <span className="flex items-center gap-2 text-xl font-bold text-royal-dark">
              <Search size={20} aria-hidden /> Search {book.name}
            </span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a word, like love" className="mt-2 w-full rounded-full border-4 border-royal-soft px-4 py-2 outline-none focus:border-royal" />
          </label>
          {query.trim().length >= 3 && (
            <p className="text-sm text-ink-soft" aria-live="polite">
              {results.length} {results.length === 1 ? "verse" : "verses"} found{results.length === 50 ? " (showing first 50)" : ""}
            </p>
          )}
          <ul className="max-h-80 space-y-1 overflow-y-auto">
            {results.map((r) => (
              <li key={`${r.c}:${r.v}`}>
                <Link href={`/bible/${bookId}/${r.c}#v${r.v}`} className="block rounded-xl p-2 text-sm hover:bg-sky-soft">
                  <span className="font-bold">
                    {book.name} {r.c}:{r.v}
                  </span>{" "}
                  {r.t.slice(0, 90)}
                  {r.t.length > 90 ? "…" : ""}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card flex items-start gap-2 p-4 text-sm text-ink-soft">
          <Volume2 className="mt-0.5 shrink-0" size={18} aria-hidden />
          Read-aloud recordings for Bible chapters haven&apos;t been added yet. For now, a grown-up can read with you.
        </div>
      </aside>
    </div>
  );
}
