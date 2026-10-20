import type { Metadata } from "next";
import { Onboarding } from "@/components/layout/Onboarding";

export const metadata: Metadata = {
  title: "Start Your Kingdom Quest",
  robots: { index: false },
};

export default function StartPage() {
  return <Onboarding />;
}
