import { Mascot } from "@/components/characters/Mascot";
import { PrimaryButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-16 text-center">
      <Mascot id="finn" size={150} expression="thinking" />
      <h1 className="text-4xl font-bold text-royal-dark">This page swam away!</h1>
      <p className="text-lg text-ink-soft">We couldn&apos;t find that page. Let&apos;s head back to the adventure.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <PrimaryButton href="/" tone="sun">
          Home
        </PrimaryButton>
        <PrimaryButton href="/learn" tone="royal">
          My Quest
        </PrimaryButton>
      </div>
    </div>
  );
}
