/**
 * Content schemas for the curriculum. Every content item has a stable `id` that progress rows
 * reference, so ids must never be renamed once published (add a new item instead).
 */

export type AgeLevel = "disciples" | "explorers" | "champions";
export type Testament = "OT" | "NT";
export type ReviewStatus = "draft" | "needs-review" | "approved";

/** Visual themes the SVG scene renderer knows how to draw (used when no illustration exists). */
export type SceneTheme =
  | "void"
  | "dawn"
  | "sky"
  | "sea"
  | "garden"
  | "night"
  | "rain"
  | "rainbow"
  | "desert"
  | "river"
  | "village"
  | "palace"
  | "hills"
  | "city"
  | "lake"
  | "storm"
  | "temple"
  | "underwater"
  | "stable";

/** Small drawable things layered on a scene. */
export type SceneProp =
  | "sun" | "moon" | "stars" | "bigstar" | "clouds" | "trees" | "flowers" | "fish" | "birds"
  | "animals" | "people" | "ark" | "dove" | "rainbow" | "manger" | "angel" | "sheep" | "boat"
  | "basket" | "bush" | "tablets" | "walls" | "crown" | "lion" | "whale" | "bread" | "cross"
  | "tomb" | "flame" | "coat" | "well" | "palm" | "stone" | "heart" | "light" | "water" | "camels";

export interface QuizQuestion {
  id: string;
  q: string;
  choices: string[];
  /** index into choices */
  answer: number;
  /** shown after answering, always kind */
  explain: string;
  /** 1 = Little Disciples friendly, 2 = Kingdom Explorers, 3 = Faith Champions */
  difficulty: 1 | 2 | 3;
}

export interface StoryScene {
  id: string;
  title: string;
  /** narration text: an original retelling, not Scripture */
  text: string;
  /** shorter version for ages 3–5; falls back to text */
  short?: string;
  theme: SceneTheme;
  props?: SceneProp[];
  /** optional illustration path under /public; SVG fallback is used if missing */
  image?: string;
  alt: string;
  /** a tappable object that reveals a fact */
  tap?: { label: string; prop: SceneProp; reveal: string };
  /** optional check-in question during the story */
  question?: QuizQuestion;
  /** clearly-labelled illustrative dialogue (never presented as Scripture) */
  illustrative?: string;
}

export interface LessonActivity {
  kind: "game" | "printable" | "do";
  gameId?: string;
  printableId?: string;
  text: string;
}

export interface Lesson {
  id: string;
  /** bump when content changes meaningfully; progress stores the version it was earned on */
  version: number;
  order: number;
  title: string;
  /** passages the lesson is based on */
  refs: string[];
  testament: Testament;
  ages: AgeLevel[];
  category: string;
  world: string;
  topics: string[];
  objectives: string[];
  summary: string;
  narrative: string[];
  explanation: string;
  characters: string[];
  vocabulary: { word: string; meaning: string }[];
  takeaways: [string, string, string];
  application: string;
  memoryVerse: string;
  scenes: StoryScene[];
  quiz: QuizQuestion[];
  activity: LessonActivity;
  reflection: string;
  prayer: string;
  minutes: Record<AgeLevel, number>;
  art: { theme: SceneTheme; image?: string; alt: string };
  reward: { stars: number; badge?: string };
  parentPrompts: string[];
  /** note for grown-ups on serious topics */
  sensitiveNote?: string;
  review: ReviewStatus;
  /** fully-built interactive storybook (more scenes, richer interactions) */
  featured?: boolean;
}

export interface MemoryVerse {
  ref: string;
  themes: string[];
  ages: AgeLevel[];
  /** original kid-friendly meaning (not Scripture) */
  meaning: string;
}

export interface BibleCharacter {
  id: string;
  name: string;
  role: string;
  testament: Testament;
  passages: string[];
  context: string;
  events: string[];
  lessons: string[];
  relatedLessons: string[];
  kid: string;
  quiz: QuizQuestion[];
  color: string;
  /** what the Bible says about appearance, if anything; art is always an interpretation */
  artNote?: string;
}

export interface TriviaQuestion extends QuizQuestion {
  level: AgeLevel;
  category: "Old Testament" | "Jesus" | "Early Church" | "People" | "Bible Books" | "Places";
  hint?: string;
  ref?: string;
}

export interface ValueLesson {
  id: string;
  title: string;
  teaching: string;
  verse: string;
  scenario: string;
  choices: { text: string; good: boolean; feedback: string }[];
  explain: string;
  practice: string;
  reflection: string;
  safetyNote?: string;
}

export interface World {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  /** position on the adventure map, percent */
  x: number;
  y: number;
  color: string;
  theme: SceneTheme;
  guide: MascotId;
  badge: string;
  games: string[];
  facts: string[];
}

export type MascotId = "sunny" | "oliver" | "grace" | "finn" | "leo";
