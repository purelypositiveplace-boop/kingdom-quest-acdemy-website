import type { MascotId } from "@/lib/curriculum/types";

/**
 * Kingdom Quest Academy's original guide characters. They are fictional helpers, not people
 * or creatures from the Bible, and the site says so wherever they are introduced.
 */
export interface Mascot {
  id: MascotId;
  name: string;
  species: string;
  description: string;
  personality: string;
  role: string;
  colors: { body: string; accent: string; detail: string };
  expressions: ("happy" | "excited" | "thinking" | "calm" | "proud")[];
  animations: ("idle" | "wave" | "bounce" | "cheer")[];
  lines: {
    hello: string[];
    correct: string[];
    tryAgain: string[];
    finished: string[];
  };
  main?: boolean;
}

export const MASCOTS: Record<MascotId, Mascot> = {
  leo: {
    id: "leo",
    main: true,
    name: "Leo the Lion",
    species: "Golden lion cub",
    description: "A fluffy golden lion cub with big bright eyes, a small soft mane and a huge welcoming smile.",
    personality: "Brave, warm, adventurous and encouraging.",
    role: "Main guide of Kingdom Quest Academy. Leads adventures and helps with courage and leadership.",
    colors: { body: "#f6b73c", accent: "#d9822b", detail: "#7a4a1d" },
    expressions: ["happy", "excited", "thinking", "proud"],
    animations: ["idle", "wave", "bounce", "cheer"],
    lines: {
      hello: ["Hi, friend! I'm Leo. Ready for a Kingdom Quest?", "Welcome back, adventurer! Let's discover something amazing today."],
      correct: ["Roar-some! You got it!", "Great job, brave learner!", "Yes! You're a real Faith Champion in the making!"],
      tryAgain: ["Good try! Let's look again together.", "That's okay. Every explorer learns by trying!"],
      finished: ["You did it! I'm so proud of you!", "Quest complete! Let's celebrate!"],
    },
  },
  sunny: {
    id: "sunny",
    name: "Sunny the Lamb",
    species: "Lamb",
    description: "A fluffy white lamb with soft ears, big gentle eyes and a tiny golden bell.",
    personality: "Kind, patient and gentle.",
    role: "Helps Little Disciples (ages 3–5) with first Bible stories.",
    colors: { body: "#fffaf0", accent: "#ffd166", detail: "#6b5b4b" },
    expressions: ["happy", "calm", "excited"],
    animations: ["idle", "wave", "bounce"],
    lines: {
      hello: ["Hello, little friend! I'm Sunny. Baa-hello!"],
      correct: ["Yay! You did it!", "Baa-rilliant!"],
      tryAgain: ["Let's try again. You can do it!"],
      finished: ["Hooray! God loves you so much!"],
    },
  },
  oliver: {
    id: "oliver",
    name: "Oliver the Owl",
    species: "Owl",
    description: "A round brown-and-cream owl with big round glasses and fluffy ear tufts.",
    personality: "Wise, curious and playful.",
    role: "Shares Bible facts, history and Scripture knowledge.",
    colors: { body: "#a7774f", accent: "#f3e1c3", detail: "#4a3020" },
    expressions: ["thinking", "happy", "excited"],
    animations: ["idle", "wave", "bounce"],
    lines: {
      hello: ["Hoo-hoo! I'm Oliver. Did you know the Bible has 66 books?"],
      correct: ["Hoo-ray! Correct!", "Wise answer!"],
      tryAgain: ["Hmm, let's think about it again."],
      finished: ["You're becoming a Bible expert!"],
    },
  },
  grace: {
    id: "grace",
    name: "Grace the Dove",
    species: "Dove",
    description: "A soft white dove with light blue wing tips and a calm, gentle smile.",
    personality: "Calm, gentle and reassuring.",
    role: "Guides the Prayer Garden and lessons on kindness and peace.",
    colors: { body: "#ffffff", accent: "#9fd3ff", detail: "#3b6ea5" },
    expressions: ["calm", "happy"],
    animations: ["idle", "wave"],
    lines: {
      hello: ["Hello, dear one. I'm Grace. Let's be peaceful together."],
      correct: ["Lovely!", "That's wonderful."],
      tryAgain: ["It's okay. Take your time."],
      finished: ["Peace be with you, friend."],
    },
  },
  finn: {
    id: "finn",
    name: "Finn the Fish",
    species: "Fish",
    description: "A cheerful turquoise fish with a wavy fin and a big silly grin.",
    personality: "Energetic and silly.",
    role: "Host of games, exploration and memory challenges.",
    colors: { body: "#2ec4c4", accent: "#ffd23f", detail: "#13626b" },
    expressions: ["excited", "happy"],
    animations: ["idle", "bounce", "cheer"],
    lines: {
      hello: ["Blub blub! I'm Finn! Let's play!"],
      correct: ["Fin-tastic!", "Splash-tacular!"],
      tryAgain: ["Whoopsie! Swim back and try again!"],
      finished: ["You made a big splash! Woohoo!"],
    },
  },
};

export const MASCOT_NOTE = "Leo, Sunny, Oliver, Grace and Finn are made-up Kingdom Quest Academy guides. They are not in the Bible.";

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
