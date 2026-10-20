import type { Metadata } from "next";
import { PrayerGarden } from "@/components/bible/PrayerGarden";

export const metadata: Metadata = {
  title: "Prayer Garden — Teaching Kids to Pray",
  description: "A peaceful place for children to learn about prayer: thank-you prayers, bedtime prayers, prayers when worried, and the Lord's Prayer.",
  alternates: { canonical: "/prayer" },
};

export default function PrayerPage() {
  return <PrayerGarden />;
}
