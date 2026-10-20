import type { Metadata } from "next";
import { InfoPage } from "@/components/layout/InfoPage";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <InfoPage title="Contact Us" intro="We'd love to hear from parents, churches and teachers. This page is for grown-ups.">
      <section>
        <h2>Email</h2>
        {BRAND.contactEmail ? (
          <p>
            Write to us at{" "}
            <a href={`mailto:${BRAND.contactEmail}`} className="font-bold text-royal underline">
              {BRAND.contactEmail}
            </a>
            .
          </p>
        ) : (
          <p>Our contact address will be published here before launch. (Site owners: set NEXT_PUBLIC_CONTACT_EMAIL.)</p>
        )}
        <p>Please don&apos;t send us children&apos;s personal information. For data requests, you can export or delete data yourself in the Parent Dashboard.</p>
      </section>
      <section>
        <h2>Report a content concern</h2>
        <p>If you think a lesson contains a mistake about the Bible, or anything that isn&apos;t right for children, tell us the page and what you noticed. Every lesson goes through theological review, and we fix errors quickly.</p>
      </section>
    </InfoPage>
  );
}
