import Link from "next/link";
import { LogoMark } from "./Logo";

const GROUPS = [
  { title: "Learn", links: [["/stories", "Bible Stories"], ["/games", "Games"], ["/verses", "Memory Verses"], ["/bible", "Bible Reader"], ["/jesus", "Learn About Jesus"]] },
  { title: "Explore", links: [["/world", "Kingdom Quest World"], ["/map", "Bible Map"], ["/timeline", "Timeline"], ["/prayer", "Prayer Garden"], ["/printables", "Printables"]] },
  { title: "Grown-ups", links: [["/parents", "Parent Dashboard"], ["/about", "About Us"], ["/safety", "Safety"], ["/privacy", "Privacy"], ["/terms", "Terms"], ["/contact", "Contact"]] },
];

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 bg-royal-dark pb-24 text-white lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark size={48} />
            <span className="font-display text-xl font-bold">Kingdom Quest Academy</span>
          </div>
          <p className="mt-3 font-display font-semibold text-sun">BIG FAITH. BIG ADVENTURES. ENDLESS DISCOVERIES.</p>
          <p className="mt-2 text-sm text-white/80">100% free Christian Bible learning for children ages 3–12. No ads, no subscriptions, no chat, no public profiles.</p>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h2 className="font-display text-lg font-bold text-sun">{g.title}</h2>
            <ul className="mt-2 space-y-1">
              {g.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-block py-1 text-white/90 hover:text-white hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/70">
        Scripture quotations are from the World English Bible (public domain). Leo, Sunny, Oliver, Grace and Finn are original Kingdom Quest Academy characters, not people from the Bible.
      </div>
    </footer>
  );
}
