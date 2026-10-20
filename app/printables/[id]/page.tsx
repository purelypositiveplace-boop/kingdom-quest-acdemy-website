import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRINTABLES, PRINTABLE_BY_ID } from "@/data/printables";
import { PrintableView } from "@/components/printables/PrintableView";

export function generateStaticParams() {
  return PRINTABLES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PRINTABLE_BY_ID[id];
  return p ? { title: `${p.title} — Free Printable`, description: p.description, alternates: { canonical: `/printables/${p.id}` } } : {};
}

export default async function PrintablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!PRINTABLE_BY_ID[id]) notFound();
  return <PrintableView id={id} />;
}
