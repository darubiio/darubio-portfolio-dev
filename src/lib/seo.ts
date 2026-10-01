import type { Metadata } from "next";
import { portfolio } from "@/lib/portfolio";
import { SITE_URL, externalUrl } from "@/lib/site";

const { identity, contact } = portfolio;

const title = `${identity.name} — ${identity.role}`;
const description = `${identity.role} · ${identity.stack}. ${identity.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s · ${identity.name}`,
  },
  description,
  applicationName: `${identity.name} — Terminal Portfolio`,
  authors: [{ name: identity.fullName, url: SITE_URL }],
  creator: identity.fullName,
  keywords: [
    identity.name,
    identity.role,
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Frontend",
    "Full-stack",
    "Madrid",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `${identity.name} — Terminal Portfolio`,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const personId = `${SITE_URL}/#person`;

export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: identity.fullName,
        alternateName: identity.name,
        jobTitle: identity.role,
        description,
        url: SITE_URL,
        email: `mailto:${contact.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Madrid",
          addressCountry: "ES",
        },
        knowsAbout: portfolio.skills.flatMap((group) => group.items),
        knowsLanguage: portfolio.languages.map((language) => language.name),
        hasOccupation: { "@type": "Occupation", name: identity.role },
        worksFor: { "@type": "Organization", name: portfolio.experience[0].company },
        sameAs: [externalUrl(contact.linkedin), externalUrl(contact.github)],
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: title,
        inLanguage: ["en", "es"],
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${identity.name} — Terminal Portfolio`,
        description,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
    ],
  };
}
