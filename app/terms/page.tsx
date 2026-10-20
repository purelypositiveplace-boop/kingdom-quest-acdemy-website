import type { Metadata } from "next";
import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Use" updated="October 2026" intro="These simple terms explain how Kingdom Quest Academy may be used. They will be reviewed by a lawyer before public launch.">
      <section>
        <h2>Free to use</h2>
        <p>Kingdom Quest Academy is free for families, churches, schools and homeschool groups. Printables may be copied for non-commercial teaching.</p>
      </section>
      <section>
        <h2>Accounts</h2>
        <p>Parent accounts must be created by an adult (18+), who is responsible for the child profiles they create. Children do not create accounts.</p>
      </section>
      <section>
        <h2>Content</h2>
        <p>Scripture quotations are from the World English Bible, which is in the public domain. Lessons, stories, songs, characters (Leo, Sunny, Oliver, Grace and Finn) and artwork are original to Kingdom Quest Academy unless noted.</p>
      </section>
      <section>
        <h2>No warranty</h2>
        <p>We work hard to keep content accurate and the site available, but we provide it &quot;as is.&quot; Lessons are not a substitute for a family&apos;s own church community and guidance.</p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>If these terms change, we will update this page and the date above.</p>
      </section>
    </InfoPage>
  );
}
