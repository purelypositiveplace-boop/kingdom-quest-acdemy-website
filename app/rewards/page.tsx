import type { Metadata } from "next";
import { RewardsView } from "@/components/rewards/RewardsView";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = { title: "My Rewards", robots: { index: false } };

export default function RewardsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="My Rewards" subtitle="Badges you earn by learning, exploring and being kind. They can't be bought, and nobody else can see them." color="#f0a92e" mascot={<Mascot id="leo" size={110} expression="proud" />} />
      <RewardsView />
    </div>
  );
}
