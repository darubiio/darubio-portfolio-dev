"use client";

import { useLang } from "@/hooks/useLang";
import { messages, type Messages } from "@/lib/i18n/messages";

export function useMessages(): Messages {
  return messages[useLang().lang];
}
