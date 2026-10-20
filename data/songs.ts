/**
 * Original Kingdom Quest Academy songs (words and tunes written for this site, free to use).
 * Until real recordings exist, the music player plays each tune with a gentle built-in
 * synthesizer and highlights the line being played. Drop an mp3 at `audio` to use a recording.
 */
export type SongCategory =
  | "Bible Songs" | "Jesus Songs" | "Praise Songs" | "Worship Songs for Children"
  | "Memory Verse Songs" | "Bedtime Songs" | "Thanksgiving Songs" | "Holiday Songs";

export const SONG_CATEGORIES: SongCategory[] = [
  "Bible Songs", "Jesus Songs", "Praise Songs", "Worship Songs for Children",
  "Memory Verse Songs", "Bedtime Songs", "Thanksgiving Songs", "Holiday Songs",
];

/** A line of lyrics with the notes sung on it: [note, beats]. "-" is a rest. */
export interface SongLine {
  words: string;
  notes: [string, number][];
}

export interface Song {
  id: string;
  title: string;
  category: SongCategory;
  bpm: number;
  color: string;
  about: string;
  ref?: string;
  audio?: string;
  lines: SongLine[];
}

export const SONGS: Song[] = [
  {
    id: "kingdom-quest", title: "On a Kingdom Quest", category: "Praise Songs", bpm: 116, color: "#f6b73c",
    about: "Our theme song! Leo's favourite.",
    lines: [
      { words: "Pack your bag and lace your shoes,", notes: [["C4", 1], ["E4", 1], ["G4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 2]] },
      { words: "we've got the very best news!", notes: [["F4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["E4", 1], ["C4", 1], ["-", 2]] },
      { words: "God is good and God is near,", notes: [["C4", 1], ["E4", 1], ["G4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 2]] },
      { words: "on a Kingdom Quest, no fear!", notes: [["F4", 1], ["E4", 1], ["D4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "seven-days", title: "Seven Days", category: "Bible Songs", bpm: 104, color: "#34c38f", ref: "Genesis 1:1–2:3",
    about: "Count the days of creation!",
    lines: [
      { words: "One: the light! Two: the sky!", notes: [["G4", 1], ["E4", 1], ["C4", 2], ["G4", 1], ["E4", 1], ["C4", 2]] },
      { words: "Three: the land and trees grow high!", notes: [["D4", 1], ["E4", 1], ["F4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 2]] },
      { words: "Four: the sun, the moon, the stars!", notes: [["G4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 2]] },
      { words: "Five: the fish and birds so far!", notes: [["E4", 1], ["F4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["C4", 1], ["D4", 2]] },
      { words: "Six: the animals, and me and you!", notes: [["G4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["F4", 1], ["G4", 1]] },
      { words: "Seven: God rests. It's very good, it's true!", notes: [["C5", 2], ["G4", 1], ["E4", 1], ["F4", 1], ["D4", 1], ["E4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "rainbow-promise", title: "Rainbow Promise", category: "Memory Verse Songs", bpm: 96, color: "#4aa8ff", ref: "Genesis 9:13",
    about: "A song about God's promise to Noah.",
    lines: [
      { words: "Red and orange, yellow too,", notes: [["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["C4", 2]] },
      { words: "green and blue and purple hue,", notes: [["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["E4", 2]] },
      { words: "when I see the rainbow shine,", notes: [["F4", 1], ["F4", 1], ["A4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 2]] },
      { words: "God keeps promises every time!", notes: [["E4", 1], ["G4", 1], ["C5", 1], ["B4", 1], ["G4", 1], ["D4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "thank-you-god", title: "Thank You, God", category: "Thanksgiving Songs", bpm: 100, color: "#ff8a5c",
    about: "A short song to sing before meals.",
    lines: [
      { words: "Thank you, God, for food to eat,", notes: [["C4", 1], ["D4", 1], ["E4", 1], ["C4", 1], ["E4", 1], ["F4", 1], ["G4", 2]] },
      { words: "thank you for my friends so sweet,", notes: [["G4", 1], ["A4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["C4", 2]] },
      { words: "thank you for this happy day,", notes: [["C4", 1], ["D4", 1], ["E4", 1], ["C4", 1], ["E4", 1], ["F4", 1], ["G4", 2]] },
      { words: "thank you, God, I love to say!", notes: [["A4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["E4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "jesus-loves-me-too", title: "Jesus Welcomes Me", category: "Jesus Songs", bpm: 92, color: "#ffd23f", ref: "Mark 10:14",
    about: "Inspired by Jesus welcoming the children.",
    lines: [
      { words: "Jesus said, 'Let the children come,'", notes: [["E4", 1], ["E4", 1], ["G4", 1], ["G4", 1], ["A4", 1], ["A4", 1], ["G4", 2]] },
      { words: "every daughter, every son,", notes: [["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1], ["D4", 1], ["D4", 1], ["C4", 2]] },
      { words: "he has time and room for me,", notes: [["G4", 1], ["G4", 1], ["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1], ["D4", 2]] },
      { words: "Jesus welcomes me, you see!", notes: [["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "goodnight-god", title: "Goodnight, God", category: "Bedtime Songs", bpm: 72, color: "#6c7bff",
    about: "A gentle lullaby for bedtime.",
    lines: [
      { words: "Stars are twinkling, moon is bright,", notes: [["G4", 2], ["E4", 1], ["F4", 1], ["G4", 2], ["E4", 2]] },
      { words: "God is with me through the night,", notes: [["F4", 2], ["D4", 1], ["E4", 1], ["F4", 2], ["D4", 2]] },
      { words: "close my eyes and say a prayer,", notes: [["E4", 2], ["C4", 1], ["D4", 1], ["E4", 2], ["G4", 2]] },
      { words: "goodnight, God, I know you're there.", notes: [["F4", 1], ["E4", 1], ["D4", 2], ["D4", 1], ["E4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "star-of-bethlehem", title: "Follow the Star", category: "Holiday Songs", bpm: 108, color: "#b58cff", ref: "Matthew 2:9-10",
    about: "A Christmas song about the wise men.",
    lines: [
      { words: "Follow, follow, follow the star,", notes: [["C4", 1], ["E4", 1], ["G4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["G4", 2]] },
      { words: "wise men travelled from so far,", notes: [["F4", 1], ["A4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["C4", 2]] },
      { words: "to the house where Jesus lay,", notes: [["C4", 1], ["E4", 1], ["G4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["G4", 2]] },
      { words: "bringing gifts on Christmas day!", notes: [["A4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["E4", 1], ["C4", 2]] },
    ],
  },
  {
    id: "be-strong", title: "Be Strong and Brave", category: "Worship Songs for Children", bpm: 112, color: "#47b26b", ref: "Joshua 1:9",
    about: "Inspired by God's words to Joshua.",
    lines: [
      { words: "Be strong, be brave, don't be afraid,", notes: [["G4", 1], ["G4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 2]] },
      { words: "God is with me every day,", notes: [["F4", 1], ["F4", 1], ["D4", 1], ["F4", 1], ["G4", 1], ["F4", 1], ["D4", 2]] },
      { words: "where I go, he'll be there too,", notes: [["E4", 1], ["G4", 1], ["C5", 1], ["B4", 1], ["A4", 1], ["G4", 1], ["E4", 2]] },
      { words: "God is faithful, God is true!", notes: [["F4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["E4", 1], ["C4", 2]] },
    ],
  },
];
