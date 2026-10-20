import type { Metadata } from "next";
import Link from "next/link";
import { AdventureMap } from "@/components/world/AdventureMap";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";
import { WORLDS } from "@/data/worlds";
import { LESSONS } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Kingdom Quest World — Bible Adventure Map",
  description: "Explore ten Bible lands on an illustrated adventure map: Creation Garden, Noah's Ark Harbor, Egypt, David's Kingdom, Bethlehem, Galilee, Jerusalem and more.",
  alternates: { canonical: "/world" },
};

export default function WorldPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Kingdom Quest World" subtitle="Follow the golden paths from the Academy castle to the lands of the Bible. Tap a land to explore!" color="#1fa463" mascot={<Mascot id="leo" size={110} expression="excited" />} />
      <AdventureMap />
      <section aria-labelledby="lands">
        <h2 id="lands" className="mb-3 text-2xl font-bold text-royal-dark">
          All lands
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {WORLDS.map((w) => (
            <li key={w.id}>
              <Link href={`/world/${w.id}`} className="card flex min-h-16 items-center gap-3 p-3 hover:-translate-y-0.5">
                <span className="h-10 w-10 shrink-0 rounded-full" style={{ background: w.color }} aria-hidden />
                <span>
                  <span className="block font-display font-bold text-royal-dark">{w.name}</span>
                  <span className="text-xs text-ink-soft">{LESSONS.filter((l) => l.world === w.id).length} lessons</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
