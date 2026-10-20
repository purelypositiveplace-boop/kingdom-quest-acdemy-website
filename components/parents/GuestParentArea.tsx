"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { PrimaryButton } from "@/components/ui/Button";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useKQ } from "@/lib/progress/store";
import { LEVEL_LIST } from "@/lib/curriculum/levels";
import { Mascot } from "@/components/characters/Mascot";

/**
 * Parent area for families without an account. Guest settings live only in this browser, so the
 * check here is a simple adult question (a soft gate); signed-in accounts use a real password gate.
 */
export function GuestParentArea() {
  const [unlocked, setUnlocked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [q, setQ] = useState({ a: 7, b: 8 });
  useEffect(() => setQ({ a: 6 + Math.floor(Math.random() * 4), b: 7 + Math.floor(Math.random() * 3) }), []);
  const profile = useKQ((s) => s.profile);
  const setProfile = useKQ((s) => s.setProfile);
  const reset = useKQ((s) => s.resetProgress);
  const lessons = useKQ((s) => Object.keys(s.progress.lessons).length);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="card grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-royal-dark">Parents &amp; grown-ups</h1>
          <p className="text-lg text-ink">Create a free parent account to add child profiles, see learning history across devices, choose settings, and export or delete data. Everything stays free.</p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/parents/signup" tone="royal" data-testid="go-signup">
              Create free account
            </PrimaryButton>
            <PrimaryButton href="/parents/login" tone="white">
              Sign in
            </PrimaryButton>
          </div>
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <ShieldCheck size={18} className="text-emerald" aria-hidden /> No child emails, no ads, no trackers.
          </p>
        </div>
        <Mascot id="grace" size={150} expression="calm" />
      </div>

      <section className="card space-y-4 p-6">
        <h2 className="text-2xl font-bold text-royal-dark">Guest settings on this device</h2>
        {!unlocked ? (
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (Number(answer) === q.a * q.b) setUnlocked(true);
              setAnswer("");
            }}
          >
            <label className="font-semibold">
              Grown-up check: what is {q.a} × {q.b}?
              <input inputMode="numeric" value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-1 block w-40 rounded-2xl border-4 border-royal-soft px-4 py-2" />
            </label>
            <PrimaryButton type="submit" tone="royal">
              Open settings
            </PrimaryButton>
          </form>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="font-semibold text-ink">Learning level{profile ? ` for ${profile.nickname}` : ""}</p>
              <div className="flex flex-wrap gap-2">
                {LEVEL_LIST.map((l) => (
                  <button key={l.id} type="button" aria-pressed={profile?.level === l.id} onClick={() => setProfile({ level: l.id })} className={`min-h-11 rounded-full px-4 font-semibold ${profile?.level === l.id ? "bg-royal text-white" : "bg-royal-soft text-royal-dark"}`}>
                    {l.name} ({l.ages})
                  </button>
                ))}
              </div>
              <p className="text-ink-soft">Lessons finished on this device: {lessons}</p>
              <PrimaryButton tone="coral" onClick={() => setConfirm(true)}>
                Reset progress on this device
              </PrimaryButton>
            </div>
            <AccessibilityControls parent />
          </div>
        )}
      </section>
      <ConfirmationDialog
        open={confirm}
        danger
        title="Reset progress?"
        message="This clears stars, badges and lesson progress saved in this browser. It can't be undone."
        confirmLabel="Reset"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          reset();
          setConfirm(false);
        }}
      />
    </div>
  );
}
