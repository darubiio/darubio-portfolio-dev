import type { ReactNode } from "react";
import type { Viewport } from "next";
import { Fira_Code } from "next/font/google";
import { metadata as siteMetadata, jsonLd } from "@/lib/seo";
import "@/styles/tokens.css";
import "@/styles/app.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata = siteMetadata;

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#15171c" },
    { media: "(prefers-color-scheme: light)", color: "#d3d5da" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("rubio-theme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}if(navigator.userAgentData)document.documentElement.classList.add("lg");})();`;

const langScript = `(function(){try{var l=localStorage.getItem("rubio-lang")==="es"?"es":"en";document.documentElement.setAttribute("lang",l);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={firaCode.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
