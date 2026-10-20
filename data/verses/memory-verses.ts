import type { MemoryVerse } from "@/lib/curriculum/types";

/**
 * Memory verse references. Text is NEVER typed here — it is looked up from the public-domain
 * World English Bible by scripts/build-bible.ts. `meaning` is an original kid-friendly summary.
 */
export const VERSE_THEMES = [
  "Love", "Kindness", "Faith", "Courage", "Peace", "Joy", "Forgiveness", "Friendship",
  "Gratitude", "Hope", "Wisdom", "Prayer", "Helping Others", "God's Creation", "Jesus' Teachings",
] as const;

const all = ["disciples", "explorers", "champions"] as MemoryVerse["ages"];
const older = ["explorers", "champions"] as MemoryVerse["ages"];

export const MEMORY_VERSES: MemoryVerse[] = [
  { ref: "Genesis 1:1", themes: ["God's Creation"], ages: all, meaning: "God made everything." },
  { ref: "Psalm 23:1", themes: ["Faith", "Peace"], ages: all, meaning: "God takes care of me like a good shepherd." },
  { ref: "Psalm 56:3", themes: ["Courage", "Faith"], ages: all, meaning: "When I'm scared, I can trust God." },
  { ref: "Luke 2:11", themes: ["Joy", "Hope"], ages: all, meaning: "Jesus was born to be our Saviour." },
  { ref: "Matthew 19:14", themes: ["Jesus' Teachings", "Love"], ages: all, meaning: "Jesus loves children and welcomes them." },
  { ref: "Luke 6:31", themes: ["Kindness", "Helping Others"], ages: all, meaning: "Treat others the way you want to be treated." },
  { ref: "John 13:34", themes: ["Love", "Jesus' Teachings"], ages: all, meaning: "Jesus wants us to love each other like he loves us." },
  { ref: "Psalm 118:24", themes: ["Joy", "Gratitude"], ages: all, meaning: "Every day is a gift from God to enjoy." },
  { ref: "Psalm 136:1", themes: ["Gratitude", "Love"], ages: all, meaning: "Thank God, because his love lasts forever." },
  { ref: "Proverbs 17:17", themes: ["Friendship", "Love"], ages: all, meaning: "Real friends love you all the time." },
  { ref: "Ephesians 4:32", themes: ["Kindness", "Forgiveness"], ages: all, meaning: "Be kind and forgive, because God forgave you." },
  { ref: "Psalm 139:14", themes: ["God's Creation", "Joy"], ages: all, meaning: "God made me in a wonderful way." },
  { ref: "1 Peter 5:7", themes: ["Peace", "Prayer"], ages: all, meaning: "Give your worries to God, because he cares for you." },
  { ref: "Psalm 46:1", themes: ["Courage", "Hope"], ages: all, meaning: "God is our safe place and our help." },
  { ref: "Exodus 14:14", themes: ["Courage", "Peace"], ages: all, meaning: "God will fight for us. We can be calm." },
  { ref: "Genesis 9:13", themes: ["Hope", "God's Creation"], ages: all, meaning: "The rainbow is a sign that God keeps his promises." },
  { ref: "John 3:16", themes: ["Love", "Hope", "Jesus' Teachings"], ages: older, meaning: "God loves the world so much that he gave his Son, Jesus." },
  { ref: "Proverbs 3:5", themes: ["Faith", "Wisdom"], ages: older, meaning: "Trust God with your whole heart, not just your own ideas." },
  { ref: "Joshua 1:9", themes: ["Courage"], ages: older, meaning: "Be brave! God is with you everywhere you go." },
  { ref: "Deuteronomy 31:6", themes: ["Courage", "Faith"], ages: older, meaning: "Be strong; God will never leave you." },
  { ref: "Philippians 4:6", themes: ["Prayer", "Peace"], ages: older, meaning: "Instead of worrying, pray and say thank you." },
  { ref: "Philippians 4:19", themes: ["Faith", "Gratitude"], ages: older, meaning: "God gives us what we really need." },
  { ref: "1 John 1:9", themes: ["Forgiveness"], ages: older, meaning: "When we say sorry to God, he forgives us." },
  { ref: "1 John 3:1", themes: ["Love", "Joy"], ages: older, meaning: "God loves us so much that he calls us his children." },
  { ref: "1 Corinthians 13:4", themes: ["Love", "Kindness"], ages: older, meaning: "Love is patient and kind, not jealous or proud." },
  { ref: "Matthew 4:19", themes: ["Jesus' Teachings", "Helping Others"], ages: older, meaning: "Jesus invites us to follow him and help others know him." },
  { ref: "Matthew 3:17", themes: ["Love", "Jesus' Teachings"], ages: older, meaning: "God loves Jesus, his Son." },
  { ref: "Luke 19:10", themes: ["Hope", "Jesus' Teachings"], ages: older, meaning: "Jesus came to find and rescue people who are lost." },
  { ref: "Psalm 145:8", themes: ["Forgiveness", "Love"], ages: older, meaning: "God is kind, patient and full of love." },
  { ref: "Exodus 4:12", themes: ["Courage", "Faith"], ages: older, meaning: "God helps us do what he asks us to do." },
  { ref: "Genesis 50:20", themes: ["Hope", "Faith", "Forgiveness"], ages: older, meaning: "God can bring good out of bad things." },
  { ref: "1 Samuel 3:10", themes: ["Prayer", "Wisdom"], ages: older, meaning: "We can be ready to listen to God." },
  { ref: "John 14:15", themes: ["Love", "Jesus' Teachings"], ages: older, meaning: "If we love Jesus, we will do what he says." },
  { ref: "Acts 1:8", themes: ["Courage", "Helping Others"], ages: older, meaning: "The Holy Spirit gives power to tell others about Jesus." },
  { ref: "2 Corinthians 5:17", themes: ["Hope", "Forgiveness"], ages: older, meaning: "Jesus gives us a brand-new start." },
  { ref: "Galatians 5:22-23", themes: ["Kindness", "Love", "Joy", "Peace"], ages: older, meaning: "The Holy Spirit grows good fruit in our lives, like love, joy and peace." },
  { ref: "1 Thessalonians 5:18", themes: ["Gratitude", "Prayer"], ages: older, meaning: "Thank God in every situation." },
  { ref: "Psalm 119:105", themes: ["Wisdom", "Faith"], ages: older, meaning: "God's Word shows us the way, like a light." },
  { ref: "Colossians 3:13", themes: ["Forgiveness", "Friendship"], ages: older, meaning: "Forgive each other, just as the Lord forgave you." },
  { ref: "Micah 6:8", themes: ["Kindness", "Wisdom", "Helping Others"], ages: older, meaning: "God wants us to be fair, love kindness, and walk humbly with him." },
];

/** Longer texts used elsewhere on the site (e.g. the Lord's Prayer). */
export const OTHER_SCRIPTURE_REFS = ["Matthew 6:9-13", "Mark 4:39", "Ephesians 6:13", "Matthew 22:37-39", "Genesis 1:31"];
