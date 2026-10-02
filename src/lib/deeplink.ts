import { resolveCommand } from "@/lib/commands";

/** Reads a `?cmd=` deep-link (English or Spanish name), returning the command it maps to, if any. */
export function readInitialCommand(): string | null {
  if (typeof window === "undefined") return null;
  const cmd = new URLSearchParams(window.location.search).get("cmd")?.toLowerCase();
  if (!cmd) return null;
  return resolveCommand(cmd);
}

/** Reflects the current command into the URL so the view is shareable. */
export function syncCommandToUrl(name: string | null): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (name && name !== "welcome") url.searchParams.set("cmd", name);
  else url.searchParams.delete("cmd");
  window.history.replaceState(null, "", url);
}
