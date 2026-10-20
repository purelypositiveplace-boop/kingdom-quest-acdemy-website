import type { Metadata } from "next";
import { InfoPage } from "@/components/layout/InfoPage";
import { TRUSTED_ADULT_NOTE } from "@/data/values";

export const metadata: Metadata = { title: "Child Safety", alternates: { canonical: "/safety" } };

export default function SafetyPage() {
  return (
    <InfoPage title="Child Safety" intro="Safety is a core part of Kingdom Quest Academy, not an add-on. Here is how we keep children safe.">
      <section>
        <h2>Safe by design</h2>
        <ul>
          <li>No chat rooms, direct messages, comments or public profiles.</li>
          <li>No ads, no in-app purchases, no loot boxes and no pressure to pay or donate.</li>
          <li>No public leaderboards or comparing children with each other.</li>
          <li>No punishing streaks. Missing a day never costs a child anything.</li>
          <li>No links to outside websites inside children&apos;s activities.</li>
          <li>Parent settings sit behind a parent sign-in that children can&apos;t get past by tapping around.</li>
        </ul>
      </section>
      <section>
        <h2>Gentle, honest teaching</h2>
        <ul>
          <li>Hard Bible stories (like the flood or the crucifixion) are told gently, without graphic detail, with notes for parents.</li>
          <li>We never use fear to pressure children into faith.</li>
          <li>We never suggest that illness, sadness, disability or family difficulties mean weak faith or punishment.</li>
          <li>Prayer is never presented as a guarantee of a particular outcome.</li>
          <li>There is no AI chatbot or &quot;spiritual counsellor&quot; for children.</li>
        </ul>
      </section>
      <section>
        <h2>Trusted grown-ups</h2>
        <p>{TRUSTED_ADULT_NOTE}</p>
        <p>We teach that children should never keep important secrets from their parents or caregivers, and that forgiveness never means accepting abuse or staying somewhere unsafe.</p>
      </section>
    </InfoPage>
  );
}
