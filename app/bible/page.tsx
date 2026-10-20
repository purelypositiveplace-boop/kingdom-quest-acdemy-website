import type { Metadata } from "next";
import { BookList } from "@/components/bible/BookList";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Interactive Children's Bible — All 66 Books",
  description: "Read all 66 books of the Bible in the public-domain World English Bible, with kid-friendly book introductions, pronunciation help, bookmarks and favourite verses.",
  alternates: { canonical: "/bible" },
};

export default function BiblePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Bible Reader" subtitle="Explore all 66 books of the Bible. Tap a book to start reading." color="#2a48d4" mascot={<Mascot id="oliver" size={110} />} />
      <BookList />
    </div>
  );
}
