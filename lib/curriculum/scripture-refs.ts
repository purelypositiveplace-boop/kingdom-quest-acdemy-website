import { MEMORY_VERSES, OTHER_SCRIPTURE_REFS } from "@/data/verses/memory-verses";
import { VALUES } from "@/data/values";
import { PRAYER_TOPICS } from "@/data/prayers";
import { FEATURED_LESSONS } from "@/data/lessons/featured";
import { OT_LESSONS } from "@/data/lessons/old-testament";
import { NT_LESSONS } from "@/data/lessons/new-testament";

/**
 * Every Scripture reference whose exact text the site displays. The build script resolves each
 * one against the WEB; anything that fails to resolve stops the build.
 * (Lesson passage `refs` are shown as references/links only, not quoted.)
 */
export function allScriptureRefs(): string[] {
  const refs = new Set<string>();
  for (const v of MEMORY_VERSES) refs.add(v.ref);
  for (const r of OTHER_SCRIPTURE_REFS) refs.add(r);
  for (const v of VALUES) refs.add(v.verse);
  for (const p of PRAYER_TOPICS) if (p.ref) refs.add(p.ref);
  for (const l of [...FEATURED_LESSONS, ...OT_LESSONS, ...NT_LESSONS]) refs.add(l.memoryVerse);
  return [...refs].sort();
}
