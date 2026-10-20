"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AgeLevel } from "@/lib/curriculum/types";
import { emptyProgress, type ChildProfileLocal, type ProgressSnapshot } from "./types";
import { applyLessonComplete, applyGame, applyVerseReview, evaluateBadges } from "./logic";

export interface Settings {
  textSize: "normal" | "large" | "xl";
  easyFont: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  sound: boolean;
  music: boolean;
  /** stars, badges and celebrations; parents can turn off */
  gamification: boolean;
  /** fewer words, more pictures */
  minimalReading: boolean;
  /** timers in games are always optional; this is the default */
  timers: boolean;
  /** gentle "time for a break?" reminder after this many minutes (0 = off); set by parents */
  breakMinutes: number;
  /** lessons a parent recommended */
  recommended: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  textSize: "normal",
  easyFont: false,
  highContrast: false,
  reducedMotion: false,
  sound: true,
  music: false,
  gamification: true,
  minimalReading: false,
  timers: false,
  breakMinutes: 0,
  recommended: [],
};

/** Signed-in families: which child profile is active. Guests have none. */
export interface AccountLink {
  childId: string;
  nickname: string;
}

interface State {
  profile: ChildProfileLocal | null;
  settings: Settings;
  progress: ProgressSnapshot;
  account: AccountLink | null;
  /** badges earned by the most recent action, shown by the celebration overlay */
  justEarned: string[];
  onboarded: boolean;
  /** a change that has not reached the server yet (signed-in families only) */
  pendingSync: boolean;

  setProfile: (p: Partial<ChildProfileLocal>) => void;
  setLevel: (level: AgeLevel) => void;
  setSettings: (s: Partial<Settings>) => void;
  completeLesson: (id: string, version: number, score: number, total: number, stars: number) => string[];
  saveScene: (lessonId: string, index: number) => void;
  recordGame: (id: string, won: boolean, score?: number, mode?: string) => string[];
  reviewVerse: (ref: string, correct: boolean) => string[];
  completeValue: (id: string) => string[];
  visitPrayer: (id: string) => string[];
  toggleFavorite: (key: string) => void;
  toggleBookmark: (key: string) => void;
  clearJustEarned: () => void;
  finishOnboarding: () => void;
  linkAccount: (link: AccountLink, profile: ChildProfileLocal, progress: ProgressSnapshot, settings?: Partial<Settings>) => void;
  unlinkAccount: () => void;
  resetProgress: () => void;
}

let syncTimer: ReturnType<typeof setTimeout> | undefined;

/** Uploads the snapshot now. `keepalive` lets the request finish while the page is closing. */
export function flushSync(keepalive = false) {
  const s = useKQ.getState();
  if (!s.account || !s.pendingSync) return;
  clearTimeout(syncTimer);
  fetch("/api/progress", {
    method: "POST",
    keepalive,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ childId: s.account.childId, progress: s.progress }),
  })
    .then((r) => {
      if (r.ok) useKQ.setState({ pendingSync: false });
    })
    .catch(() => {
      /* offline: pendingSync stays true and is retried on the next change or page load */
    });
}

/** Debounced upload for signed-in families. Guests never send anything. */
function scheduleSync(get: () => State) {
  const { account } = get();
  if (!account || typeof window === "undefined") return;
  useKQ.setState({ pendingSync: true });
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => flushSync(), 800);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => flushSync(true));
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flushSync(true));
}

function withBadges(p: ProgressSnapshot): { progress: ProgressSnapshot; earned: string[] } {
  const earned = evaluateBadges(p);
  if (!earned.length) return { progress: p, earned };
  const badges = { ...p.badges };
  for (const id of earned) badges[id] = Date.now();
  return { progress: { ...p, badges }, earned };
}

export const useKQ = create<State>()(
  persist(
    (set, get) => {
      const commit = (next: ProgressSnapshot): string[] => {
        const { progress, earned } = withBadges(next);
        set({ progress, justEarned: earned.length ? earned : get().justEarned });
        scheduleSync(get);
        return earned;
      };
      return {
        profile: null,
        settings: DEFAULT_SETTINGS,
        progress: emptyProgress(),
        account: null,
        justEarned: [],
        onboarded: false,
        pendingSync: false,

        setProfile: (p) =>
          set((s) => ({ profile: { nickname: "Friend", avatar: "leo", level: "explorers", world: "creation-garden", ...s.profile, ...p } })),
        setLevel: (level) => get().setProfile({ level }),
        setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

        completeLesson: (id, version, score, total, stars) => commit(applyLessonComplete(get().progress, id, version, score, total, stars)),
        saveScene: (lessonId, index) => {
          set((s) => ({ progress: { ...s.progress, scenes: { ...s.progress.scenes, [lessonId]: index } } }));
          scheduleSync(get);
        },
        recordGame: (id, won, score = 0, mode) => commit(applyGame(get().progress, id, won, score, mode)),
        reviewVerse: (ref, correct) => commit(applyVerseReview(get().progress, ref, correct)),
        completeValue: (id) => {
          const p = get().progress;
          if (p.values[id]) return [];
          return commit({ ...p, stars: p.stars + 1, values: { ...p.values, [id]: Date.now() }, history: [...p.history, { type: "value", id, at: Date.now() }].slice(-200) });
        },
        visitPrayer: (id) => {
          const p = get().progress;
          if (p.prayers.includes(id)) return [];
          return commit({ ...p, prayers: [...p.prayers, id] });
        },
        toggleFavorite: (key) => {
          const p = get().progress;
          const favorites = p.favorites.includes(key) ? p.favorites.filter((f) => f !== key) : [...p.favorites, key];
          commit({ ...p, favorites });
        },
        toggleBookmark: (key) => {
          const p = get().progress;
          const bookmarks = p.bookmarks.includes(key) ? p.bookmarks.filter((f) => f !== key) : [...p.bookmarks, key];
          commit({ ...p, bookmarks });
        },
        clearJustEarned: () => set({ justEarned: [] }),
        finishOnboarding: () => set({ onboarded: true }),
        linkAccount: (account, profile, progress, settings) =>
          set((s) => ({ account, profile, progress: { ...emptyProgress(), ...progress }, settings: { ...s.settings, ...settings }, onboarded: true })),
        unlinkAccount: () => set({ account: null, profile: null, progress: emptyProgress(), onboarded: false, pendingSync: false }),
        resetProgress: () => {
          set({ progress: emptyProgress() });
          scheduleSync(get);
        },
      };
    },
    {
      name: "kqa-v1",
      // Load saved data after the first render so server HTML and the first client render match.
      // AccessibilityApplier calls useKQ.persist.rehydrate() on mount.
      skipHydration: true,
      version: 1,
      storage: createJSONStorage(() => {
        try {
          return window.localStorage;
        } catch {
          // private mode or blocked storage: fall back to memory only
          const mem = new Map<string, string>();
          return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v), removeItem: (k) => void mem.delete(k) };
        }
      }),
      partialize: (s) => ({ profile: s.profile, settings: s.settings, progress: s.progress, account: s.account, onboarded: s.onboarded, pendingSync: s.pendingSync }),
      // retry anything that did not reach the server before the last page closed
      onRehydrateStorage: () => (state) => {
        if (state?.pendingSync) setTimeout(() => flushSync(), 0);
      },
    },
  ),
);

/** True once the persisted state has loaded in the browser (avoids hydration flicker). */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    const unsub = useKQ.persist.onFinishHydration(() => setH(true));
    if (useKQ.persist.hasHydrated()) setH(true);
    return unsub;
  }, []);
  return h;
}

