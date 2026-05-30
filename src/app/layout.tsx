import type { ReactNode } from "react";
import { Fira_Code } from "next/font/google";
import { metadata as siteMetadata, personJsonLd } from "@/lib/seo";
import "@/styles/tokens.css";
import "@/styles/app.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata = siteMetadata;

const themeScript = `(function(){try{var t=localStorage.getItem("rubio-theme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={firaCode.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
