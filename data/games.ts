import type { AgeLevel, MascotId } from "@/lib/curriculum/types";

export interface GameInfo {
  id: string;
  title: string;
  blurb: string;
  howTo: string[];
  learn: string;
  host: MascotId;
  ages: AgeLevel[];
  skills: string[];
  minutes: number;
  color: string;
  icon: "ark" | "cards" | "lion" | "fish" | "sun" | "tablets" | "leaf" | "book" | "question" | "grid" | "cross" | "puzzle" | "heart" | "map" | "words";
  world?: string;
}

const ALL: AgeLevel[] = ["disciples", "explorers", "champions"];
const OLDER: AgeLevel[] = ["explorers", "champions"];

/** Every playable game. All are free, ad-free, and have no timers you can't turn off. */
export const GAMES: GameInfo[] = [
  { id: "ark-match", title: "Noah's Ark Animal Match", blurb: "Flip cards to find the animal pairs for the ark!", howTo: ["Tap a card to flip it.", "Find two animals that match.", "Match all the pairs to fill the ark."], learn: "Animals came to the ark in pairs (Genesis 7:9).", host: "finn", ages: ALL, skills: ["Memory", "Animals"], minutes: 4, color: "#4aa8ff", icon: "ark", world: "noahs-harbor" },
  { id: "memory-match", title: "Bible Memory Match", blurb: "Match Bible people with their objects and stories.", howTo: ["Flip two cards.", "Match each person with the thing from their story.", "Read the fact after each match."], learn: "Remember who did what in the Bible.", host: "oliver", ages: ALL, skills: ["Memory", "Bible people"], minutes: 5, color: "#9b6dff", icon: "cards", world: "galilee" },
  { id: "creation-sort", title: "Creation Seven-Day Sort", blurb: "Put the days of creation in order.", howTo: ["Tap a card, then tap the day it belongs to.", "Or drag cards into place.", "Fill all seven days."], learn: "Genesis 1–2 tells what God made on each day.", host: "sunny", ages: ALL, skills: ["Sequencing", "Creation"], minutes: 4, color: "#34c38f", icon: "sun", world: "creation-garden" },
  { id: "commandments-match", title: "Ten Commandments Match", blurb: "Match each commandment with an everyday example.", howTo: ["Tap a commandment.", "Tap the example that fits it.", "Match them all."], learn: "God's commandments show us how to love God and others.", host: "oliver", ages: OLDER, skills: ["Ethics", "Old Testament"], minutes: 6, color: "#f5b942", icon: "tablets", world: "egypt" },
  { id: "fruit-garden", title: "Fruit of the Spirit Garden", blurb: "Grow a garden by spotting the fruit of the Spirit in action.", howTo: ["Read what someone did.", "Choose which fruit of the Spirit it shows.", "Each right answer grows a plant!"], learn: "Galatians 5:22-23 lists the fruit of the Spirit.", host: "grace", ages: ALL, skills: ["Character", "New Testament"], minutes: 6, color: "#7cc576", icon: "leaf", world: "kindness-garden" },
  { id: "books-order", title: "Bible Books Order Challenge", blurb: "Put the books of the Bible in order.", howTo: ["Pick a mode.", "Tap the books in the right order.", "Hints show the next book if you need one."], learn: "The Protestant Bible has 66 books in a set order.", host: "oliver", ages: OLDER, skills: ["Bible books"], minutes: 8, color: "#8c6bff", icon: "book", world: "egypt" },
  { id: "guess-who", title: "Bible Character Guess Who", blurb: "Read the clues and guess the Bible person.", howTo: ["Read the first clue.", "Guess, or ask for another clue.", "Fewer clues means more stars!"], learn: "Get to know the people of the Bible.", host: "leo", ages: ALL, skills: ["Bible people"], minutes: 6, color: "#ff8a5c", icon: "question", world: "davids-kingdom" },
  { id: "word-search", title: "Bible Word Search", blurb: "Find hidden Bible words in the grid.", howTo: ["Tap the first letter of a word.", "Then tap its last letter.", "Find every word in the list."], learn: "Learn Bible vocabulary.", host: "finn", ages: ALL, skills: ["Reading", "Vocabulary"], minutes: 7, color: "#2ec4c4", icon: "grid", world: "bethlehem" },
  { id: "crossword", title: "Bible Crossword", blurb: "Solve real crossword puzzles with Bible clues.", howTo: ["Tap a square.", "Type your answer.", "Check when you're done."], learn: "Practise Bible facts and spelling.", host: "oliver", ages: OLDER, skills: ["Spelling", "Bible facts"], minutes: 10, color: "#6c7bff", icon: "words" },
  { id: "trivia", title: "Bible Trivia Adventure", blurb: "Answer questions, learn facts, and earn stars.", howTo: ["Pick a category.", "Answer the questions.", "Turn the timer on for a challenge, or off to relax."], learn: "30 questions for each age level.", host: "leo", ages: ALL, skills: ["Bible facts"], minutes: 8, color: "#ffd23f", icon: "question", world: "davids-kingdom" },
  { id: "verse-builder", title: "Bible Verse Builder", blurb: "Put the words of a verse back in order.", howTo: ["Tap the words in the right order.", "Tap a placed word to send it back.", "Finish the verse!"], learn: "Memorise Scripture from the World English Bible.", host: "grace", ages: OLDER, skills: ["Memory verses"], minutes: 5, color: "#b58cff", icon: "words", world: "bethlehem" },
  { id: "parable-puzzle", title: "Parable Puzzle", blurb: "Put Jesus' stories in the right order.", howTo: ["Tap the events in order.", "Then read what the parable teaches."], learn: "Parables are stories Jesus told to teach about God.", host: "oliver", ages: ALL, skills: ["Sequencing", "Parables"], minutes: 5, color: "#3fa34d", icon: "puzzle", world: "parable-forest" },
  { id: "kindness-quest", title: "Good Samaritan Kindness Quest", blurb: "Choose kind, helpful actions on your quest.", howTo: ["Read each situation.", "Choose the most loving action.", "Help everyone along the road!"], learn: "Jesus said to love our neighbour (Luke 10:27).", host: "grace", ages: ALL, skills: ["Kindness", "Choices"], minutes: 5, color: "#ff7eb6", icon: "heart", world: "kindness-garden" },
  { id: "jonah-ocean", title: "Jonah's Ocean Adventure", blurb: "Swim with Finn, collect stars and meet sea creatures.", howTo: ["Use arrow keys, or tap above/below Finn to swim.", "Collect stars and swim around the friendly jellyfish.", "Answer the question at each treasure chest."], learn: "Jonah's story in order, and God's mercy.", host: "finn", ages: ALL, skills: ["Coordination", "Story order"], minutes: 6, color: "#13a5c4", icon: "fish", world: "noahs-harbor" },
  { id: "map-hunt", title: "Bible Map Treasure Hunt", blurb: "Find Bible places on the map.", howTo: ["Read the clue.", "Tap the right place on the map.", "Find them all!"], learn: "Where Bible stories happened.", host: "leo", ages: OLDER, skills: ["Geography"], minutes: 6, color: "#e0a045", icon: "map", world: "early-church" },
  { id: "armor-of-god", title: "Armour of God Dress-Up", blurb: "Help Leo put on the armour of God from Ephesians 6.", howTo: ["Tap a piece of armour.", "Tap where it goes on Leo.", "Learn what each piece means."], learn: "Ephesians 6 uses armour as a picture of God's strength. It's not about fighting people.", host: "leo", ages: ALL, skills: ["New Testament", "Symbols"], minutes: 5, color: "#3d8bfd", icon: "cross", world: "early-church" },
];

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<string, GameInfo>;
