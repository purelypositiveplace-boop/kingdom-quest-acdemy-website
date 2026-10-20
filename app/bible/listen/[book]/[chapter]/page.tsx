import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BOOK_BY_ID } from "@/data/bible/books";
import counts from "@/data/bible/chapter-counts.generated.json";
import { BookReader } from "@/components/bible/BookReader";
import { LoadingState } from "@/components/ui/states";

export async function generateMetadata({ params }: { params: Promise<{ book: string; chapter: string }> }): Promise<Metadata> {
  const { book, chapter } = await params;
  const b = BOOK_BY_ID[book];
  const name = book === "psalms" ? `Psalm ${chapter}` : `${b?.name} ${chapter}`;
  return b ? { title: `Read me ${name} — Bible Storybook`, description: `Read ${b.name} chapter ${chapter} like a book, with page turning and read-aloud.`, alternates: { canonical: `/bible/listen/${book}/${chapter}` } } : {};
}

export default async function ListenChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book, chapter } = await params;
  const b = BOOK_BY_ID[book];
  const ch = Number(chapter);
  const max = (counts as Record<string, number>)[book];
  if (!b || !Number.isInteger(ch) || ch < 1 || ch > max) notFound();
  return (
    <Suspense fallback={<LoadingState label="Opening the book..." />}>
      <BookReader bookId={b.id} chapter={ch} chapters={max} />
    </Suspense>
  );
}
