import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${portfolio.identity.name} — Terminal Portfolio`,
    short_name: portfolio.identity.name,
    description: portfolio.identity.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#15171c",
    theme_color: "#15171c",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
