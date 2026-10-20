import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTERS } from "@/data/characters";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";
import { PersonPortrait } from "@/components/bible/PersonPortrait";
import { ART_NOTE } from "@/data/art-manifest";

export const metadata: Metadata = {
  title: "Bible Characters for Kids",
  description: "Meet the people of the Bible: Noah, Abraham, Moses, Ruth, David, Esther, Mary, Peter, Paul and more, with kid-friendly profiles and quizzes.",
  alternates: { canonical: "/characters" },
};

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Bible People" subtitle="Meet the real people whose stories are told in the Bible." color="#ff8a5c" mascot={<Mascot id="oliver" size={110} />} />
      {(["OT", "NT"] as const).map((t) => (
        <section key={t}>
          <h2 className="mb-3 text-2xl font-bold text-royal-dark">{t === "OT" ? "Old Testament people" : "New Testament people"}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CHARACTERS.filter((c) => c.testament === t).map((c) => (
              <Link key={c.id} href={`/characters/${c.id}`} className="card flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1">
                <PersonPortrait id={c.id} name={c.name} color={c.color} />
                <span className="font-display text-lg font-bold leading-tight text-royal-dark">{c.name}</span>
                <span className="text-xs text-ink-soft">{c.role}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="text-sm text-ink-soft">{ART_NOTE}</p>
    </div>
  );
}
