import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { GAMES, GAME_BY_ID } from "@/data/games";
import { GamePageClient } from "@/components/games/GamePageClient";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const g = GAME_BY_ID[id];
  if (!g) return {};
  return { title: `${g.title} — Free Bible Game`, description: `${g.blurb} ${g.learn}`, alternates: { canonical: `/games/${g.id}` } };
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = GAME_BY_ID[id];
  if (!game) notFound();
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <Link href="/games" className="inline-flex min-h-11 items-center font-bold text-royal underline">
        ← All games
      </Link>
      <GamePageClient id={game.id} />
    </div>
  );
}
