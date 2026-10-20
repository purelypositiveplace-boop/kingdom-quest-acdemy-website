/**
 * Prayer Garden. Guided prayers are original wording, offered as examples, not formulas.
 * Children are never asked to type personal problems; nothing here is collected.
 */
export interface PrayerTopic {
  id: string;
  title: string;
  flower: string;
  intro: string;
  steps?: string[];
  prayer: string;
  ref?: string;
  /** shows the trusted-grown-up reminder */
  care?: boolean;
}

export const PRAYER_PROMISE_NOTE =
  "Prayer is talking with God. God always hears us and loves us, but he doesn't always answer the way we expect. We can keep trusting him either way.";

export const PRAYER_TOPICS: PrayerTopic[] = [
  { id: "what", title: "What Is Prayer?", flower: "#ffd23f", intro: "Prayer is simply talking with God. You can pray out loud or quietly in your heart, with your eyes open or closed, anywhere and anytime. God loves to hear from you!", prayer: "Dear God, thank you that I can talk with you anytime. Help me get to know you more. Amen.", ref: "Philippians 4:6" },
  { id: "how", title: "How Can I Pray?", flower: "#9fd3ff", intro: "One easy way to pray is with your hand! Each finger reminds you of something to pray about.", steps: ["Thumb: Thank God for something good.", "Pointer: Pray for people who help you, like teachers and doctors.", "Middle: Pray for leaders.", "Ring: Pray for people who are sick or sad.", "Pinky: Pray for yourself."], prayer: "Dear God, thank you for ___. Please help ___. Please be with me today. Amen." },
  { id: "thanks", title: "Thank-You Prayers", flower: "#ff8a5c", intro: "The Bible tells us to give thanks. Think of three things you're thankful for and tell God.", prayer: "Thank you, God, for my family, my friends, yummy food, and the beautiful world you made. Thank you most of all for loving me. Amen.", ref: "1 Thessalonians 5:18" },
  { id: "family", title: "Prayers for Family", flower: "#ff7eb6", intro: "You can pray for the people in your home, whoever they are. Every family looks different, and God loves every one.", prayer: "Dear God, please bless my family. Keep us safe, help us be kind to each other, and fill our home with your love. Amen." },
  { id: "friends", title: "Prayers for Friends", flower: "#7cc576", intro: "Praying for friends is a wonderful way to care for them.", prayer: "Dear God, thank you for my friends. Please help them, keep them safe, and help me be a good friend too. Amen.", ref: "Proverbs 17:17" },
  { id: "sad", title: "Prayers When I'm Sad", flower: "#6c7bff", intro: "It's okay to feel sad. Jesus felt sad sometimes too (John 11:35). You can tell God exactly how you feel. You can also talk to a grown-up who loves you.", prayer: "Dear God, I feel sad right now. Please hold me close and comfort my heart. Thank you that you are with me. Amen.", ref: "Psalm 46:1", care: true },
  { id: "worried", title: "Prayers When I'm Worried", flower: "#b58cff", intro: "When worries feel big, take a slow breath in... and out. God cares about every worry. Talking to a trusted grown-up helps too.", prayer: "Dear God, I feel worried. I give my worries to you because you care for me. Please give me your peace. Amen.", ref: "1 Peter 5:7", care: true },
  { id: "bedtime", title: "Prayers Before Bed", flower: "#3d4e9e", intro: "Bedtime is a peaceful time to talk with God about your day.", prayer: "Dear God, thank you for today. Please forgive me for anything I did wrong. Watch over me and my family tonight, and give me sweet sleep. Amen." },
  { id: "meals", title: "Prayers Before Meals", flower: "#f5b942", intro: "Jesus gave thanks before he shared food (John 6:11). We can too!", prayer: "Thank you, God, for this food and for the hands that made it. Bless it to our bodies, and help us remember people who are hungry. Amen." },
  { id: "forgiveness", title: "Prayers for Forgiveness", flower: "#2ec4c4", intro: "Everyone makes wrong choices sometimes. When we tell God we're sorry, he forgives us.", prayer: "Dear God, I'm sorry for ___. Please forgive me, and help me make things right. Thank you for your love. Amen.", ref: "1 John 1:9" },
  { id: "lords-prayer", title: "The Lord's Prayer", flower: "#ffd23f", intro: "Jesus taught his disciples this prayer. Christians all over the world pray it. Here it is from the World English Bible.", prayer: "", ref: "Matthew 6:9-13" },
];
