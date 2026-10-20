import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BOOK_BY_ID } from "@/data/bible/books";
import counts from "@/data/bible/chapter-counts.generated.json";
import { ChapterReader } from "@/components/bible/ChapterReader";

export async function generateMetadata({ params }: { params: Promise<{ book: string; chapter: string }> }): Promise<Metadata> {
  const { book, chapter } = await params;
  const b = BOOK_BY_ID[book];
  return b ? { title: `${b.name} ${chapter} — Bible for Kids (WEB)`, description: `${b.about} Read ${b.name} chapter ${chapter} in the World English Bible.`, alternates: { canonical: `/bible/${book}/${chapter}` } } : {};
}

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book, chapter } = await params;
  const b = BOOK_BY_ID[book];
  const ch = Number(chapter);
  const max = (counts as Record<string, number>)[book];
  if (!b || !Number.isInteger(ch) || ch < 1 || ch > max) notFound();
  return <ChapterReader bookId={b.id} chapter={ch} chapters={max} />;
}
