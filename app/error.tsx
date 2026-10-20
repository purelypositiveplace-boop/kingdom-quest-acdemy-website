"use client";

import { ErrorState } from "@/components/ui/states";
import { PrimaryButton } from "@/components/ui/Button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="px-4 py-16">
      <ErrorState
        message="Something went wrong on our side. If you're offline, check your internet connection and try again."
        action={
          <div className="flex gap-3">
            <PrimaryButton tone="royal" onClick={reset}>
              Try again
            </PrimaryButton>
            <PrimaryButton tone="white" href="/">
              Home
            </PrimaryButton>
          </div>
        }
      />
    </div>
  );
}
