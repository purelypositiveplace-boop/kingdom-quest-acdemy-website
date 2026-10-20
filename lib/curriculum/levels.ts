import type { AgeLevel, MascotId } from "./types";

export interface LevelInfo {
  id: AgeLevel;
  name: string;
  ages: string;
  short: string;
  focus: string;
  guide: MascotId;
  color: string;
  sessionMinutes: string;
}

export const LEVELS: Record<AgeLevel, LevelInfo> = {
  disciples: {
    id: "disciples",
    name: "Little Disciples",
    ages: "Ages 3–5",
    short: "Level 1",
    focus: "Picture Bible stories, narration, matching, colours, songs and simple values.",
    guide: "sunny",
    color: "#ffb84d",
    sessionMinutes: "3–7 minutes",
  },
  explorers: {
    id: "explorers",
    name: "Kingdom Explorers",
    ages: "Ages 6–8",
    short: "Level 2",
    focus: "Interactive stories, quizzes, puzzles, memory verses, Bible characters and exploring.",
    guide: "leo",
    color: "#34c38f",
    sessionMinutes: "5–12 minutes",
  },
  champions: {
    id: "champions",
    name: "Faith Champions",
    ages: "Ages 9–12",
    short: "Level 3",
    focus: "Deeper Bible knowledge, history, geography, Scripture study and challenging games.",
    guide: "oliver",
    color: "#3b5bdb",
    sessionMinutes: "10–20 minutes",
  },
};

export const LEVEL_LIST = [LEVELS.disciples, LEVELS.explorers, LEVELS.champions];
