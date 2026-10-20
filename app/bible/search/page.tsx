import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { parseRef } from "@/lib/bible/reference";
import { searchBible } from "@/lib/bible/search";
import { PageHero, EmptyState } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Search the Bible",
  description: "Search all 66 books of the World English Bible for a word or phrase.",
  alternates: { canonical: "/bible/search" },
};

const LIMIT = 100;

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-sun/60 px-0.5 text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default async function BibleSearchPage({ searchParams }: { searchParams: Promise<{ q?: string; t?: string }> }) {
  const { q = "", t = "" } = await searchParams;
  const query = q.trim().slice(0, 80);
  // a reference like "John 3:16" or "Psalm 23" goes straight to the passage
  const ref = query ? parseRef(query) : null;
  if (ref) redirect(`/bible/${ref.book.id}/${ref.chapter}${ref.verseStart ? `#v${ref.verseStart}` : ""}`);
  const testament = t === "OT" || t === "NT" ? t : undefined;
  const { hits, total } = await searchBible(query, testament, LIMIT);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <PageHero title="Search the Bible" subtitle="Find any word in all 66 books, or type a reference like John 3:16." color="#2a48d4" mascot={<Mascot id="oliver" size={100} />} />
      <form action="/bible/search" className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Word, phrase or reference</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input name="q" defaultValue={query} placeholder="love, shepherd, John 3:16..." className="w-full rounded-full border-4 border-royal-soft py-3 pl-12 pr-4 text-lg outline-none focus:border-royal" />
        </label>
        <label className="flex items-center gap-2 font-semibold text-ink">
          <span className="sr-only">Which part of the Bible</span>
          <select name="t" defaultValue={testament ?? ""} className="min-h-12 rounded-full border-4 border-royal-soft bg-white px-3">
            <option value="">Whole Bible</option>
            <option value="OT">Old Testament</option>
            <option value="NT">New Testament</option>
          </select>
        </label>
        <button type="submit" className="btn-toy bg-royal text-white">
          Search
        </button>
      </form>

      {query.length >= 2 && (
        <p className="font-semibold text-ink-soft" aria-live="polite">
          {total === 0 ? "No verses found." : `${total.toLocaleString()} ${total === 1 ? "verse" : "verses"} found${total > LIMIT ? ` — showing the first ${LIMIT}. Add another word to narrow it down.` : "."}`}
        </p>
      )}

      {query.length >= 2 && total === 0 ? (
        <EmptyState title="Nothing found" message="Check the spelling, or try a shorter word like 'love' or 'light'." />
      ) : (
        <ol className="space-y-2">
          {hits.map((h) => (
            <li key={`${h.book.id}-${h.chapter}-${h.verse}`}>
              <Link href={`/bible/${h.book.id}/${h.chapter}#v${h.verse}`} className="card block p-4 transition hover:-translate-y-0.5">
                <span className="font-display text-lg font-bold text-royal-dark">
                  {h.book.name} {h.chapter}:{h.verse}
                </span>
                <span className="scripture mt-1 block text-ink">
                  <Highlight text={h.text} q={query} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
      <p className="text-sm text-ink-soft">Bible text: World English Bible (public domain).</p>
    </div>
  );
}
