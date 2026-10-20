"use client";

import { useHydrated, useKQ } from "./store";
import type { AgeLevel } from "@/lib/curriculum/types";

/** The active child's level (defaults to Kingdom Explorers before a profile exists). */
export function useLevel(): AgeLevel {
  const hydrated = useHydrated();
  const level = useKQ((s) => s.profile?.level);
  return hydrated && level ? level : "explorers";
}
