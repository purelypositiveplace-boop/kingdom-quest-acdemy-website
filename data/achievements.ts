/**
 * Rewards are earned only by learning, never bought, and never compared between children.
 * `check` reads a child's progress snapshot and returns true when earned.
 */
import type { ProgressSnapshot } from "@/lib/progress/types";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  kind: "badge" | "medal" | "award";
  color: string;
  icon: "star" | "leaf" | "ark" | "crown" | "heart" | "book" | "dove" | "lion" | "map" | "fish" | "flame" | "sun";
  check: (p: ProgressSnapshot) => boolean;
}

const lessonsDone = (p: ProgressSnapshot) => Object.keys(p.lessons).length;
const did = (p: ProgressSnapshot, id: string) => Boolean(p.lessons[id]);
const playedWin = (p: ProgressSnapshot, id: string) => (p.games[id]?.wins ?? 0) > 0;
const versesLearned = (p: ProgressSnapshot) => Object.values(p.verses).filter((v) => v.box >= 3).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: "story-beginner", title: "Bible Story Beginner", description: "Finish your first Bible lesson.", kind: "badge", color: "#ffd23f", icon: "star", check: (p) => lessonsDone(p) >= 1 },
  { id: "story-adventurer", title: "Bible Story Adventurer", description: "Finish 5 Bible lessons.", kind: "medal", color: "#ff8a5c", icon: "book", check: (p) => lessonsDone(p) >= 5 },
  { id: "story-champion", title: "Bible Story Champion", description: "Finish 15 Bible lessons.", kind: "award", color: "#c77dff", icon: "crown", check: (p) => lessonsDone(p) >= 15 },
  { id: "creation-explorer", title: "Creation Explorer", description: "Complete 'God Creates the World.'", kind: "badge", color: "#34c38f", icon: "leaf", check: (p) => did(p, "creation") },
  { id: "noahs-helper", title: "Noah's Helper", description: "Complete 'Noah Builds the Ark.'", kind: "badge", color: "#4aa8ff", icon: "ark", check: (p) => did(p, "noah") },
  { id: "moses-explorer", title: "Moses Explorer", description: "Complete 'Crossing the Red Sea.'", kind: "badge", color: "#f5b942", icon: "map", check: (p) => did(p, "red-sea") },
  { id: "courageous-like-david", title: "Courageous Like David", description: "Complete 'David and Goliath.'", kind: "badge", color: "#ff8a5c", icon: "lion", check: (p) => did(p, "david-goliath") },
  { id: "christmas-star", title: "Christmas Star", description: "Complete 'The Birth of Jesus.'", kind: "badge", color: "#b58cff", icon: "star", check: (p) => did(p, "jesus-born") },
  { id: "easter-joy", title: "Easter Joy", description: "Complete 'Jesus Dies and Rises Again.'", kind: "badge", color: "#ffd23f", icon: "sun", check: (p) => did(p, "jesus-dies-and-rises") },
  { id: "galilee-sailor", title: "Galilee Sailor", description: "Complete 2 lessons at Galilee Lake.", kind: "badge", color: "#2ec4c4", icon: "fish", check: (p) => ["jesus-calls-disciples", "jesus-calms-storm", "feeds-five-thousand", "jesus-baptism", "jesus-and-children"].filter((id) => did(p, id)).length >= 2 },
  { id: "early-church-explorer", title: "Early Church Explorer", description: "Complete 'Pentecost' and 'Saul Becomes Paul.'", kind: "badge", color: "#6c7bff", icon: "flame", check: (p) => did(p, "pentecost") && did(p, "saul-becomes-paul") },
  { id: "jesus-teachings-explorer", title: "Jesus' Teachings Explorer", description: "Complete 3 parable lessons.", kind: "medal", color: "#3fa34d", icon: "book", check: (p) => ["good-samaritan", "lost-sheep", "prodigal-son"].every((id) => did(p, id)) },
  { id: "memory-verse-star", title: "Memory Verse Star", description: "Learn 5 memory verses.", kind: "medal", color: "#ffd23f", icon: "star", check: (p) => versesLearned(p) >= 5 },
  { id: "kindness-champion", title: "Kindness Champion", description: "Finish 5 Living with Love lessons.", kind: "medal", color: "#ff7eb6", icon: "heart", check: (p) => Object.keys(p.values).length >= 5 },
  { id: "prayer-garden-explorer", title: "Prayer Garden Explorer", description: "Visit 3 places in the Prayer Garden.", kind: "badge", color: "#9fd3ff", icon: "dove", check: (p) => p.prayers.length >= 3 },
  { id: "fruit-gardener", title: "Fruit of the Spirit Gardener", description: "Grow the whole Fruit of the Spirit garden.", kind: "badge", color: "#7cc576", icon: "leaf", check: (p) => playedWin(p, "fruit-garden") },
  { id: "bible-books-master", title: "Bible Books Master", description: "Put all 66 books in order.", kind: "award", color: "#8c6bff", icon: "book", check: (p) => (p.games["books-order"]?.modes ?? []).includes("all") },
  { id: "game-explorer", title: "Game Center Explorer", description: "Finish 5 different games.", kind: "medal", color: "#4aa8ff", icon: "map", check: (p) => Object.values(p.games).filter((g) => g.wins > 0).length >= 5 },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])) as Record<string, Achievement>;
