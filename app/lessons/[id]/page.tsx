import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LESSONS, getLesson } from "@/lib/curriculum";
import { LessonExperience } from "@/components/lessons/LessonExperience";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getLesson(id);
  if (!l) return {};
  return {
    title: `${l.title} — Bible Lesson for Kids`,
    description: `${l.summary} A free interactive Bible lesson for ages 3–12 based on ${l.refs.join(", ")}.`,
    alternates: { canonical: `/lessons/${l.id}` },
    openGraph: { title: `${l.title} · Kingdom Quest Academy`, description: l.summary },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  return <LessonExperience lesson={lesson} />;
}
