import type { SceneTheme } from "@/lib/curriculum/types";

/** Bible Story Library categories, in Bible order. Empty categories are hidden automatically. */
export interface StoryCategory {
  id: string;
  name: string;
  testament: "OT" | "NT" | "Both";
  theme: SceneTheme;
}

export const STORY_CATEGORIES: StoryCategory[] = [
  { id: "creation", name: "Creation and Beginnings", testament: "OT", theme: "garden" },
  { id: "noah", name: "Noah and the Flood", testament: "OT", theme: "rainbow" },
  { id: "abraham", name: "Abraham and Sarah", testament: "OT", theme: "night" },
  { id: "isaac-jacob", name: "Isaac and Jacob", testament: "OT", theme: "desert" },
  { id: "joseph", name: "Joseph", testament: "OT", theme: "palace" },
  { id: "moses", name: "Moses and Exodus", testament: "OT", theme: "sea" },
  { id: "joshua", name: "Joshua and the Promised Land", testament: "OT", theme: "city" },
  { id: "judges", name: "Judges", testament: "OT", theme: "hills" },
  { id: "ruth", name: "Ruth", testament: "OT", theme: "hills" },
  { id: "samuel", name: "Samuel", testament: "OT", theme: "temple" },
  { id: "david", name: "David", testament: "OT", theme: "hills" },
  { id: "solomon", name: "Solomon", testament: "OT", theme: "palace" },
  { id: "elijah", name: "Elijah and Elisha", testament: "OT", theme: "desert" },
  { id: "esther", name: "Esther", testament: "OT", theme: "palace" },
  { id: "daniel", name: "Daniel", testament: "OT", theme: "night" },
  { id: "jonah", name: "Jonah", testament: "OT", theme: "underwater" },
  { id: "birth-of-jesus", name: "Birth of Jesus", testament: "NT", theme: "stable" },
  { id: "miracles", name: "Miracles of Jesus", testament: "NT", theme: "lake" },
  { id: "teachings", name: "Teachings of Jesus", testament: "NT", theme: "hills" },
  { id: "parables", name: "Parables of Jesus", testament: "NT", theme: "garden" },
  { id: "disciples", name: "Jesus' Disciples", testament: "NT", theme: "lake" },
  { id: "holy-week", name: "Holy Week and Easter", testament: "NT", theme: "city" },
  { id: "resurrection", name: "Resurrection", testament: "NT", theme: "dawn" },
  { id: "early-church", name: "Early Church", testament: "NT", theme: "city" },
  { id: "paul", name: "Paul and His Journeys", testament: "NT", theme: "desert" },
  { id: "christian-living", name: "Christian Living", testament: "Both", theme: "garden" },
];
