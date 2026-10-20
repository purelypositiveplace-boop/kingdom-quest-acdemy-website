/**
 * Key events in narrative order. We avoid exact dates; where scholars broadly agree we show a
 * rough "about" label, and earlier events show none because their dates are debated.
 */
export type TimelineFilter = "Old Testament" | "Life of Jesus" | "Early Church";

export interface TimelineEvent {
  id: string;
  title: string;
  era: TimelineFilter;
  when?: string;
  ref: string;
  summary: string;
  people: string[];
  lesson?: string;
}

export const DATE_NOTE =
  "The Bible tells events in order but doesn't usually give calendar dates. Dates for early events are debated, so we don't show any. Later dates are rough estimates.";

export const TIMELINE: TimelineEvent[] = [
  { id: "creation", title: "God creates the world", era: "Old Testament", ref: "Genesis 1–2", summary: "God makes the heavens, the earth, and everything in them, and calls it very good.", people: ["adam", "eve"], lesson: "creation" },
  { id: "eden", title: "Sin enters the world", era: "Old Testament", ref: "Genesis 3", summary: "Adam and Eve disobey God and must leave the garden, but God still cares for them.", people: ["adam", "eve"], lesson: "adam-and-eve" },
  { id: "flood", title: "Noah and the flood", era: "Old Testament", ref: "Genesis 6–9", summary: "God keeps Noah, his family and the animals safe, and gives the rainbow promise.", people: ["noah"], lesson: "noah" },
  { id: "abraham", title: "God calls Abraham", era: "Old Testament", ref: "Genesis 12", summary: "God promises Abraham a land, a family as many as the stars, and a blessing for all nations.", people: ["abraham", "sarah"], lesson: "abraham-promise" },
  { id: "joseph", title: "Joseph in Egypt", era: "Old Testament", ref: "Genesis 37–50", summary: "Joseph is sold by his brothers, rises to power in Egypt and forgives his family.", people: ["joseph-ot"], lesson: "joseph-egypt" },
  { id: "exodus", title: "The Exodus from Egypt", era: "Old Testament", ref: "Exodus 1–15", summary: "God rescues Israel from slavery through Moses and parts the Red Sea.", people: ["moses", "miriam"], lesson: "red-sea" },
  { id: "sinai", title: "The Ten Commandments", era: "Old Testament", ref: "Exodus 19–20", summary: "God gives his law to Israel at Mount Sinai.", people: ["moses"], lesson: "ten-commandments" },
  { id: "jericho", title: "Into the Promised Land", era: "Old Testament", ref: "Joshua 1–6", summary: "Joshua leads Israel across the Jordan, and the walls of Jericho fall.", people: ["joshua"], lesson: "jericho" },
  { id: "ruth", title: "Ruth and Naomi", era: "Old Testament", ref: "Ruth 1–4", summary: "In the time of the judges, Ruth shows loyal love and becomes David's great-grandmother.", people: ["ruth"], lesson: "ruth-naomi" },
  { id: "samuel", title: "Samuel hears God", era: "Old Testament", ref: "1 Samuel 3", summary: "God calls young Samuel, who becomes a prophet.", people: ["samuel"], lesson: "samuel-hears" },
  { id: "david", title: "David becomes king", era: "Old Testament", when: "about 1000 BC", ref: "1 Samuel 16–2 Samuel 5", summary: "The shepherd who faced Goliath becomes Israel's king.", people: ["david"], lesson: "david-goliath" },
  { id: "solomon", title: "Solomon builds the temple", era: "Old Testament", ref: "1 Kings 3–8", summary: "King Solomon asks God for wisdom and builds the temple in Jerusalem.", people: [] },
  { id: "jonah", title: "Jonah goes to Nineveh", era: "Old Testament", ref: "Jonah 1–4", summary: "God shows mercy to the people of Nineveh.", people: ["jonah"], lesson: "jonah" },
  { id: "exile", title: "Exile in Babylon", era: "Old Testament", when: "about 586 BC", ref: "2 Kings 25; Daniel 1", summary: "Jerusalem falls and many people are taken to Babylon, where Daniel stays faithful.", people: ["daniel"], lesson: "daniel-lions" },
  { id: "esther", title: "Queen Esther", era: "Old Testament", ref: "Esther 1–10", summary: "Esther bravely helps save the Jewish people in Persia.", people: ["esther"], lesson: "esther" },
  { id: "return", title: "Return and rebuilding", era: "Old Testament", ref: "Ezra 1; Nehemiah 1–6", summary: "God's people return home and rebuild the temple and Jerusalem's walls.", people: [] },
  { id: "birth", title: "Jesus is born", era: "Life of Jesus", when: "about 6–4 BC", ref: "Luke 2; Matthew 2", summary: "Jesus is born in Bethlehem. Angels tell shepherds, and wise men follow a star.", people: ["jesus", "mary", "joseph-nt"], lesson: "jesus-born" },
  { id: "baptism", title: "Jesus is baptized", era: "Life of Jesus", ref: "Matthew 3", summary: "John baptizes Jesus, and God calls him his beloved Son.", people: ["jesus", "john-baptist"], lesson: "jesus-baptism" },
  { id: "ministry", title: "Jesus teaches and heals", era: "Life of Jesus", ref: "Matthew 4–25", summary: "Jesus calls disciples, tells parables, and does miracles across Galilee and Judea.", people: ["jesus", "peter"], lesson: "jesus-calls-disciples" },
  { id: "cross", title: "Jesus dies and rises again", era: "Life of Jesus", when: "about AD 30–33", ref: "Luke 23–24", summary: "Jesus dies on the cross and rises on the third day.", people: ["jesus", "mary-magdalene"], lesson: "jesus-dies-and-rises" },
  { id: "pentecost", title: "The Holy Spirit comes", era: "Early Church", ref: "Acts 2", summary: "At Pentecost the Holy Spirit comes and the church begins.", people: ["peter"], lesson: "pentecost" },
  { id: "paul", title: "Saul meets Jesus", era: "Early Church", ref: "Acts 9", summary: "Saul meets Jesus on the road to Damascus and becomes a follower.", people: ["paul"], lesson: "saul-becomes-paul" },
  { id: "journeys", title: "Paul's journeys", era: "Early Church", ref: "Acts 13–28", summary: "Paul travels across the Roman world sharing the good news and writing letters to churches.", people: ["paul"] },
];
