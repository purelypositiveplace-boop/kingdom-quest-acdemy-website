/** Printable activity catalogue. Each id maps to a template in components/printables. */
export interface PrintableInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  ages: string;
  /** templates that take a lesson choose one */
  perLesson?: boolean;
}

export const PRINTABLE_CATEGORIES = [
  "Bible Story Sequencing", "Matching Worksheets", "Bible Mazes", "Word Searches", "Sunday School Worksheets",
  "Memory Verse Cards", "Bible Book Flashcards", "Reward Certificates", "Bible Coloring Pages", "Scripture Copywork",
  "Family Discussion Sheets", "Crossword Puzzles",
];

export const PRINTABLES: PrintableInfo[] = [
  { id: "creation-sequencing", title: "Creation Sequencing", category: "Bible Story Sequencing", description: "Cut out the pictures and glue them in order: the seven days of creation.", ages: "3–8" },
  { id: "noah-matching", title: "Noah's Ark Animal Matching", category: "Matching Worksheets", description: "Draw a line between each pair of animals going into the ark.", ages: "3–6" },
  { id: "david-maze", title: "David's Five Stones Maze", category: "Bible Mazes", description: "Help young David find his way to the stream to choose five smooth stones (1 Samuel 17:40).", ages: "4–10" },
  { id: "birth-wordsearch", title: "Birth of Jesus Word Search", category: "Word Searches", description: "Find words from the Christmas story in Luke 2 and Matthew 2.", ages: "6–12" },
  { id: "fruit-worksheet", title: "Fruit of the Spirit Worksheet", category: "Sunday School Worksheets", description: "Colour each fruit and write or draw a way to show it this week (Galatians 5:22-23).", ages: "5–12" },
  { id: "bible-crossword", title: "Bible Crossword", category: "Crossword Puzzles", description: "A real crossword with Bible clues, plus an answer key.", ages: "8–12" },
  { id: "verse-cards", title: "Memory Verse Cards", category: "Memory Verse Cards", description: "Cut-out cards with World English Bible verses.", ages: "5–12" },
  { id: "books-flashcards", title: "Books of the Bible Flashcards", category: "Bible Book Flashcards", description: "All 66 books with their section and order number.", ages: "7–12" },
  { id: "story-sequencing", title: "Story Sequencing (any lesson)", category: "Bible Story Sequencing", description: "Put the parts of any Bible story in order.", ages: "5–10", perLesson: true },
  { id: "verse-copywork", title: "Scripture Copywork", category: "Scripture Copywork", description: "Copy a memory verse neatly on handwriting lines.", ages: "6–12" },
  { id: "family-discussion", title: "Family Discussion Sheet (any lesson)", category: "Family Discussion Sheets", description: "Takeaways, questions and a prayer to talk about together.", ages: "All", perLesson: true },
  { id: "coloring-leo", title: "Colouring Page: Leo the Lion", category: "Bible Coloring Pages", description: "Colour Leo, our Kingdom Quest guide, with a verse to remember.", ages: "3–8" },
  { id: "coloring-grace", title: "Colouring Page: Grace the Dove", category: "Bible Coloring Pages", description: "Colour Grace the Dove and the Lord's Prayer garden.", ages: "3–8" },
  { id: "certificate", title: "Reward Certificate", category: "Reward Certificates", description: "A certificate celebrating your child's learning.", ages: "All" },
];

export const PRINTABLE_BY_ID = Object.fromEntries(PRINTABLES.map((p) => [p.id, p])) as Record<string, PrintableInfo>;
