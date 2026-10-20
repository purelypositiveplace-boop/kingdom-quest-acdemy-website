/** Public site settings. Branding lives here so it can be changed in one place. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const BRAND = {
  name: "Kingdom Quest Academy",
  slogan: "BIG FAITH. BIG ADVENTURES. ENDLESS DISCOVERIES.",
  tagline: "100% free Christian Bible learning for children ages 3–12.",
  world: "Kingdom Quest World",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
};

/** Optional adult donation link. Shown only inside the parent area, never to children. */
export const DONATION_URL = process.env.DONATION_URL ?? "";
