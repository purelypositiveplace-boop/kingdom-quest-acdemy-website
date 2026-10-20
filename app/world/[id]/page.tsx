import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WORLDS, WORLD_BY_ID } from "@/data/worlds";
import { AdventureLocation } from "@/components/world/AdventureLocation";

export function generateStaticParams() {
  return WORLDS.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const w = WORLD_BY_ID[id];
  return w ? { title: `${w.name} — Kingdom Quest World`, description: w.intro, alternates: { canonical: `/world/${w.id}` } } : {};
}

export default async function WorldLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!WORLD_BY_ID[id]) notFound();
  return <AdventureLocation id={id} />;
}
