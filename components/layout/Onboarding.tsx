"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Gamepad2, Grid3x3, Home, Map, ShieldCheck, Sparkles } from "lucide-react";
import { useHydrated, useKQ } from "@/lib/progress/store";
import type { AgeLevel, MascotId } from "@/lib/curriculum/types";
import { Mascot } from "@/components/characters/Mascot";
import { CharacterBubble } from "@/components/characters/CharacterBubble";
import { PrimaryButton } from "@/components/ui/Button";
import { AgeSelector } from "@/components/ui/AgeSelector";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { StepDots } from "@/components/ui/ProgressTracker";
import { WORLDS, STARTER_WORLDS } from "@/data/worlds";
import { MASCOTS, MASCOT_NOTE } from "@/data/mascots";
import { SceneArt } from "@/components/bible/SceneArt";

const NICKNAMES = ["Little Lion", "Star Explorer", "Brave Heart", "Sunny Sprout", "Quest Hero", "Joy Seeker"];
const AVATARS: MascotId[] = ["leo", "sunny", "oliver", "grace", "finn"];

/** First-time flow for a child (with a grown-up nearby) or a parent. Guest mode needs no account. */
export function Onboarding() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useKQ((s) => s.profile);
  const setProfile = useKQ((s) => s.setProfile);
  const finish = useKQ((s) => s.finishOnboarding);
  const [who, setWho] = useState<"kid" | "parent" | null>(null);
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<MascotId>("leo");
  const [level, setLevel] = useState<AgeLevel | undefined>(undefined);

  useEffect(() => {
    if (!hydrated || !profile) return;
    setLevel(profile.level);
    if (profile.nickname && profile.nickname !== "Friend") setNickname(profile.nickname);
    setAvatar((profile.avatar as MascotId) ?? "leo");
  }, [hydrated, profile]);

  if (who === null)
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="card p-6 text-center md:p-10">
          <Mascot id="leo" size={170} expression="excited" animate="bounce" className="mx-auto" />
          <h1 className="mt-4 text-4xl font-bold text-royal-dark md:text-5xl">Welcome to Kingdom Quest Academy!</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-ink-soft">Big faith. Big adventures. Endless discoveries. Who&apos;s getting started today?</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button type="button" onClick={() => setWho("kid")} className="card flex min-h-40 flex-col items-center justify-center gap-2 p-6 transition hover:-translate-y-1" data-testid="who-kid">
              <Mascot id="sunny" size={90} />
              <span className="font-display text-2xl font-bold text-royal-dark">I&apos;m a kid!</span>
              <span className="text-ink-soft">Let&apos;s start my quest</span>
            </button>
            <button type="button" onClick={() => setWho("parent")} className="card flex min-h-40 flex-col items-center justify-center gap-2 p-6 transition hover:-translate-y-1">
              <Mascot id="grace" size={90} expression="calm" />
              <span className="font-display text-2xl font-bold text-royal-dark">I&apos;m a grown-up</span>
              <span className="text-ink-soft">Learn how it works and set up</span>
            </button>
          </div>
        </div>
      </div>
    );

  if (who === "parent") return <ParentWelcome onKid={() => setWho("kid")} />;

  const steps = ["name", "level", "comfort", "tour", "world"] as const;
  const s = steps[step];
  const nextStep = () => setStep((n) => Math.min(steps.length - 1, n + 1));

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <StepDots count={steps.length} current={step} label="Getting started" />
      <div className="card p-6 md:p-10">
        {s === "name" && (
          <div className="space-y-6">
            <CharacterBubble id="leo" size={110} expression="excited">
              Hi, I&apos;m Leo! What should I call you? A fun nickname is perfect. You don&apos;t need your real name!
            </CharacterBubble>
            <label className="block">
              <span className="font-display text-xl font-bold text-royal-dark">Your adventure name</span>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 20))}
                maxLength={20}
                placeholder="Star Explorer"
                autoComplete="off"
                className="mt-2 block w-full rounded-2xl border-4 border-royal-soft bg-white px-4 py-3 font-display text-2xl outline-none focus:border-royal"
                data-testid="nickname"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {NICKNAMES.map((n) => (
                <button key={n} type="button" onClick={() => setNickname(n)} className="min-h-12 rounded-full bg-sky-soft px-4 font-display font-semibold text-royal-dark hover:bg-sky">
                  {n}
                </button>
              ))}
            </div>
            <fieldset>
              <legend className="font-display text-xl font-bold text-royal-dark">Pick your buddy picture</legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {AVATARS.map((a) => (
                  <button key={a} type="button" aria-pressed={avatar === a} aria-label={MASCOTS[a].name} onClick={() => setAvatar(a)} className={`rounded-3xl border-4 bg-white p-1 ${avatar === a ? "border-royal ring-4 ring-sun" : "border-transparent"}`}>
                    <Mascot id={a} size={72} animate="none" />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-soft">{MASCOT_NOTE}</p>
            </fieldset>
          </div>
        )}
        {s === "level" && (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-royal-dark">How old are you?</h1>
            <p className="text-ink-soft">This picks your learning level. A grown-up can change it any time.</p>
            <AgeSelector selected={level} onPick={(l) => setLevel(l)} />
          </div>
        )}
        {s === "comfort" && (
          <div className="space-y-4">
            <CharacterBubble id="grace" size={90} expression="calm">
              Would you like bigger letters or calmer pictures? You can skip this.
            </CharacterBubble>
            <AccessibilityControls />
          </div>
        )}
        {s === "tour" && (
          <div className="space-y-5">
            <CharacterBubble id="oliver" size={100} expression="happy">
              Hoo! Here&apos;s how to get around. These big buttons are always at the bottom (or top) of the screen.
            </CharacterBubble>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Home, t: "My Quest", d: "Your stars, badges and what to do next." },
                { icon: BookOpen, t: "Stories", d: "Bible stories with pictures and quizzes." },
                { icon: Map, t: "World", d: "Explore the lands of Kingdom Quest World." },
                { icon: Gamepad2, t: "Games", d: "Fun games that teach the Bible." },
                { icon: Sparkles, t: "Verses", d: "Learn Bible verses by heart." },
                { icon: Grid3x3, t: "More", d: "Prayer Garden, Bible map, songs and more." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-sky-soft p-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow">
                    <Icon size={30} className="text-royal" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-royal-dark">{t}</span>
                    <span className="text-sm text-ink-soft">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {s === "world" && (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-royal-dark">Choose your first adventure!</h1>
            <div className="grid gap-4 md:grid-cols-3">
              {WORLDS.filter((w) => STARTER_WORLDS.includes(w.id)).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  data-testid={`start-world-${w.id}`}
                  onClick={() => {
                    setProfile({ nickname: nickname.trim() || "Friend", avatar, level: level ?? "explorers", world: w.id });
                    finish();
                    router.push("/learn");
                  }}
                  className="card overflow-hidden text-left transition hover:-translate-y-1"
                >
                  <SceneArt theme={w.theme} props={[]} alt="" className="h-28 w-full" />
                  <span className="block p-4">
                    <span className="block font-display text-xl font-bold text-royal-dark">{w.name}</span>
                    <span className="text-sm text-ink-soft">{w.tagline}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <PrimaryButton tone="white" icon={<ArrowLeft aria-hidden />} onClick={() => (step === 0 ? setWho(null) : setStep(step - 1))}>
          Back
        </PrimaryButton>
        {s !== "world" && (
          <PrimaryButton
            tone="royal"
            size="lg"
            icon={<ArrowRight aria-hidden />}
            data-testid="onboard-next"
            disabled={s === "level" && !level}
            onClick={() => {
              if (s === "name") setProfile({ nickname: nickname.trim() || "Friend", avatar });
              nextStep();
            }}
          >
            {s === "comfort" ? "Skip or continue" : "Next"}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

function ParentWelcome({ onKid }: { onKid: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="card space-y-5 p-6 md:p-10">
        <div className="flex items-center gap-4">
          <Mascot id="grace" size={100} expression="calm" />
          <h1 className="text-3xl font-bold text-royal-dark md:text-4xl">Welcome, grown-ups!</h1>
        </div>
        <p className="text-lg text-ink">Kingdom Quest Academy is a free Bible-learning adventure for ages 3–12, with interactive storybooks, quizzes, 16 learning games, memory verses, a Prayer Garden and printable activities. Bible text comes from the public-domain World English Bible and is always clearly labelled.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-sky-soft p-5">
            <h2 className="text-xl font-bold text-royal-dark">Try it as a guest</h2>
            <p className="mt-1 text-ink">No account, no email. Progress is saved only in this browser and nothing about your child is sent to us.</p>
            <PrimaryButton tone="sun" className="mt-4" onClick={onKid}>
              Start a guest adventure
            </PrimaryButton>
          </div>
          <div className="rounded-3xl bg-emerald-soft p-5">
            <h2 className="text-xl font-bold text-royal-dark">Create a free parent account</h2>
            <p className="mt-1 text-ink">Add child profiles (nickname only), follow their progress across devices, control settings, export or delete data.</p>
            <PrimaryButton tone="emerald" className="mt-4" href="/parents/signup">
              Create parent account
            </PrimaryButton>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <ShieldCheck className="mt-1 shrink-0 text-emerald" aria-hidden />
          <p className="text-ink-soft">
            We collect as little as possible: no child emails, real names, locations, ads, chat or public profiles. Read our{" "}
            <Link href="/privacy" className="font-bold text-royal underline">
              privacy notice
            </Link>{" "}
            and{" "}
            <Link href="/safety" className="font-bold text-royal underline">
              safety approach
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
