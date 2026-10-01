"use client";

import { useLang } from "@/hooks/useLang";
import { getPortfolio } from "@/lib/i18n/getPortfolio";

export function usePortfolio() {
  return getPortfolio(useLang().lang);
}
