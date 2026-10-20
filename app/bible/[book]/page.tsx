import { notFound, redirect } from "next/navigation";
import { BOOK_BY_ID } from "@/data/bible/books";

/** /bible/genesis opens the book at chapter 1. */
export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book } = await params;
  if (!BOOK_BY_ID[book]) notFound();
  redirect(`/bible/${book}/1`);
}
