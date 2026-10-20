import type { Metadata } from "next";
import { Dashboard } from "@/components/layout/Dashboard";

export const metadata: Metadata = { title: "My Quest", robots: { index: false, follow: false } };

export default function LearnPage() {
  return <Dashboard />;
}
