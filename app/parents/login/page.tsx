import type { Metadata } from "next";
import { AuthForm } from "@/components/parents/AuthForm";

export const metadata: Metadata = { title: "Parent Sign In", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="px-4 py-10">
      <AuthForm mode="login" />
    </div>
  );
}
