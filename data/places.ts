/**
 * Bible map locations. Coordinates are percentages on two simplified maps:
 * "world" (the eastern Mediterranean) and "holyland" (a zoomed-in inset of ancient Israel).
 * Positions are approximate and drawn for learning, not navigation.
 */
export interface Place {
  id: string;
  name: string;
  map: "world" | "holyland";
  x: number;
  y: number;
  kind: "town" | "city" | "region" | "water" | "mountain" | "land";
  geo: string;
  context: string;
  facts: string[];
  stories: { title: string; ref: string; lesson?: string }[];
  uncertainty?: string;
  clue: string;
}

export const PLACES: Place[] = [
  {
    id: "bethlehem", name: "Bethlehem", map: "holyland", x: 45, y: 81, kind: "town",
    geo: "A small hill town a few miles south of Jerusalem.",
    context: "Bethlehem was King David's hometown. The prophet Micah said a ruler would come from Bethlehem (Micah 5:2).",
    facts: ["Its name means 'house of bread.'", "Ruth and Boaz lived near Bethlehem.", "Jesus was born here."],
    stories: [{ title: "The Birth of Jesus", ref: "Luke 2:1-20", lesson: "jesus-born" }, { title: "Ruth and Naomi", ref: "Ruth 1:19-22", lesson: "ruth-naomi" }],
    clue: "Find the 'house of bread' where Jesus was born.",
  },
  {
    id: "nazareth", name: "Nazareth", map: "holyland", x: 48, y: 32, kind: "town",
    geo: "A small village in the hills of Galilee, in the north.",
    context: "Nazareth was a small, ordinary village. Jesus grew up here, so he was called 'Jesus of Nazareth.'",
    facts: ["The angel Gabriel visited Mary here.", "Jesus grew up here with Mary and Joseph."],
    stories: [{ title: "The Angel Visits Mary", ref: "Luke 1:26-38", lesson: "jesus-born" }],
    clue: "Find the village where Jesus grew up.",
  },
  {
    id: "jerusalem", name: "Jerusalem", map: "holyland", x: 46, y: 73, kind: "city",
    geo: "A city on hills in the middle of the land, west of the Dead Sea.",
    context: "King David made Jerusalem his capital, and Solomon built the temple there. Jesus died and rose again near Jerusalem.",
    facts: ["It is built on hills.", "The temple stood here.", "The church began here at Pentecost."],
    stories: [{ title: "Jesus Dies and Rises Again", ref: "Luke 24:1-12", lesson: "jesus-dies-and-rises" }, { title: "Pentecost", ref: "Acts 2:1-41", lesson: "pentecost" }],
    clue: "Find the city of David where the temple stood.",
  },
  {
    id: "galilee", name: "Galilee", map: "holyland", x: 40, y: 17, kind: "region",
    geo: "The northern region of the land, with green hills around a large lake.",
    context: "Jesus spent much of his ministry in Galilee, teaching, healing and calling disciples.",
    facts: ["Many of Jesus' disciples came from Galilee.", "It had fishing villages around the lake."],
    stories: [{ title: "Jesus Calls His Disciples", ref: "Matthew 4:18-22", lesson: "jesus-calls-disciples" }],
    clue: "Find the northern region where Jesus did much of his teaching.",
  },
  {
    id: "sea-of-galilee", name: "Sea of Galilee", map: "holyland", x: 64, y: 27, kind: "water",
    geo: "A freshwater lake about 13 miles (21 km) long in the north.",
    context: "Though called a 'sea,' it's a lake. Storms can blow up quickly when wind rushes down from the hills.",
    facts: ["It is also called Lake Gennesaret (Luke 5:1).", "Jesus calmed a storm and walked on water here."],
    stories: [{ title: "Jesus Calms the Storm", ref: "Mark 4:35-41", lesson: "jesus-calms-storm" }, { title: "Jesus Feeds Five Thousand", ref: "John 6:1-14", lesson: "feeds-five-thousand" }],
    clue: "Find the lake where Jesus calmed the storm.",
  },
  {
    id: "jordan", name: "Jordan River", map: "holyland", x: 62, y: 50, kind: "water",
    geo: "A river that flows south from the Sea of Galilee to the Dead Sea.",
    context: "Israel crossed the Jordan into the Promised Land under Joshua. John baptized Jesus in the Jordan.",
    facts: ["Naaman was healed after washing in the Jordan (2 Kings 5).", "It ends in the salty Dead Sea."],
    stories: [{ title: "John Baptizes Jesus", ref: "Matthew 3:13-17", lesson: "jesus-baptism" }],
    clue: "Find the river where Jesus was baptized.",
  },
  {
    id: "jericho", name: "Jericho", map: "holyland", x: 57, y: 69, kind: "city",
    geo: "An oasis city near the Jordan River, north of the Dead Sea.",
    context: "Jericho is one of the oldest cities in the world. It was the first city Israel came to in the Promised Land.",
    facts: ["It's called the 'city of palm trees' (Deuteronomy 34:3).", "Zacchaeus lived here."],
    stories: [{ title: "Joshua and Jericho", ref: "Joshua 6:1-20", lesson: "jericho" }, { title: "Zacchaeus Meets Jesus", ref: "Luke 19:1-10", lesson: "zacchaeus" }],
    clue: "Find the city of palm trees whose walls fell down.",
  },
  {
    id: "capernaum", name: "Capernaum", map: "holyland", x: 61, y: 20, kind: "town",
    geo: "A fishing town on the north shore of the Sea of Galilee.",
    context: "Jesus made Capernaum a home base for his ministry in Galilee (Matthew 4:13).",
    facts: ["Peter had a house here (Mark 1:29).", "Jesus healed many people here."],
    stories: [{ title: "Jesus heals in Capernaum", ref: "Mark 1:21-34" }],
    clue: "Find Jesus' home base by the lake.",
  },
  {
    id: "samaria", name: "Samaria", map: "holyland", x: 44, y: 51, kind: "region",
    geo: "The hilly central region between Galilee and Judea.",
    context: "Jews and Samaritans often didn't get along, which makes Jesus' parable of the Good Samaritan surprising.",
    facts: ["Jesus talked with a Samaritan woman at a well (John 4).", "Philip shared the good news here (Acts 8)."],
    stories: [{ title: "The Good Samaritan", ref: "Luke 10:25-37", lesson: "good-samaritan" }],
    clue: "Find the region the Good Samaritan came from.",
  },
  {
    id: "egypt", name: "Egypt", map: "world", x: 68, y: 84, kind: "land",
    geo: "A land in northeast Africa along the great Nile River.",
    context: "Joseph rose to power in Egypt, and later the Israelites were slaves there until God rescued them through Moses. Jesus' family also fled to Egypt for a time (Matthew 2:13-15).",
    facts: ["The Nile made farming possible in the desert.", "Pharaoh was the title of Egypt's kings."],
    stories: [{ title: "Joseph in Egypt", ref: "Genesis 41:37-43", lesson: "joseph-egypt" }, { title: "Baby Moses", ref: "Exodus 2:1-10", lesson: "baby-moses" }],
    clue: "Find the land of the Nile where Joseph became a leader.",
  },
  {
    id: "sinai", name: "Mount Sinai", map: "world", x: 79, y: 92, kind: "mountain",
    geo: "A mountain in the wilderness between Egypt and the Promised Land.",
    context: "God gave Moses the Ten Commandments at Mount Sinai (also called Horeb).",
    facts: ["The Israelites camped at its foot for many months.", "Moses saw the burning bush near 'Horeb, the mountain of God.'"],
    stories: [{ title: "The Ten Commandments", ref: "Exodus 19:16–20:17", lesson: "ten-commandments" }],
    uncertainty: "No one knows for sure which mountain was Mount Sinai. A traditional site is in the southern Sinai Peninsula, but scholars suggest several other possibilities. Our marker shows the traditional site.",
    clue: "Find the mountain where God gave the Ten Commandments.",
  },
  {
    id: "damascus", name: "Damascus", map: "world", x: 87, y: 59, kind: "city",
    geo: "An ancient city in Syria, northeast of Galilee.",
    context: "Saul was travelling to Damascus when he met Jesus in a bright light.",
    facts: ["It is one of the oldest continuously lived-in cities in the world.", "Ananias lived here and prayed for Saul."],
    stories: [{ title: "Saul Becomes Paul", ref: "Acts 9:1-22", lesson: "saul-becomes-paul" }],
    clue: "Find the city Saul was travelling to when he met Jesus.",
  },
  {
    id: "antioch", name: "Antioch", map: "world", x: 87, y: 42, kind: "city",
    geo: "A large city in Syria (in today's Türkiye), near the Mediterranean coast.",
    context: "Jesus' followers were first called 'Christians' at Antioch (Acts 11:26). Paul's journeys started from here.",
    facts: ["It was one of the biggest cities in the Roman Empire.", "Barnabas and Paul taught here for a year."],
    stories: [{ title: "Called Christians", ref: "Acts 11:19-26" }],
    uncertainty: "There were several cities named Antioch. This is Antioch in Syria. Another, Pisidian Antioch, is mentioned in Acts 13.",
    clue: "Find the city where believers were first called Christians.",
  },
  {
    id: "ephesus", name: "Ephesus", map: "world", x: 56, y: 32, kind: "city",
    geo: "A port city on the west coast of today's Türkiye.",
    context: "Paul stayed in Ephesus for over two years. He later wrote the letter of Ephesians to the church there.",
    facts: ["It had a huge theatre that held thousands of people.", "Ephesians 6 describes the armour of God."],
    stories: [{ title: "Paul in Ephesus", ref: "Acts 19:1-10" }],
    clue: "Find the city that received a letter about the armour of God.",
  },
  {
    id: "corinth", name: "Corinth", map: "world", x: 41, y: 33, kind: "city",
    geo: "A busy trading city in southern Greece.",
    context: "Paul started a church in Corinth and later wrote 1 and 2 Corinthians to it.",
    facts: ["1 Corinthians 13 is the famous 'love chapter.'", "Paul worked as a tentmaker there (Acts 18:3)."],
    stories: [{ title: "Paul in Corinth", ref: "Acts 18:1-11" }],
    clue: "Find the city that received the 'love chapter.'",
  },
  {
    id: "rome", name: "Rome", map: "world", x: 5, y: 7, kind: "city",
    geo: "The capital of the Roman Empire, in Italy.",
    context: "Rome ruled most of the Bible lands in New Testament times. Paul wrote Romans to the church there and later arrived in Rome as a prisoner (Acts 28).",
    facts: ["Caesar Augustus ruled from Rome when Jesus was born.", "Paul taught in Rome for two years while under guard."],
    stories: [{ title: "Paul in Rome", ref: "Acts 28:16-31" }],
    clue: "Find the capital city of the Roman Empire.",
  },
];

export const HOLY_LAND_BOX = { x: 76, y: 60, w: 14, h: 18 };
