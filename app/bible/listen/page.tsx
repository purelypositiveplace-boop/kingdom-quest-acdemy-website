import type { Metadata } from "next";
import Link from "next/link";
import { Headphones } from "lucide-react";
import { BOOKS } from "@/data/bible/books";
import { recordedChapters, anyBibleAudio } from "@/lib/bible/audio";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";
import { art } from "@/lib/art";

export const metadata: Metadata = {
  title: "Read Me the Bible — Bible Storybook Reader for Kids",
  description: "Read the Bible like a storybook: big words, page turning, and a natural voice that reads aloud and follows along.",
  alternates: { canonical: "/bible/listen" },
};

/** Favourite places to start, for children who don't know where to begin. */
const STARTS = [
  { book: "genesis", chapter: 1, label: "In the beginning" },
  { book: "psalms", chapter: 23, label: "The Lord is my shepherd" },
  { book: "jonah", chapter: 1, label: "Jonah's adventure" },
  { book: "ruth", chapter: 1, label: "Ruth and Naomi" },
  { book: "luke", chapter: 2, label: "Jesus is born" },
  { book: "mark", chapter: 4, label: "Jesus calms the storm" },
  { book: "luke", chapter: 15, label: "The lost sheep and the lost son" },
  { book: "john", chapter: 20, label: "Jesus is alive!" },
];

export default function ListenPage() {
  const any = anyBibleAudio();
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Read Me the Bible" subtitle="Open the Bible like a big storybook. Turn the pages, and let a friendly voice read it to you." color="#8a5a33" mascot={<Mascot id="oliver" size={110} expression="happy" />} />
      {art("/art/pages/reading.webp") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={art("/art/pages/reading.webp")} alt="A child reading a big glowing Bible storybook" className="aspect-[3/1] w-full rounded-[2rem] object-cover shadow-[var(--shadow-card)]" />
      )}
      {!any && <p className="card p-4 text-ink-soft">The reading voice is being recorded. Until then, every chapter opens as a storybook you can read along with a grown-up.</p>}
      <section>
        <h2 className="mb-3 text-2xl font-bold text-royal-dark">Great places to start</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STARTS.map((s) => {
            const b = BOOKS.find((x) => x.id === s.book)!;
            const has = recordedChapters(s.book).includes(s.chapter);
            return (
              <Link key={`${s.book}${s.chapter}`} href={`/bible/listen/${s.book}/${s.chapter}`} className="card flex min-h-24 flex-col justify-center p-4 transition hover:-translate-y-1">
                <span className="font-display text-lg font-bold text-royal-dark">{s.label}</span>
                <span className="text-sm text-ink-soft">
                  {s.book === "psalms" ? `Psalm ${s.chapter}` : `${b.name} ${s.chapter}`}
                  {has && (
                    <span className="ml-2 inline-flex items-center gap-1 font-bold text-emerald">
                      <Headphones size={14} aria-hidden /> read aloud
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      {(["OT", "NT"] as const).map((t) => (
        <section key={t}>
          <h2 className="mb-3 text-2xl font-bold text-royal-dark">{t === "OT" ? "Old Testament" : "New Testament"}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {BOOKS.filter((b) => b.testament === t).map((b) => {
              const n = recordedChapters(b.id).length;
              return (
                <Link key={b.id} href={`/bible/listen/${b.id}/1`} className="card flex min-h-16 flex-col justify-center p-3 hover:-translate-y-0.5">
                  <span className="font-display font-bold text-royal-dark">{b.name}</span>
                  {n > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald">
                      <Headphones size={12} aria-hidden /> {n} read aloud
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
