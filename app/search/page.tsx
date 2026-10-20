import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/layout/SearchView";
import { PageHero, LoadingState } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = { title: "Search", alternates: { canonical: "/search" } };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Search" subtitle="Find Bible stories, people, games, books, verses and more." color="#4a5078" mascot={<Mascot id="oliver" size={100} expression="thinking" />} />
      <Suspense fallback={<LoadingState />}>
        <SearchView />
      </Suspense>
    </div>
  );
}
