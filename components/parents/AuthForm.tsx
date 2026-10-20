"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/Button";

/** Shared sign-in / sign-up form for parent accounts. Children never see or need this. */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adult, setAdult] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { email, password, adult, consent } : { email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push("/parents");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-1 block w-full rounded-2xl border-4 border-royal-soft bg-white px-4 py-3 text-lg outline-none focus:border-royal";
  return (
    <form onSubmit={submit} className="card mx-auto max-w-lg space-y-4 p-6 md:p-8" noValidate>
      <h1 className="text-3xl font-bold text-royal-dark">{mode === "signup" ? "Create a parent account" : "Parent sign in"}</h1>
      <p className="text-ink-soft">{mode === "signup" ? "Free forever. We only need an email and password, and we never ask for your child's real name or email." : "Welcome back!"}</p>
      <label className="block font-semibold">
        Email
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} data-testid="auth-email" />
      </label>
      <label className="block font-semibold">
        Password {mode === "signup" && <span className="font-normal text-ink-soft">(at least 10 characters)</span>}
        <input type="password" required minLength={mode === "signup" ? 10 : 1} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={field} data-testid="auth-password" />
      </label>
      {mode === "signup" && (
        <div className="space-y-3 rounded-2xl bg-sky-soft p-4 text-sm">
          <p className="font-bold text-royal-dark">Parental notice</p>
          <p className="text-ink">
            We store your email, a hashed password, and for each child a nickname, level, settings and learning progress. No ads, no trackers, no selling data. You can export or delete everything at any time. Read the{" "}
            <Link href="/privacy" className="font-bold text-royal underline" target="_blank">
              full privacy notice
            </Link>
            .
          </p>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-1 h-5 w-5" data-testid="auth-adult" />
            <span>I am 18 or older and the parent or guardian of the children I add.</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5" data-testid="auth-consent" />
            <span>I have read the parental notice and agree to Kingdom Quest Academy storing my children&apos;s learning progress as described.</span>
          </label>
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-2xl bg-coral-soft p-3 font-semibold text-ink">
          {error}
        </p>
      )}
      <PrimaryButton type="submit" tone="royal" size="lg" className="w-full" disabled={busy || (mode === "signup" && (!adult || !consent))} data-testid="auth-submit">
        {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
      </PrimaryButton>
      <p className="text-center text-sm">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/parents/login" className="font-bold text-royal underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/parents/signup" className="font-bold text-royal underline">
              Create a free account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
