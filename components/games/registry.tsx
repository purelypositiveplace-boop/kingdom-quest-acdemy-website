"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GameProps } from "@/lib/games/types";
import { LoadingState } from "@/components/ui/states";

const load = (f: () => Promise<{ default: ComponentType<GameProps> }>) => dynamic(f, { ssr: false, loading: () => <LoadingState label="Loading game..." /> });

/** Each game is code-split so the Game Center loads fast. */
export const GAME_COMPONENTS: Record<string, ComponentType<GameProps>> = {
  "ark-match": load(() => import("./list/ArkMatch")),
  "memory-match": load(() => import("./list/BibleMemoryMatch")),
  "creation-sort": load(() => import("./list/CreationSort")),
  "commandments-match": load(() => import("./list/CommandmentsMatch")),
  "fruit-garden": load(() => import("./list/FruitGarden")),
  "books-order": load(() => import("./list/BooksOrder")),
  "guess-who": load(() => import("./list/GuessWho")),
  "word-search": load(() => import("./list/WordSearch")),
  crossword: load(() => import("./list/Crossword")),
  trivia: load(() => import("./list/Trivia")),
  "verse-builder": load(() => import("./list/VerseBuilder")),
  "parable-puzzle": load(() => import("./list/ParablePuzzle")),
  "kindness-quest": load(() => import("./list/KindnessQuest")),
  "jonah-ocean": load(() => import("./list/JonahOcean")),
  "map-hunt": load(() => import("./list/MapHunt")),
  "armor-of-god": load(() => import("./list/ArmorOfGod")),
};
