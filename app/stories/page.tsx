import type { Metadata } from "next";
import { Suspense } from "react";
import { StoryLibrary } from "@/components/lessons/StoryLibrary";
import { PageHero, SkeletonCards } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Bible Stories for Kids — Free Interactive Bible Lessons",
  description: "30 free interactive Bible stories and lessons for preschoolers and kids ages 3–12, from Creation to the early church. Storybooks, quizzes and activities.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Bible Story Library" subtitle="Find a story from the Old Testament or the New Testament. Every story has pictures, a quiz and an activity." color="#ff7a59" mascot={<Mascot id="oliver" size={110} />} />
      <Suspense fallback={<SkeletonCards />}>
        <StoryLibrary />
      </Suspense>
    </div>
  );
}
