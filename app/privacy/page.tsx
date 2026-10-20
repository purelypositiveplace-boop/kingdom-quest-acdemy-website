import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Privacy Notice", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Notice" updated="October 2026" intro="We built Kingdom Quest Academy to collect as little information as possible. This page explains what we collect, why, and the choices parents have.">
      <section>
        <h2>For kids</h2>
        <p>You never need to tell us your real name, where you live, your email or your phone number. A fun nickname is perfect! There&apos;s no chat, no posting and no one else can see your profile.</p>
      </section>
      <section>
        <h2>Guest mode (no account)</h2>
        <ul>
          <li>Your child&apos;s nickname, level, settings and progress are stored only in this browser (local storage).</li>
          <li>Nothing about your child is sent to our servers in guest mode.</li>
          <li>Clearing your browser data removes it.</li>
        </ul>
      </section>
      <section>
        <h2>Parent accounts</h2>
        <ul>
          <li>We store the parent&apos;s email address and a securely hashed password (never the password itself).</li>
          <li>For each child profile: a nickname, optional avatar choice, age level, settings, and learning progress (lessons, games, verses, badges). We don&apos;t ask for a child&apos;s real name, birthday, photo, school, location or email.</li>
          <li>A sign-in cookie keeps the parent signed in. It is required for the account to work and is not used for tracking.</li>
        </ul>
      </section>
      <section>
        <h2>What we don&apos;t do</h2>
        <ul>
          <li>No advertising and no behavioural advertising.</li>
          <li>No third-party trackers or analytics scripts that identify children.</li>
          <li>No selling or sharing of personal information.</li>
          <li>No chat, messaging, public profiles, child-generated public posts or social sharing for children.</li>
          <li>No collecting of prayer requests or personal problems from children.</li>
        </ul>
      </section>
      <section>
        <h2>Your choices and rights</h2>
        <p>
          Parents can review, export (as a file) and permanently delete their child&apos;s data, or their whole account, from the <Link href="/parents" className="font-bold text-royal underline">Parent Dashboard</Link> at any time.
        </p>
      </section>
      <section>
        <h2>Children&apos;s privacy laws</h2>
        <p>We design for children&apos;s privacy laws such as COPPA (US), GDPR-K / UK Age Appropriate Design Code and similar rules. Formal legal review of our parental notice and consent process will be completed before public launch; this notice will be updated after that review.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions? See our <Link href="/contact" className="font-bold text-royal underline">contact page</Link>.
        </p>
      </section>
    </InfoPage>
  );
}
