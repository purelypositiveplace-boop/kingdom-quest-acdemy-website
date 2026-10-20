"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Download, Gift, Lock, LogOut, Play, Plus, Printer, Settings, Star, Trash2, Trophy, Sparkles, ShieldCheck } from "lucide-react";
import type { AgeLevel, MascotId } from "@/lib/curriculum/types";
import { LEVELS, LEVEL_LIST } from "@/lib/curriculum/levels";
import { LESSONS } from "@/lib/curriculum";
import { Mascot } from "@/components/characters/Mascot";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useKQ, DEFAULT_SETTINGS, type Settings as ChildSettings } from "@/lib/progress/store";
import type { ProgressSnapshot } from "@/lib/progress/types";

export interface ChildSummary {
  id: string;
  nickname: string;
  avatar: string;
  level: AgeLevel;
  settings: Partial<ChildSettings>;
  stars: number;
  lessons: { id: string; title: string; score: number; total: number; at: string; outdated: boolean }[];
  topics: string[];
  verses: { ref: string; box: number }[];
  badges: string[];
  games: { title: string; plays: number; wins: number }[];
  history: { type: string; title: string; at: string }[];
  favorites: number;
}

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong");
  return data;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export function ParentDashboard({ email, isAdmin, childrenSummaries, donationUrl }: { email: string; isAdmin: boolean; childrenSummaries: ChildSummary[]; donationUrl: string }) {
  const router = useRouter();
  const linkAccount = useKQ((s) => s.linkAccount);
  const unlink = useKQ((s) => s.unlinkAccount);
  const account = useKQ((s) => s.account);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState<AgeLevel>("explorers");
  const [avatar, setAvatar] = useState<MascotId>("leo");
  const [confirm, setConfirm] = useState<null | { title: string; message: string; label: string; run: () => Promise<void> }>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setError("");
    try {
      await fn();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  async function startLearning(c: ChildSummary) {
    const data = (await api(`/api/progress?childId=${c.id}`, "GET")) as { child: { id: string; nickname: string; avatar: string; level: AgeLevel; world: string }; settings: Partial<ChildSettings>; progress: ProgressSnapshot };
    linkAccount({ childId: data.child.id, nickname: data.child.nickname }, { nickname: data.child.nickname, avatar: data.child.avatar, level: data.child.level, world: data.child.world }, data.progress, { ...DEFAULT_SETTINGS, ...data.settings });
    await fetch("/api/auth/verify", { method: "DELETE" }); // lock the parent area before handing over the device
    router.push("/learn");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6" data-testid="parent-dashboard">
      <header className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h1 className="text-3xl font-bold text-royal-dark md:text-4xl">Parent Dashboard</h1>
          <p className="text-ink-soft">Signed in as {email}</p>
        </div>
        <nav aria-label="Parent" className="flex flex-wrap gap-2">
          <a href="#children" className="inline-flex min-h-11 items-center rounded-full bg-royal-soft px-4 font-semibold text-royal-dark">Children</a>
          <a href="#resources" className="inline-flex min-h-11 items-center rounded-full bg-royal-soft px-4 font-semibold text-royal-dark">Resources</a>
          <a href="#data" className="inline-flex min-h-11 items-center rounded-full bg-royal-soft px-4 font-semibold text-royal-dark">Your data</a>
          {isAdmin && (
            <Link href="/admin" className="inline-flex min-h-11 items-center rounded-full bg-lavender px-4 font-semibold text-ink">
              Admin
            </Link>
          )}
          <SecondaryButton icon={<Lock size={18} aria-hidden />} onClick={() => run(() => api("/api/auth/verify", "DELETE"))}>
            Lock
          </SecondaryButton>
          <SecondaryButton
            icon={<LogOut size={18} aria-hidden />}
            onClick={() =>
              run(async () => {
                await api("/api/auth/logout", "POST");
                unlink();
                router.push("/");
              })
            }
          >
            Sign out
          </SecondaryButton>
        </nav>
      </header>
      {error && (
        <p role="alert" className="rounded-2xl bg-coral-soft p-3 font-semibold">
          {error}
        </p>
      )}

      <section id="children" className="space-y-4" aria-labelledby="children-title">
        <h2 id="children-title" className="text-2xl font-bold text-royal-dark">
          Child profiles
        </h2>
        {childrenSummaries.length === 0 && <p className="text-ink-soft">Add your first child below. A nickname is all we need.</p>}
        {childrenSummaries.map((c) => (
          <ChildCard key={c.id} c={c} active={account?.childId === c.id} onStart={() => run(() => startLearning(c))} onRun={run} onConfirm={setConfirm} />
        ))}

        <form
          className="card flex flex-wrap items-end gap-3 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await api("/api/children", "POST", { nickname, level, avatar });
              setNickname("");
            });
          }}
        >
          <label className="font-semibold">
            Nickname
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={20} required placeholder="e.g. Little Lion" className="mt-1 block rounded-2xl border-4 border-royal-soft px-4 py-2" data-testid="child-nickname" />
          </label>
          <label className="font-semibold">
            Level
            <select value={level} onChange={(e) => setLevel(e.target.value as AgeLevel)} className="mt-1 block min-h-11 rounded-2xl border-4 border-royal-soft px-3" data-testid="child-level">
              {LEVEL_LIST.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.ages})
                </option>
              ))}
            </select>
          </label>
          <label className="font-semibold">
            Buddy
            <select value={avatar} onChange={(e) => setAvatar(e.target.value as MascotId)} className="mt-1 block min-h-11 rounded-2xl border-4 border-royal-soft px-3">
              {(["leo", "sunny", "oliver", "grace", "finn"] as const).map((a) => (
                <option key={a} value={a}>
                  {a[0].toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <PrimaryButton type="submit" tone="emerald" icon={<Plus aria-hidden />} data-testid="add-child">
            Add child
          </PrimaryButton>
          <p className="w-full text-xs text-ink-soft">Please use a nickname rather than your child&apos;s full real name.</p>
        </form>
      </section>

      <section id="resources" className="grid gap-4 md:grid-cols-3" aria-label="Resources">
        <Link href="/printables/certificate" className="card flex items-center gap-3 p-5 hover:-translate-y-0.5">
          <Printer className="text-royal" aria-hidden /> <span className="font-bold text-royal-dark">Download a learning certificate</span>
        </Link>
        <Link href="/printables/family-discussion" className="card flex items-center gap-3 p-5 hover:-translate-y-0.5">
          <BookOpen className="text-royal" aria-hidden /> <span className="font-bold text-royal-dark">Family discussion guides</span>
        </Link>
        <Link href="/jesus#who" className="card flex items-center gap-3 p-5 hover:-translate-y-0.5">
          <ShieldCheck className="text-royal" aria-hidden /> <span className="font-bold text-royal-dark">Our doctrinal approach</span>
        </Link>
      </section>

      <section className="card space-y-2 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-royal-dark">
          <Gift aria-hidden /> Support Kingdom Quest Academy (optional)
        </h2>
        <p className="text-ink">Everything here is free and always will be. If you&apos;d like to help us create more lessons, an optional adult donation is welcome. This is shown only to signed-in parents, never to children.</p>
        {donationUrl ? (
          <a href={donationUrl} target="_blank" rel="noopener noreferrer" className="btn-toy inline-flex bg-sun text-ink">
            Make a donation
          </a>
        ) : (
          <p className="text-sm text-ink-soft">Donations aren&apos;t set up yet.</p>
        )}
      </section>

      <section id="data" className="card space-y-3 p-6" aria-labelledby="data-title">
        <h2 id="data-title" className="text-2xl font-bold text-royal-dark">
          Your data
        </h2>
        <p className="text-ink">Download everything we store about your family, or delete your account and all child data permanently.</p>
        <div className="flex flex-wrap gap-3">
          <a href="/api/parent/export" className="btn-toy bg-royal text-white" data-testid="export-data">
            <Download aria-hidden /> Export my data
          </a>
          <PrimaryButton
            tone="coral"
            icon={<Trash2 aria-hidden />}
            onClick={() =>
              setConfirm({
                title: "Delete your whole account?",
                message: "This permanently deletes your parent account, every child profile and all learning progress. It can't be undone.",
                label: "Delete everything",
                run: async () => {
                  await api("/api/parent/account", "DELETE");
                  unlink();
                  router.push("/");
                },
              })
            }
          >
            Delete account
          </PrimaryButton>
        </div>
      </section>

      <ConfirmationDialog
        open={Boolean(confirm)}
        danger
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.label ?? "Yes"}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const c = confirm;
          setConfirm(null);
          if (c) run(c.run);
        }}
      />
    </div>
  );
}

function ChildCard({ c, active, onStart, onRun, onConfirm }: { c: ChildSummary; active: boolean; onStart: () => void; onRun: (fn: () => Promise<unknown>) => void; onConfirm: (x: { title: string; message: string; label: string; run: () => Promise<void> }) => void }) {
  const [open, setOpen] = useState(false);
  const settings = { ...DEFAULT_SETTINGS, ...c.settings };
  const save = (patch: Record<string, unknown>) => onRun(() => api(`/api/children/${c.id}`, "PATCH", patch));
  const toggles: [keyof ChildSettings, string][] = [
    ["sound", "Sound effects"],
    ["music", "Calm music (Prayer Garden)"],
    ["gamification", "Stars, badges and celebrations"],
    ["reducedMotion", "Calm motion (fewer animations)"],
    ["timers", "Game timers on by default"],
    ["easyFont", "Easy-read font"],
    ["highContrast", "High contrast"],
    ["minimalReading", "Fewer words"],
  ];
  return (
    <article className="card overflow-hidden" data-testid={`child-${c.nickname}`}>
      <div className="flex flex-wrap items-center gap-4 p-5">
        <Mascot id={(c.avatar as MascotId) ?? "leo"} size={72} animate="none" />
        <div className="mr-auto">
          <h3 className="text-2xl font-bold text-royal-dark">{c.nickname}</h3>
          <p className="text-sm text-ink-soft">
            {LEVELS[c.level]?.name} · {LEVELS[c.level]?.ages}
            {active && <span className="ml-2 rounded-full bg-emerald px-2 py-0.5 text-xs font-bold text-white">Active on this device</span>}
          </p>
        </div>
        <dl className="grid grid-cols-4 gap-3 text-center">
          {[
            [BookOpen, "Lessons", c.lessons.length],
            [Star, "Stars", c.stars],
            [Sparkles, "Verses", c.verses.filter((v) => v.box >= 3).length],
            [Trophy, "Badges", c.badges.length],
          ].map(([Icon, label, n]) => {
            const I = Icon as typeof Star;
            return (
              <div key={label as string}>
                <I className="mx-auto text-royal" size={20} aria-hidden />
                <dd className="font-display text-2xl font-bold" data-testid={`child-${label}`}>
                  {n as number}
                </dd>
                <dt className="text-xs text-ink-soft">{label as string}</dt>
              </div>
            );
          })}
        </dl>
        <div className="flex flex-wrap gap-2">
          <PrimaryButton tone="sun" icon={<Play aria-hidden />} onClick={onStart} data-testid={`start-${c.nickname}`}>
            Start learning on this device
          </PrimaryButton>
          <SecondaryButton icon={<Settings aria-hidden />} onClick={() => setOpen(!open)} aria-expanded={open}>
            Details
          </SecondaryButton>
        </div>
      </div>
      {open && (
        <div className="grid gap-6 border-t border-ink/10 p-5 lg:grid-cols-3">
          <div className="space-y-3">
            <h4 className="font-display text-lg font-bold text-royal-dark">Learning history</h4>
            {c.history.length === 0 ? (
              <p className="text-sm text-ink-soft">No activity yet.</p>
            ) : (
              <ul className="space-y-1 text-sm" data-testid="child-history">
                {c.history.map((h, i) => (
                  <li key={i}>
                    <span className="text-ink-soft">{fmt(h.at)}</span> · <span className="font-semibold capitalize">{h.type}</span>: {h.title}
                  </li>
                ))}
              </ul>
            )}
            <h4 className="font-display text-lg font-bold text-royal-dark">Completed lessons</h4>
            <ul className="space-y-1 text-sm">
              {c.lessons.map((l) => (
                <li key={l.id}>
                  {l.title}: {l.score}/{l.total} first-try quiz answers ({fmt(l.at)}){l.outdated && " · lesson updated since"}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-display text-lg font-bold text-royal-dark">Bible topics covered</h4>
            <p className="text-sm">{c.topics.length ? c.topics.join(", ") : "None yet."}</p>
            <h4 className="font-display text-lg font-bold text-royal-dark">Memory verses</h4>
            <ul className="text-sm">
              {c.verses.length ? c.verses.map((v) => <li key={v.ref}>{v.ref}: {["new", "seen", "getting it", "learned", "strong", "super strong"][v.box]}</li>) : <li>None yet.</li>}
            </ul>
            <h4 className="font-display text-lg font-bold text-royal-dark">Games</h4>
            <ul className="text-sm">
              {c.games.length ? c.games.map((g) => <li key={g.title}>{g.title}: played {g.plays}, finished {g.wins}</li>) : <li>None yet.</li>}
            </ul>
            <p className="text-sm">Badges: {c.badges.join(", ") || "none yet"}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-display text-lg font-bold text-royal-dark">Settings</h4>
            <label className="block text-sm font-semibold">
              Learning level
              <select defaultValue={c.level} onChange={(e) => save({ level: e.target.value })} className="mt-1 block min-h-11 w-full rounded-2xl border-2 border-royal-soft px-3">
                {LEVEL_LIST.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.ages})
                  </option>
                ))}
              </select>
            </label>
            {toggles.map(([k, label]) => (
              <label key={k} className="flex min-h-10 items-center justify-between gap-3 text-sm">
                {label}
                <input type="checkbox" className="h-6 w-6" defaultChecked={Boolean(settings[k])} onChange={(e) => save({ settings: { [k]: e.target.checked } })} />
              </label>
            ))}
            <label className="block text-sm font-semibold">
              Screen-time break reminder
              <select defaultValue={settings.breakMinutes} onChange={(e) => save({ settings: { breakMinutes: Number(e.target.value) } })} className="mt-1 block min-h-11 w-full rounded-2xl border-2 border-royal-soft px-3">
                <option value={0}>Off</option>
                <option value={15}>After 15 minutes</option>
                <option value={20}>After 20 minutes</option>
                <option value={30}>After 30 minutes</option>
                <option value={45}>After 45 minutes</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Recommend a lesson
              <select defaultValue={settings.recommended[0] ?? ""} onChange={(e) => save({ settings: { recommended: e.target.value ? [e.target.value] : [] } })} className="mt-1 block min-h-11 w-full rounded-2xl border-2 border-royal-soft px-3">
                <option value="">No recommendation</option>
                {LESSONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-ink-soft">Settings apply the next time you press &quot;Start learning on this device&quot;.</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <SecondaryButton
                onClick={() =>
                  onConfirm({
                    title: `Reset ${c.nickname}'s progress?`,
                    message: "Stars, badges, lessons and game results will be cleared. The profile stays.",
                    label: "Reset progress",
                    run: async () => {
                      await api(`/api/children/${c.id}`, "POST");
                    },
                  })
                }
              >
                Reset progress
              </SecondaryButton>
              <PrimaryButton
                tone="coral"
                icon={<Trash2 size={18} aria-hidden />}
                onClick={() =>
                  onConfirm({
                    title: `Delete ${c.nickname}'s profile?`,
                    message: "This permanently deletes the profile and all of its learning data.",
                    label: "Delete profile",
                    run: async () => {
                      await api(`/api/children/${c.id}`, "DELETE");
                    },
                  })
                }
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
