import type { World } from "@/lib/curriculum/types";

/**
 * Kingdom Quest World — the lands on the adventure map. Lessons join a land through their
 * `world` field, so adding a lesson automatically adds it to its land.
 */
export const WORLDS: World[] = [
  {
    id: "creation-garden",
    name: "Creation Garden",
    tagline: "Where it all began",
    intro: "Welcome to Creation Garden! Discover how God made the light, the sky, the seas, the animals and you, and learn how to care for his world.",
    x: 16, y: 28, color: "#34c38f", theme: "garden", guide: "sunny", badge: "creation-explorer",
    games: ["creation-sort", "word-search"],
    facts: ["The Bible's first sentence is 'In the beginning, God created the heavens and the earth.'", "Genesis says God called creation 'very good' after making people.", "Adam's first job was naming the animals (Genesis 2:19-20)."],
  },
  {
    id: "noahs-harbor",
    name: "Noah's Ark Harbor",
    tagline: "Promises and rainbows",
    intro: "Ahoy! At Noah's Ark Harbor you'll meet Noah, the animals, Abraham under the stars, and Jonah and the great fish, and learn that God keeps his promises.",
    x: 10, y: 64, color: "#4aa8ff", theme: "sea", guide: "finn", badge: "noahs-helper",
    games: ["ark-match", "jonah-ocean"],
    facts: ["The ark was about 450 feet (137 metres) long.", "A dove brought Noah an olive leaf.", "The rainbow is the sign of God's covenant with every living creature."],
  },
  {
    id: "egypt",
    name: "Egypt Explorer Land",
    tagline: "From Joseph to the Red Sea",
    intro: "Explore Egypt along the great Nile River! Follow Joseph's journey, baby Moses in his basket, the burning bush, the Red Sea and the Ten Commandments.",
    x: 30, y: 82, color: "#f5b942", theme: "desert", guide: "oliver", badge: "moses-explorer",
    games: ["commandments-match", "books-order"],
    facts: ["The Nile is one of the longest rivers in the world.", "'Pharaoh' was a title for Egypt's king, not a name.", "Moses' sister watched over his basket in the reeds."],
  },
  {
    id: "davids-kingdom",
    name: "David's Kingdom",
    tagline: "Courage, friendship and kings",
    intro: "Enter David's Kingdom, where brave hearts trust God: Joshua, Ruth, Samuel, David, Esther and Daniel!",
    x: 33, y: 13, color: "#ff8a5c", theme: "palace", guide: "leo", badge: "courageous-like-david",
    games: ["guess-who", "trivia"],
    facts: ["David wrote many of the Psalms.", "Ruth was King David's great-grandmother.", "Daniel prayed three times a day."],
  },
  {
    id: "bethlehem",
    name: "Bethlehem Village",
    tagline: "A Saviour is born",
    intro: "Shh — a baby is sleeping! Visit Bethlehem Village to hear the angels' good news and follow the star with the wise men.",
    x: 68, y: 50, color: "#b58cff", theme: "stable", guide: "grace", badge: "christmas-star",
    games: ["word-search", "verse-builder"],
    facts: ["Bethlehem means 'house of bread.'", "Bethlehem was King David's hometown.", "The Bible doesn't say how many wise men came — only that they brought three kinds of gifts."],
  },
  {
    id: "galilee",
    name: "Galilee Lake",
    tagline: "Miracles by the water",
    intro: "Sail across Galilee Lake, where Jesus called fishermen, calmed a storm and fed thousands with one boy's lunch.",
    x: 82, y: 22, color: "#2ec4c4", theme: "lake", guide: "finn", badge: "galilee-sailor",
    games: ["memory-match", "jonah-ocean"],
    facts: ["The Sea of Galilee is really a freshwater lake.", "Peter, Andrew, James and John were fishermen.", "Jesus did many miracles around this lake."],
  },
  {
    id: "jerusalem",
    name: "Jerusalem Journey",
    tagline: "The greatest news",
    intro: "Walk the streets of Jerusalem and learn about the most important week in Jesus' life, and the joy of Easter morning.",
    x: 80, y: 78, color: "#ffd23f", theme: "city", guide: "grace", badge: "easter-joy",
    games: ["trivia", "verse-builder"],
    facts: ["Jerusalem is built on hills.", "Jesus rode into Jerusalem on a donkey (Matthew 21).", "The empty tomb was found on the first day of the week."],
  },
  {
    id: "parable-forest",
    name: "Parable Forest",
    tagline: "Stories with a secret",
    intro: "Every path in Parable Forest has a story Jesus told. Can you discover what each one teaches?",
    x: 52, y: 74, color: "#3fa34d", theme: "garden", guide: "oliver", badge: "jesus-teachings-explorer",
    games: ["parable-puzzle", "kindness-quest"],
    facts: ["A parable is a story that teaches about God.", "Jesus told stories about seeds, sheep, coins, and sons.", "Many parables have a surprise ending!"],
  },
  {
    id: "kindness-garden",
    name: "Kindness Garden",
    tagline: "Living with love",
    intro: "Kindness grows here! Practise loving your neighbour, sharing, forgiving and growing the fruit of the Spirit.",
    x: 26, y: 48, color: "#ff7eb6", theme: "garden", guide: "grace", badge: "kindness-champion",
    games: ["fruit-garden", "kindness-quest"],
    facts: ["Jesus said the greatest commandments are to love God and love your neighbour.", "Galatians 5 lists nine 'fruits of the Spirit.'", "Kindness is one of the fruits of the Spirit."],
  },
  {
    id: "early-church",
    name: "Early Church City",
    tagline: "The good news spreads",
    intro: "See how the Holy Spirit came, the church began, and the good news about Jesus travelled all over the world.",
    x: 90, y: 50, color: "#6c7bff", theme: "city", guide: "leo", badge: "early-church-explorer",
    games: ["map-hunt", "trivia"],
    facts: ["About 3,000 people believed on the day of Pentecost.", "Paul travelled thousands of miles sharing the good news.", "Many New Testament books are letters to churches."],
  },
];

export const WORLD_BY_ID = Object.fromEntries(WORLDS.map((w) => [w.id, w])) as Record<string, World>;

/** Lands with the richest starter content; the map highlights these as "Start here". */
export const STARTER_WORLDS = ["creation-garden", "noahs-harbor", "egypt"];
