"use client";

import { useState } from "react";
import type { GameProps } from "@/lib/games/types";
import { BOOKS, CANON } from "@/data/bible/books";
import { SequenceTap } from "../SequenceTap";

export const BOOK_MODES = [
  { id: "law", name: "First five books", books: BOOKS.slice(0, 5) },
  { id: "gospels", name: "The Gospels", books: BOOKS.filter((b) => b.group === "Gospels") },
  { id: "nt", name: "New Testament (27)", books: BOOKS.filter((b) => b.testament === "NT") },
  { id: "ot", name: "Old Testament (39)", books: BOOKS.filter((b) => b.testament === "OT") },
  { id: "all", name: "Whole Bible (66)", books: BOOKS },
] as const;

export default function BooksOrder({ onFinish }: GameProps) {
  const [mode, setMode] = useState<(typeof BOOK_MODES)[number] | null>(null);
  if (!mode)
    return (
      <div>
        <p className="mb-3 text-ink-soft">{CANON.note}</p>
        <h3 className="mb-3 font-display text-xl font-bold text-royal-dark">Choose a challenge</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BOOK_MODES.map((m) => (
            <button key={m.id} type="button" onClick={() => setMode(m)} className="card min-h-20 p-4 text-left transition hover:-translate-y-1" data-testid={`mode-${m.id}`}>
              <span className="block font-display text-xl font-bold text-royal-dark">{m.name}</span>
              <span className="text-sm text-ink-soft">{m.books.length} books</span>
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <SequenceTap
      compact
      items={mode.books.map((b) => b.name)}
      prompt={`Tap the books in Bible order (${mode.name}).`}
      onWin={(misses, hints) =>
        onFinish({
          won: true,
          mode: mode.id,
          score: Math.max(1, 100 - misses * 2 - hints * 3),
          message: `You put ${mode.books.length} books in order! It starts with ${mode.books[0].name} and ends with ${mode.books[mode.books.length - 1].name}.`,
        })
      }
    />
  );
}
