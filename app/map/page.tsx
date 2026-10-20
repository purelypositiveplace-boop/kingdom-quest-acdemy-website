import type { Metadata } from "next";
import { MapExplorer } from "@/components/bible/MapExplorer";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";

export const metadata: Metadata = {
  title: "Bible Map for Kids — Explore Bible Places",
  description: "An interactive Bible map for kids: Bethlehem, Nazareth, Jerusalem, the Sea of Galilee, Egypt, Mount Sinai, Damascus, Rome and more, with stories and facts.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHero title="Bible Map" subtitle="Where did Bible stories happen? Tap a place to find out." color="#e0a045" mascot={<Mascot id="leo" size={110} />} />
      <MapExplorer />
    </div>
  );
}
