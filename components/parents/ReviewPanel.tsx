"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export interface ReviewRow {
  id: string;
  title: string;
  version: number;
  refs: string;
  status: string;
  errors: string[];
  warnings: string[];
  history: { status: string; notes: string; by: string; at: string; version: number }[];
}

export function ReviewPanel({ rows }: { rows: ReviewRow[] }) {
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "problems">("all");

  async function decide(id: string, status: string) {
    setMsg("");
    const res = await fetch("/api/admin/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentType: "lesson", contentId: id, status, notes: notes[id] ?? "" }) });
    if (!res.ok) setMsg((await res.json().catch(() => ({}))).error ?? "Couldn't save");
    else router.refresh();
  }

  const shown = rows.filter((r) => (filter === "pending" ? r.status !== "approved" : filter === "problems" ? r.errors.length + r.warnings.length > 0 : true));
  return (
    <section className="space-y-3" aria-labelledby="review-title">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="review-title" className="mr-auto text-2xl font-bold text-royal-dark">
          Theology review
        </h2>
        {(["all", "pending", "problems"] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`min-h-10 rounded-full px-4 font-semibold capitalize ${filter === f ? "bg-royal text-white" : "bg-white shadow-sm"}`}>
            {f}
          </button>
        ))}
      </div>
      {msg && <p role="alert" className="rounded-2xl bg-coral-soft p-3">{msg}</p>}
      <div className="space-y-3">
        {shown.map((r) => (
          <article key={r.id} className="card space-y-2 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {r.status === "approved" ? <CheckCircle2 className="text-emerald" aria-hidden /> : r.status === "needs-changes" ? <AlertTriangle className="text-coral" aria-hidden /> : <Clock className="text-gold-dark" aria-hidden />}
              <Link href={`/lessons/${r.id}`} className="font-display text-lg font-bold text-royal-dark underline" target="_blank">
                {r.title}
              </Link>
              <span className="text-sm text-ink-soft">
                v{r.version} · {r.refs} · <b>{r.status}</b>
              </span>
            </div>
            {r.errors.map((e) => (
              <p key={e} className="text-sm font-semibold text-coral">Error: {e}</p>
            ))}
            {r.warnings.map((e) => (
              <p key={e} className="text-sm text-gold-dark">Warning: {e}</p>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              <input value={notes[r.id] ?? ""} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} placeholder="Reviewer notes (checked against the cited passages?)" className="min-h-10 flex-1 rounded-xl border-2 border-royal-soft px-3" aria-label={`Notes for ${r.title}`} />
              <button type="button" disabled={r.errors.length > 0} onClick={() => decide(r.id, "approved")} className="min-h-10 rounded-full bg-emerald px-4 font-semibold text-white disabled:opacity-40">
                Approve
              </button>
              <button type="button" onClick={() => decide(r.id, "needs-changes")} className="min-h-10 rounded-full bg-coral px-4 font-semibold text-white">
                Needs changes
              </button>
            </div>
            {r.history.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-ink-soft">History ({r.history.length})</summary>
                <ul className="mt-1 space-y-1">
                  {r.history.map((h, i) => (
                    <li key={i}>
                      {new Date(h.at).toLocaleString()}: v{h.version} {h.status} by {h.by}
                      {h.notes ? `: ${h.notes}` : ""}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
