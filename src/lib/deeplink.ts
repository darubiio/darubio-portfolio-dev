import { resolveCommand } from "@/lib/commands";

/** Reads a `?cmd=` deep-link, returning it only if it maps to a real command. */
export function readInitialCommand(): string | null {
  if (typeof window === "undefined") return null;
  const cmd = new URLSearchParams(window.location.search).get("cmd")?.toLowerCase();
  if (!cmd) return null;
  return resolveCommand(cmd) ? cmd : null;
}

/** Reflects the current command into the URL so the view is shareable. */
export function syncCommandToUrl(name: string | null): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (name && name !== "welcome") url.searchParams.set("cmd", name);
  else url.searchParams.delete("cmd");
  window.history.replaceState(null, "", url);
}
