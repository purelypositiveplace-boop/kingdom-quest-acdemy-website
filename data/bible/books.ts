/**
 * The 66-book Protestant canon, in canonical order.
 * CANON is explicit so another canon (e.g. one that includes the deuterocanonical books)
 * can be configured later without touching UI code.
 */
export const CANON = {
  id: "protestant-66",
  name: "Protestant Bible (66 books)",
  note: "Catholic and Orthodox Bibles include additional books. This site currently uses the 66-book Protestant list.",
} as const;

export type Testament = "OT" | "NT";

export type BookGroup =
  | "Law"
  | "History"
  | "Poetry & Wisdom"
  | "Major Prophets"
  | "Minor Prophets"
  | "Gospels"
  | "Church History"
  | "Paul's Letters"
  | "General Letters"
  | "Prophecy";

export interface BibleBook {
  /** URL slug and stable id */
  id: string;
  name: string;
  /** file name in the world-english-bible package */
  file: string;
  testament: Testament;
  group: BookGroup;
  /** simple say-it-like-this help for tricky names */
  say?: string;
  /** one kid-friendly sentence about the book (original summary, not Scripture) */
  about: string;
}

export const BOOKS: BibleBook[] = [
  { id: "genesis", name: "Genesis", file: "genesis", testament: "OT", group: "Law", say: "JEN-uh-sis", about: "The beginning: creation, Noah, Abraham, Isaac, Jacob and Joseph." },
  { id: "exodus", name: "Exodus", file: "exodus", testament: "OT", group: "Law", say: "EX-oh-dus", about: "God rescues his people from Egypt and gives the Ten Commandments." },
  { id: "leviticus", name: "Leviticus", file: "leviticus", testament: "OT", group: "Law", say: "leh-VIT-ih-kus", about: "Instructions for worship and holy living for Israel." },
  { id: "numbers", name: "Numbers", file: "numbers", testament: "OT", group: "Law", about: "Israel's journey through the wilderness." },
  { id: "deuteronomy", name: "Deuteronomy", file: "deuteronomy", testament: "OT", group: "Law", say: "doo-ter-ON-oh-mee", about: "Moses reminds the people of God's law before they enter the Promised Land." },
  { id: "joshua", name: "Joshua", file: "joshua", testament: "OT", group: "History", about: "Joshua leads Israel into the Promised Land." },
  { id: "judges", name: "Judges", file: "judges", testament: "OT", group: "History", about: "Leaders called judges help Israel in hard times." },
  { id: "ruth", name: "Ruth", file: "ruth", testament: "OT", group: "History", about: "A story of loyal love between Ruth and Naomi." },
  { id: "1-samuel", name: "1 Samuel", file: "1samuel", testament: "OT", group: "History", about: "Samuel, King Saul and young David." },
  { id: "2-samuel", name: "2 Samuel", file: "2samuel", testament: "OT", group: "History", about: "David becomes king of Israel." },
  { id: "1-kings", name: "1 Kings", file: "1kings", testament: "OT", group: "History", about: "King Solomon, the temple, and the prophet Elijah." },
  { id: "2-kings", name: "2 Kings", file: "2kings", testament: "OT", group: "History", about: "Elisha and the later kings of Israel and Judah." },
  { id: "1-chronicles", name: "1 Chronicles", file: "1chronicles", testament: "OT", group: "History", say: "KRON-ih-kuls", about: "Family histories and the reign of David." },
  { id: "2-chronicles", name: "2 Chronicles", file: "2chronicles", testament: "OT", group: "History", about: "Solomon's temple and the kings of Judah." },
  { id: "ezra", name: "Ezra", file: "ezra", testament: "OT", group: "History", about: "God's people return home and rebuild the temple." },
  { id: "nehemiah", name: "Nehemiah", file: "nehemiah", testament: "OT", group: "History", say: "nee-uh-MY-uh", about: "Nehemiah leads the rebuilding of Jerusalem's wall." },
  { id: "esther", name: "Esther", file: "esther", testament: "OT", group: "History", about: "Queen Esther bravely helps save her people." },
  { id: "job", name: "Job", file: "job", testament: "OT", group: "Poetry & Wisdom", say: "JOHB", about: "A man who trusts God through great suffering." },
  { id: "psalms", name: "Psalms", file: "psalms", testament: "OT", group: "Poetry & Wisdom", say: "SAHMS", about: "Songs and prayers to God, many written by David." },
  { id: "proverbs", name: "Proverbs", file: "proverbs", testament: "OT", group: "Poetry & Wisdom", about: "Short wise sayings for everyday life." },
  { id: "ecclesiastes", name: "Ecclesiastes", file: "ecclesiastes", testament: "OT", group: "Poetry & Wisdom", say: "ih-klee-zee-AS-teez", about: "Thinking about what really matters in life." },
  { id: "song-of-solomon", name: "Song of Solomon", file: "songofsolomon", testament: "OT", group: "Poetry & Wisdom", about: "A poem celebrating love." },
  { id: "isaiah", name: "Isaiah", file: "isaiah", testament: "OT", group: "Major Prophets", say: "eye-ZAY-uh", about: "A prophet who spoke about God's coming king." },
  { id: "jeremiah", name: "Jeremiah", file: "jeremiah", testament: "OT", group: "Major Prophets", say: "jer-uh-MY-uh", about: "A prophet who called people back to God." },
  { id: "lamentations", name: "Lamentations", file: "lamentations", testament: "OT", group: "Major Prophets", about: "Sad poems that still hope in God's faithfulness." },
  { id: "ezekiel", name: "Ezekiel", file: "ezekiel", testament: "OT", group: "Major Prophets", say: "ih-ZEE-kee-ul", about: "A prophet who saw amazing visions." },
  { id: "daniel", name: "Daniel", file: "daniel", testament: "OT", group: "Major Prophets", about: "Daniel and his friends stay faithful in Babylon." },
  { id: "hosea", name: "Hosea", file: "hosea", testament: "OT", group: "Minor Prophets", say: "hoh-ZAY-uh", about: "God's faithful love for his people." },
  { id: "joel", name: "Joel", file: "joel", testament: "OT", group: "Minor Prophets", about: "A call to return to God." },
  { id: "amos", name: "Amos", file: "amos", testament: "OT", group: "Minor Prophets", about: "A shepherd prophet who spoke up for fairness." },
  { id: "obadiah", name: "Obadiah", file: "obadiah", testament: "OT", group: "Minor Prophets", say: "oh-buh-DY-uh", about: "The shortest book of the Old Testament." },
  { id: "jonah", name: "Jonah", file: "jonah", testament: "OT", group: "Minor Prophets", about: "Jonah, a great fish, and God's mercy for Nineveh." },
  { id: "micah", name: "Micah", file: "micah", testament: "OT", group: "Minor Prophets", say: "MY-kuh", about: "Do justice, love kindness, walk humbly with God." },
  { id: "nahum", name: "Nahum", file: "nahum", testament: "OT", group: "Minor Prophets", say: "NAY-hum", about: "A message about the city of Nineveh." },
  { id: "habakkuk", name: "Habakkuk", file: "habakkuk", testament: "OT", group: "Minor Prophets", say: "huh-BAK-uk", about: "A prophet asks God hard questions and learns to trust." },
  { id: "zephaniah", name: "Zephaniah", file: "zephaniah", testament: "OT", group: "Minor Prophets", say: "zef-uh-NY-uh", about: "God will gather and rejoice over his people." },
  { id: "haggai", name: "Haggai", file: "haggai", testament: "OT", group: "Minor Prophets", say: "HAG-eye", about: "Encouragement to rebuild God's temple." },
  { id: "zechariah", name: "Zechariah", file: "zechariah", testament: "OT", group: "Minor Prophets", say: "zek-uh-RY-uh", about: "Visions of hope and a humble king." },
  { id: "malachi", name: "Malachi", file: "malachi", testament: "OT", group: "Minor Prophets", say: "MAL-uh-ky", about: "The last book of the Old Testament." },
  { id: "matthew", name: "Matthew", file: "matthew", testament: "NT", group: "Gospels", about: "The life and teaching of Jesus, the promised King." },
  { id: "mark", name: "Mark", file: "mark", testament: "NT", group: "Gospels", about: "A fast-moving account of what Jesus did." },
  { id: "luke", name: "Luke", file: "luke", testament: "NT", group: "Gospels", about: "A careful account of Jesus' life, including his birth." },
  { id: "john", name: "John", file: "john", testament: "NT", group: "Gospels", about: "Signs and words that show who Jesus is." },
  { id: "acts", name: "Acts", file: "acts", testament: "NT", group: "Church History", about: "The Holy Spirit comes and the church grows." },
  { id: "romans", name: "Romans", file: "romans", testament: "NT", group: "Paul's Letters", about: "Paul explains the good news of God's grace." },
  { id: "1-corinthians", name: "1 Corinthians", file: "1corinthians", testament: "NT", group: "Paul's Letters", say: "kor-IN-thee-unz", about: "Includes the famous chapter about love." },
  { id: "2-corinthians", name: "2 Corinthians", file: "2corinthians", testament: "NT", group: "Paul's Letters", about: "God's comfort and strength in weakness." },
  { id: "galatians", name: "Galatians", file: "galatians", testament: "NT", group: "Paul's Letters", say: "guh-LAY-shunz", about: "Freedom in Christ and the fruit of the Spirit." },
  { id: "ephesians", name: "Ephesians", file: "ephesians", testament: "NT", group: "Paul's Letters", say: "ee-FEE-zhunz", about: "God's family and the armor of God." },
  { id: "philippians", name: "Philippians", file: "philippians", testament: "NT", group: "Paul's Letters", say: "fih-LIP-ee-unz", about: "A joyful letter written from prison." },
  { id: "colossians", name: "Colossians", file: "colossians", testament: "NT", group: "Paul's Letters", say: "kuh-LOSH-unz", about: "Jesus is above all things." },
  { id: "1-thessalonians", name: "1 Thessalonians", file: "1thessalonians", testament: "NT", group: "Paul's Letters", say: "thes-uh-LOH-nee-unz", about: "Encouragement for a young church." },
  { id: "2-thessalonians", name: "2 Thessalonians", file: "2thessalonians", testament: "NT", group: "Paul's Letters", about: "Stand firm and keep doing good." },
  { id: "1-timothy", name: "1 Timothy", file: "1timothy", testament: "NT", group: "Paul's Letters", about: "Paul's advice to young Timothy." },
  { id: "2-timothy", name: "2 Timothy", file: "2timothy", testament: "NT", group: "Paul's Letters", about: "Paul's last letter, full of courage." },
  { id: "titus", name: "Titus", file: "titus", testament: "NT", group: "Paul's Letters", about: "Living well and doing good works." },
  { id: "philemon", name: "Philemon", file: "philemon", testament: "NT", group: "Paul's Letters", say: "fy-LEE-mun", about: "A short letter about forgiveness." },
  { id: "hebrews", name: "Hebrews", file: "hebrews", testament: "NT", group: "General Letters", about: "Jesus is greater than everything before him." },
  { id: "james", name: "James", file: "james", testament: "NT", group: "General Letters", about: "Real faith shows in what we do." },
  { id: "1-peter", name: "1 Peter", file: "1peter", testament: "NT", group: "General Letters", about: "Hope for people going through hard times." },
  { id: "2-peter", name: "2 Peter", file: "2peter", testament: "NT", group: "General Letters", about: "Keep growing in faith." },
  { id: "1-john", name: "1 John", file: "1john", testament: "NT", group: "General Letters", about: "God is love, so we love one another." },
  { id: "2-john", name: "2 John", file: "2john", testament: "NT", group: "General Letters", about: "Walk in truth and love." },
  { id: "3-john", name: "3 John", file: "3john", testament: "NT", group: "General Letters", about: "Thanks for being kind to travelers." },
  { id: "jude", name: "Jude", file: "jude", testament: "NT", group: "General Letters", about: "Keep yourselves in God's love." },
  { id: "revelation", name: "Revelation", file: "revelation", testament: "NT", group: "Prophecy", about: "Visions of Jesus' victory and a new creation." },
];

export const BOOK_BY_ID = Object.fromEntries(BOOKS.map((b) => [b.id, b])) as Record<string, BibleBook>;
export const BOOK_BY_NAME = Object.fromEntries(BOOKS.map((b) => [b.name.toLowerCase(), b])) as Record<string, BibleBook>;
