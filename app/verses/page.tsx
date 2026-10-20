import type { Metadata } from "next";
import { VerseCenter } from "@/components/bible/VerseCenter";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Bible Memory Verses for Kids",
  description: "40 kid-friendly Bible memory verses from the World English Bible, with flashcards, missing-word games, verse scrambles, gentle spaced review and printable verse cards.",
  alternates: { canonical: "/verses" },
};

export default function VersesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Memory Verse Center" subtitle="Hide God's Word in your heart! Practise with flashcards, missing words and verse puzzles. Try as many times as you like." color="#f0a92e" mascot={<Mascot id="grace" size={110} expression="happy" />} />
      <VerseCenter />
    </div>
  );
}
