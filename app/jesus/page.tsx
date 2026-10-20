import type { Metadata } from "next";
import Link from "next/link";
import { JESUS_TOPICS, DOCTRINE_NOTE } from "@/data/jesus";
import { getLesson } from "@/lib/curriculum";
import { refHref } from "@/lib/bible/reference";
import { PageHero } from "@/components/ui/states";
import { Mascot } from "@/components/characters/Mascot";
import { ContentLabel } from "@/components/ui/ScriptureText";

export const metadata: Metadata = {
  title: "Learn About Jesus — for Kids",
  description: "Who is Jesus? Kid-friendly lessons on Jesus' birth, childhood, baptism, miracles, teachings, the cross, the resurrection and the Great Commission.",
  alternates: { canonical: "/jesus" },
};

export default function JesusPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <PageHero title="Learn About Jesus" subtitle="The most important person in the Bible: his life, his love, his teaching, and his resurrection." color="#f0a92e" mascot={<Mascot id="grace" size={110} expression="calm" />} />
      <nav aria-label="Topics" className="flex flex-wrap gap-2">
        {JESUS_TOPICS.map((t, i) => (
          <a key={t.id} href={`#${t.id}`} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 font-display font-semibold text-royal-dark shadow-sm hover:bg-sun">
            {i + 1}. {t.title}
          </a>
        ))}
      </nav>
      <div className="grid gap-5 md:grid-cols-2">
        {JESUS_TOPICS.map((t, i) => {
          const lesson = t.lesson ? getLesson(t.lesson) : undefined;
          return (
            <section key={t.id} id={t.id} className="card scroll-mt-24 space-y-3 p-6">
              <p className="text-sm font-bold text-gold-dark">Topic {i + 1}</p>
              <h2 className="text-2xl font-bold text-royal-dark">{t.title}</h2>
              <ContentLabel kind="interpretation" />
              <p className="text-ink">{t.text}</p>
              {t.traditions && <p className="rounded-2xl bg-lavender-soft p-3 text-sm text-ink">{t.traditions}</p>}
              <div className="flex flex-wrap gap-2">
                {t.refs.map((r) => (
                  <Link key={r} href={refHref(r)} className="inline-flex min-h-10 items-center rounded-full bg-royal-soft px-3 text-sm font-bold text-royal-dark">
                    {r}
                  </Link>
                ))}
                {lesson && (
                  <Link href={`/lessons/${lesson.id}`} className="inline-flex min-h-10 items-center rounded-full bg-sun px-3 text-sm font-bold text-ink">
                    Lesson: {lesson.title}
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <aside className="card p-6">
        <h2 className="text-xl font-bold text-royal-dark">For parents: our doctrinal approach</h2>
        <p className="mt-2 text-ink">{DOCTRINE_NOTE}</p>
      </aside>
    </div>
  );
}
