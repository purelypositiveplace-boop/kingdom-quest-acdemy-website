import type { Metadata } from "next";
import { MusicCenter } from "@/components/bible/MusicCenter";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Bible Songs for Kids — Sing-Along",
  description: "Original Bible sing-along songs for kids with lyrics and highlighted lines: creation, Noah's rainbow, Christmas, bedtime and thank-you songs.",
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Music & Sing-Along" subtitle="Sing along with original Kingdom Quest songs. The words light up as each line plays!" color="#8c6bff" mascot={<Mascot id="sunny" size={110} expression="excited" />} />
      <MusicCenter />
    </div>
  );
}
