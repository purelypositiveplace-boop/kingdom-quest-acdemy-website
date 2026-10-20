import type { Metadata } from "next";
import { InfoPage } from "@/components/layout/InfoPage";
import { DOCTRINE_NOTE } from "@/data/jesus";
import { MASCOT_NOTE } from "@/data/mascots";

export const metadata: Metadata = { title: "About Us", description: "Kingdom Quest Academy is a free Christian Bible-learning website for children ages 3–12.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <InfoPage title="About Kingdom Quest Academy" intro="BIG FAITH. BIG ADVENTURES. ENDLESS DISCOVERIES. Kingdom Quest Academy helps children ages 3–12 explore the Bible through stories, games, songs and activities." mascot="leo">
      <section>
        <h2>Our mission</h2>
        <p>To make learning about God, Jesus, the Bible, prayer and Christian kindness exciting, age-appropriate, safe and memorable, and to give parents a resource they can trust.</p>
      </section>
      <section>
        <h2>Free for every family</h2>
        <p>Every lesson, story, game, quiz, memory verse, Prayer Garden page, dashboard, progress feature, badge and core printable is free. There are no subscriptions, locked lessons or pay-to-play features. In the future, grown-ups may choose to support us through voluntary donations, books, or extra resources for churches and homeschool groups. Children are never asked to buy or donate anything.</p>
      </section>
      <section>
        <h2>How we teach the Bible</h2>
        <p>{DOCTRINE_NOTE}</p>
        <p>Bible text comes from the World English Bible, which is in the public domain. We always label Scripture, story retellings, background, and explanations separately so children can tell them apart. All lessons are marked for review by a qualified Christian educator before public launch.</p>
      </section>
      <section>
        <h2>Our guides</h2>
        <p>{MASCOT_NOTE}</p>
      </section>
    </InfoPage>
  );
}
