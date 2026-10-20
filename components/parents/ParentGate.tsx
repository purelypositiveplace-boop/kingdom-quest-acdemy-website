"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { PrimaryButton } from "@/components/ui/Button";

/** Password re-check before parent-only settings. A child tapping around can't get past it. */
export function ParentGate({ email }: { email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => ({}))).error ?? "That didn't work.");
  }
  return (
    <div className="px-4 py-10">
      <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6 text-center">
        <Lock className="mx-auto text-royal" size={48} aria-hidden />
        <h1 className="text-3xl font-bold text-royal-dark">Grown-ups only</h1>
        <p className="text-ink-soft">Enter the parent password for {email} to open the Parent Dashboard.</p>
        <label className="block text-left font-semibold">
          Password
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-2xl border-4 border-royal-soft px-4 py-3 outline-none focus:border-royal" data-testid="gate-password" />
        </label>
        {error && <p role="alert" className="font-semibold text-coral">{error}</p>}
        <PrimaryButton type="submit" tone="royal" className="w-full">
          Unlock
        </PrimaryButton>
        <PrimaryButton href="/learn" tone="white" className="w-full">
          I&apos;m a kid. Take me back!
        </PrimaryButton>
      </form>
    </div>
  );
}
