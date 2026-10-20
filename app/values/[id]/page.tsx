import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { VALUES } from "@/data/values";
import { ValueLessonView } from "@/components/lessons/ValueLessonView";

export function generateStaticParams() {
  return VALUES.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const v = VALUES.find((x) => x.id === id);
  return v ? { title: `${v.title} — Living with Love`, description: v.teaching, alternates: { canonical: `/values/${v.id}` } } : {};
}

export default async function ValuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = VALUES.find((x) => x.id === id);
  if (!v) notFound();
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <Link href="/values" className="inline-flex min-h-11 items-center font-bold text-royal underline">
        ← Living with Love
      </Link>
      <ValueLessonView id={v.id} />
    </div>
  );
}
