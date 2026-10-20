"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, Search } from "lucide-react";
import { BOOKS, CANON, type BookGroup } from "@/data/bible/books";
import counts from "@/data/bible/chapter-counts.generated.json";
import { parseRef } from "@/lib/bible/reference";
import { useKQ } from "@/lib/progress/store";

const GROUP_COLORS: Record<BookGroup, string> = {
  Law: "#ff7a59",
  History: "#f0a92e",
  "Poetry & Wisdom": "#1fa463",
  "Major Prophets": "#2ec4c4",
  "Minor Prophets": "#6fc3ff",
  Gospels: "#ffd23f",
  "Church History": "#ff8fc1",
  "Paul's Letters": "#8c6bff",
  "General Letters": "#b9a6ff",
  Prophecy: "#2a48d4",
};

export function BookList() {
  const router = useRouter();
  const allBookmarks = useKQ((s) => s.progress.bookmarks);
  const bookmarks = allBookmarks.filter((b) => b.startsWith("chapter:"));
  const [jump, setJump] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="space-y-8">
      <form
        className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
        onSubmit={(e) => {
          e.preventDefault();
          const p = parseRef(jump);
          if (!p) {
            if (jump.trim().length >= 2) return router.push(`/bible/search?q=${encodeURIComponent(jump.trim())}`);
            return setErr("Try something like John 3:16 or Psalm 23.");
          }
          router.push(`/bible/${p.book.id}/${p.chapter}${p.verseStart ? `#v${p.verseStart}` : ""}`);
        }}
      >
        <label className="relative flex-1">
          <span className="sr-only">Go to a Bible reference</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={jump} onChange={(e) => { setJump(e.target.value); setErr(""); }} placeholder="Go to a verse: John 3:16" className="w-full rounded-full border-4 border-royal-soft py-3 pl-12 pr-4 text-lg outline-none focus:border-royal" />
        </label>
        <button type="submit" className="btn-toy bg-royal text-white">
          Go
        </button>
        {err && <p className="text-sm font-semibold text-coral" role="alert">{err}</p>}
      </form>
      <p className="-mt-5 px-2 text-sm text-ink-soft">
        Looking for a word instead?{" "}
        <Link href="/bible/search" className="font-bold text-royal underline">
          Search the whole Bible
        </Link>
      </p>

      {bookmarks.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-royal-dark">
            <Bookmark aria-hidden /> My bookmarks
          </h2>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((b) => {
              const [, book, ch] = b.split(":");
              const name = BOOKS.find((x) => x.id === book)?.name;
              return (
                <Link key={b} href={`/bible/${book}/${ch}`} className="inline-flex min-h-11 items-center rounded-full bg-sun px-4 font-display font-semibold text-ink">
                  {name} {ch}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {(["OT", "NT"] as const).map((t) => (
        <section key={t} aria-labelledby={`t-${t}`}>
          <h2 id={`t-${t}`} className="mb-1 text-3xl font-bold text-royal-dark">
            {t === "OT" ? "Old Testament" : "New Testament"}
          </h2>
          <p className="mb-4 text-ink-soft">{t === "OT" ? "39 books written before Jesus was born." : "27 books about Jesus and the early church."}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {BOOKS.filter((b) => b.testament === t).map((b) => (
              <Link key={b.id} href={`/bible/${b.id}/1`} className="card flex min-h-20 flex-col justify-center p-3 transition hover:-translate-y-0.5" style={{ borderTop: `8px solid ${GROUP_COLORS[b.group]}` }}>
                <span className="font-display text-lg font-bold text-royal-dark">{b.name}</span>
                <span className="text-xs text-ink-soft">
                  {b.group} · {(counts as Record<string, number>)[b.id]} ch.
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="text-sm text-ink-soft">{CANON.note} Text: World English Bible (public domain).</p>
    </div>
  );
}
