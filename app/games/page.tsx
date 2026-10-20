import type { Metadata } from "next";
import { GameCenter } from "@/components/games/GameCenter";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Bible Games for Kids — Free Christian Learning Games",
  description: "16 free Bible games for kids: Noah's Ark animal match, creation sorting, Bible books order, word search, crossword, trivia and more. No ads, no in-app purchases.",
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Game Center" subtitle="Play, learn and have fun! Every game is free. No ads, no waiting, no buying." color="#8c6bff" mascot={<Mascot id="finn" size={110} expression="excited" />} />
      <GameCenter />
    </div>
  );
}
