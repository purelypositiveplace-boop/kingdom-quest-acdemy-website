import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTERS, CHARACTER_BY_ID } from "@/data/characters";
import { getLesson } from "@/lib/curriculum";
import { refHref } from "@/lib/bible/reference";
import { PersonPortrait } from "@/components/bible/PersonPortrait";
import { ContentLabel } from "@/components/ui/ScriptureText";
import { CharacterQuiz } from "@/components/bible/CharacterQuiz";
import { ART_NOTE } from "@/data/art-manifest";

export function generateStaticParams() {
  return CHARACTERS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = CHARACTER_BY_ID[id];
  return c ? { title: `${c.name} — Bible Character for Kids`, description: c.kid, alternates: { canonical: `/characters/${c.id}` } } : {};
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = CHARACTER_BY_ID[id];
  if (!c) notFound();
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <Link href="/characters" className="inline-flex min-h-11 items-center font-bold text-royal underline">
        ← All Bible people
      </Link>
      <header className="card flex flex-col items-center gap-5 p-6 md:flex-row">
        <PersonPortrait id={c.id} name={c.name} color={c.color} size={140} />
        <div>
          <h1 className="text-4xl font-bold text-royal-dark">{c.name}</h1>
          <p className="text-xl font-semibold text-ink">{c.role}</p>
          <p className="mt-2 text-lg text-ink">{c.kid}</p>
          <p className="mt-2 text-xs text-ink-soft">{ART_NOTE}</p>
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card space-y-3 p-6">
          <ContentLabel kind="retelling" />
          <h2 className="text-2xl font-bold text-royal-dark">Important events</h2>
          <ul className="list-disc space-y-1 pl-6 text-ink">
            {c.events.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <h3 className="pt-2 text-lg font-bold text-royal-dark">Read about {c.name.split(",")[0]} in the Bible</h3>
          <ul className="flex flex-wrap gap-2">
            {c.passages.map((p) => (
              <li key={p}>
                <Link href={refHref(p)} className="inline-flex min-h-10 items-center rounded-full bg-royal-soft px-3 text-sm font-bold text-royal-dark hover:underline">
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card space-y-3 p-6">
          <ContentLabel kind="context" />
          <h2 className="text-2xl font-bold text-royal-dark">Bible-times background</h2>
          <p className="text-ink">{c.context}</p>
          <ContentLabel kind="explanation" />
          <h2 className="text-2xl font-bold text-royal-dark">Lessons we can learn</h2>
          <ul className="list-disc space-y-1 pl-6 text-ink">
            {c.lessons.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="rounded-2xl bg-ink/5 p-3 text-sm text-ink-soft">{c.artNote}</p>
        </section>
      </div>
      {c.relatedLessons.length > 0 && (
        <section>
          <h2 className="mb-3 text-2xl font-bold text-royal-dark">Related Bible stories</h2>
          <div className="flex flex-wrap gap-2">
            {c.relatedLessons.map((id) => {
              const l = getLesson(id);
              return l ? (
                <Link key={id} href={`/lessons/${id}`} className="inline-flex min-h-12 items-center rounded-full bg-sun px-5 font-display font-bold text-ink shadow">
                  {l.title}
                </Link>
              ) : null;
            })}
          </div>
        </section>
      )}
      <CharacterQuiz questions={c.quiz} name={c.name} />
    </div>
  );
}
