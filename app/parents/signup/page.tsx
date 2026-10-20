import type { Metadata } from "next";
import { AuthForm } from "@/components/parents/AuthForm";

export const metadata: Metadata = { title: "Create a Parent Account", robots: { index: false } };

export default function SignupPage() {
  return (
    <div className="px-4 py-10">
      <AuthForm mode="signup" />
    </div>
  );
}
