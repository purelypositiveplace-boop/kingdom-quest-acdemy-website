import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { SiteHeader, ChildNavigation } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AccessibilityApplier } from "@/components/accessibility/AccessibilityApplier";
import { RewardCelebration } from "@/components/rewards/RewardCelebration";
import { BreakReminder } from "@/components/accessibility/BreakReminder";
import { SITE_URL } from "@/lib/site";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const atkinson = Atkinson_Hyperlegible({ subsets: ["latin"], variable: "--font-atkinson", weight: ["400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kingdom Quest Academy — Free Bible Lessons, Stories & Games for Kids",
    template: "%s · Kingdom Quest Academy",
  },
  description:
    "BIG FAITH. BIG ADVENTURES. ENDLESS DISCOVERIES. 100% free Christian Bible learning for children ages 3–12: interactive Bible stories, games, memory verses, a Prayer Garden and printable activities. No ads.",
  applicationName: "Kingdom Quest Academy",
  openGraph: {
    type: "website",
    siteName: "Kingdom Quest Academy",
    title: "Kingdom Quest Academy — Free Bible learning for kids",
    description: "Interactive Bible stories, games and memory verses for ages 3–12. 100% free, no ads.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#2a48d4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${atkinson.variable}`}>
      <body className="min-h-screen antialiased">
        <AccessibilityApplier />
        <SiteHeader />
        <main id="main" className="min-h-[70vh] pb-24 lg:pb-8">
          {children}
        </main>
        <SiteFooter />
        <ChildNavigation />
        <RewardCelebration />
        <BreakReminder />
      </body>
    </html>
  );
}
