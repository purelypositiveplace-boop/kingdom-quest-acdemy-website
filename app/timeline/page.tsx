import type { Metadata } from "next";
import { TimelineExplorer } from "@/components/bible/TimelineExplorer";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Bible Timeline for Kids",
  description: "An interactive Bible timeline for kids from Creation to Paul's journeys, in story order, with links to lessons.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Bible Timeline" subtitle="See how the Bible's big story fits together, from the very beginning to the early church." color="#6c7bff" mascot={<Mascot id="oliver" size={110} />} />
      <TimelineExplorer />
    </div>
  );
}
