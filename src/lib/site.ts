export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://darubio.dev").replace(/\/$/, "");

export function asset(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function externalUrl(value: string): string {
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}
