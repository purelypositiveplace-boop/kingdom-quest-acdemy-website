/** Learn About Jesus — 15 short topics, each linked to Scripture and lessons. */
export interface JesusTopic {
  id: string;
  title: string;
  text: string;
  refs: string[];
  lesson?: string;
  /** a note where Christian traditions understand something differently */
  traditions?: string;
}

export const DOCTRINE_NOTE =
  "Kingdom Quest Academy teaches beliefs shared by most Christian churches, summed up in early statements like the Apostles' Creed: God as Father, Son and Holy Spirit; Jesus' birth, death and resurrection; forgiveness and new life through Jesus. Where churches differ (for example on baptism, communion, or how to read the days of creation), we say so and encourage families to talk with their own church. A qualified reviewer must approve all theology before public launch.";

export const JESUS_TOPICS: JesusTopic[] = [
  { id: "who", title: "Who Is Jesus?", refs: ["John 3:16", "Matthew 16:15-16"], text: "Jesus is the most important person in the Bible. Christians believe he is God's Son, who came to earth as a real human baby, lived a perfect life, showed us what God is like, died for us and rose again. The name Jesus means 'the Lord saves.'" },
  { id: "birth", title: "The Birth of Jesus", refs: ["Luke 2:1-20"], lesson: "jesus-born", text: "Jesus was born in Bethlehem to Mary. Angels announced the good news to shepherds, and later wise men followed a star to worship him." },
  { id: "child", title: "Jesus as a Child", refs: ["Luke 2:41-52"], text: "When Jesus was twelve, his family went to Jerusalem for Passover. He stayed behind in the temple, listening to teachers and asking questions. Luke says Jesus grew in wisdom and stature, and in favour with God and people." },
  { id: "baptism", title: "The Baptism of Jesus", refs: ["Matthew 3:13-17"], lesson: "jesus-baptism", text: "John baptized Jesus in the Jordan River. The Holy Spirit came down like a dove, and God said, 'This is my beloved Son.'", traditions: "Churches baptize in different ways — some baptize babies, some baptize people who choose to follow Jesus, some pour water and some immerse. Ask your church what it believes." },
  { id: "disciples", title: "Jesus Calls His Disciples", refs: ["Luke 5:1-11", "Luke 6:12-16"], lesson: "jesus-calls-disciples", text: "Jesus invited ordinary people — fishermen, a tax collector and others — to follow him. He chose twelve apostles to learn from him and share his message." },
  { id: "miracles", title: "Miracles of Jesus", refs: ["Mark 4:35-41", "John 6:1-14", "John 9:1-12"], lesson: "jesus-calms-storm", text: "Jesus calmed storms, fed crowds, healed sick people and helped blind people see. His miracles showed God's power and love, and pointed to who he is." },
  { id: "love", title: "Jesus Teaches About Love", refs: ["Matthew 22:37-39", "John 13:34"], lesson: "good-samaritan", text: "Jesus said the greatest commandments are to love God with all your heart and to love your neighbour as yourself. He even taught us to love our enemies." },
  { id: "forgiveness", title: "Jesus Teaches About Forgiveness", refs: ["Matthew 18:21-22", "Luke 15:11-32"], lesson: "prodigal-son", text: "Jesus taught that God is ready to forgive, like the father who ran to his returning son. He told his followers to forgive others too. Forgiving doesn't mean keeping secrets about being hurt or staying somewhere unsafe." },
  { id: "children", title: "Jesus and the Children", refs: ["Mark 10:13-16"], lesson: "jesus-and-children", text: "When the disciples tried to send children away, Jesus said, 'Let the little children come to me.' He took them in his arms and blessed them." },
  { id: "prayer", title: "Jesus and Prayer", refs: ["Matthew 6:9-13", "Mark 1:35"], text: "Jesus often went to quiet places to pray. He taught his followers the Lord's Prayer as an example of how to pray." },
  { id: "parables", title: "The Parables of Jesus", refs: ["Luke 15:1-7", "Luke 10:25-37"], lesson: "lost-sheep", text: "Jesus told stories called parables about sheep, seeds, coins, sons and neighbours. Each one teaches something about God and his kingdom." },
  { id: "last-supper", title: "The Last Supper", refs: ["Luke 22:7-20"], text: "On the night before he died, Jesus shared a Passover meal with his disciples. He broke bread and shared a cup, and asked them to remember him.", traditions: "Christians remember the Last Supper through Communion (also called the Lord's Supper or Eucharist). Churches understand and practise it in different ways." },
  { id: "cross", title: "The Crucifixion", refs: ["Luke 23:33-46"], lesson: "jesus-dies-and-rises", text: "Jesus was put to death on a cross, even though he had done nothing wrong. He forgave the people who hurt him. Christians believe Jesus gave his life out of love, so that people could be forgiven and brought back to God." },
  { id: "resurrection", title: "The Resurrection", refs: ["Luke 24:1-12", "1 Corinthians 15:3-6"], lesson: "jesus-dies-and-rises", text: "On the third day, Jesus rose from the dead! The tomb was empty, and many people saw him alive. This is the heart of the Christian hope and the reason for Easter joy." },
  { id: "commission", title: "The Great Commission", refs: ["Matthew 28:18-20", "Acts 1:8"], lesson: "pentecost", text: "Before returning to heaven, Jesus told his followers to go and make disciples of all nations, and promised, 'I am with you always.'" },
];
