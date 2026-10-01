import type { Portfolio } from "@/lib/types";
import { portfolio } from "@/lib/portfolio";
import { portfolioEs } from "@/lib/i18n/portfolio.es";
import type { Lang } from "@/lib/i18n/types";

const PORTFOLIOS: Record<Lang, Portfolio> = { en: portfolio, es: portfolioEs };

export function getPortfolio(lang: Lang): Portfolio {
  return PORTFOLIOS[lang];
}
