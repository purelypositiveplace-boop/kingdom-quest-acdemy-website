import type { Metadata } from "next";
import Link from "next/link";
import { Printer } from "lucide-react";
import { PRINTABLES, PRINTABLE_CATEGORIES } from "@/data/printables";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Free Printable Bible Activities — Coloring Pages & Sunday School Worksheets",
  description: "Free printable Bible activities for kids: creation sequencing, Noah's ark matching, mazes, word searches, crosswords, memory verse cards and certificates. US Letter or A4.",
  alternates: { canonical: "/printables" },
};

export default function PrintablesPage() {
  const cats = PRINTABLE_CATEGORIES.filter((c) => PRINTABLES.some((p) => p.category === c));
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Printable Activity Center" subtitle="Free worksheets, puzzles, cards and colouring pages. Choose US Letter or A4, then print." color="#2ec4c4" mascot={<Mascot id="finn" size={100} />} />
      {cats.map((c) => (
        <section key={c}>
          <h2 className="mb-3 text-2xl font-bold text-royal-dark">{c}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINTABLES.filter((p) => p.category === c).map((p) => (
              <Link key={p.id} href={`/printables/${p.id}`} className="card flex gap-3 p-5 transition hover:-translate-y-1">
                <Printer className="mt-1 shrink-0 text-royal" aria-hidden />
                <span>
                  <span className="block font-display text-lg font-bold text-royal-dark">{p.title}</span>
                  <span className="block text-sm text-ink-soft">{p.description}</span>
                  <span className="mt-1 block text-xs font-bold text-ink-soft">Ages {p.ages}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
