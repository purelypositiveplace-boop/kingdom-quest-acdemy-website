import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { VALUES } from "@/data/values";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Living with Love — Christian Values for Kids",
  description: "Bible-based lessons on kindness, sharing, honesty, forgiveness, patience, courage and more, with everyday scenarios for kids.",
  alternates: { canonical: "/values" },
};

export default function ValuesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Living with Love" subtitle="What does following Jesus look like at school, at home and with friends? Let's practise!" color="#ff7eb6" mascot={<Mascot id="grace" size={110} />} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map((v) => (
          <Link key={v.id} href={`/values/${v.id}`} className="card flex items-start gap-3 p-5 transition hover:-translate-y-1">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral-soft">
              <Heart className="text-coral" aria-hidden />
            </span>
            <span>
              <span className="block font-display text-xl font-bold text-royal-dark">{v.title}</span>
              <span className="text-sm text-ink-soft">{v.scenario}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
