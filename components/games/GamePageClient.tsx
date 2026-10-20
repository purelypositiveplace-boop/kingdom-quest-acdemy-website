"use client";

import { GAME_BY_ID } from "@/data/games";
import { GameShell } from "./GameShell";
import { useLevel } from "@/lib/progress/useLevel";

export function GamePageClient({ id }: { id: string }) {
  const level = useLevel();
  return <GameShell game={GAME_BY_ID[id]} level={level} />;
}
