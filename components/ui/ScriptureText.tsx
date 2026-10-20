import verseText from "@/data/verses/verse-text.generated.json";
import { refHref } from "@/lib/bible/reference";
import Link from "next/link";
import { BookOpen } from "lucide-react";

type VT = Record<string, { ref: string; translation: string; verses: { chapter: number; verse: number; text: string }[] }>;
const TEXT = verseText as VT;

export function getVerseText(ref: string): string | null {
  const v = TEXT[ref];
  return v ? v.verses.map((x) => x.text).join(" ") : null;
}

/**
 * Direct Bible text, always labelled with its reference and translation so it is never confused
 * with paraphrase or explanation. If the text isn't available we show only the reference.
 */
export function ScriptureText({ refText, size = "md", showLink = true, className = "" }: { refText: string; size?: "sm" | "md" | "lg"; showLink?: boolean; className?: string }) {
  const text = getVerseText(refText);
  const sz = size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <figure className={`rounded-3xl border-l-8 border-gold bg-white/90 p-5 ${className}`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-dark">
        <BookOpen size={16} aria-hidden /> Bible text
      </div>
      {text ? <blockquote className={`scripture leading-relaxed text-ink ${sz}`}>{text}</blockquote> : null}
      <figcaption className="mt-3 text-sm font-semibold text-ink-soft">
        {showLink ? (
          <Link href={refHref(refText)} className="underline decoration-gold decoration-2 underline-offset-4 hover:text-royal">
            {refText}
          </Link>
        ) : (
          refText
        )}{" "}
        <span className="font-normal">· World English Bible (public domain)</span>
      </figcaption>
    </figure>
  );
}

const LABELS = {
  retelling: ["Story retelling", "bg-sky-soft text-royal-dark"],
  explanation: ["What it means", "bg-emerald-soft text-emerald"],
  context: ["Bible-times background", "bg-coral-soft text-ink"],
  interpretation: ["What Christians believe", "bg-lavender-soft text-royal-dark"],
  reflection: ["Think about it", "bg-sun/30 text-ink"],
  illustrative: ["Imagined moment, not from the Bible", "bg-ink/5 text-ink-soft"],
} as const;

/** Labels for non-Scripture content so kids and parents can tell the kinds of text apart. */
export function ContentLabel({ kind }: { kind: keyof typeof LABELS }) {
  const [label, cls] = LABELS[kind];
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${cls}`}>{label}</span>;
}
