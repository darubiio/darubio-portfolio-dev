import { renderCv } from "@/lib/cv/render";
import { getPortfolio } from "@/lib/i18n/getPortfolio";
import { LANGS, type Lang } from "@/lib/i18n/types";

// Rendered once per language at build time from the portfolio data, then served as a static file.
export const dynamic = "force-static";
export const dynamicParams = false;

/** File name → language, taken from each language's `contact.cv` so the links and the files never disagree. */
const FILES = new Map<string, Lang>(LANGS.map((lang) => [getPortfolio(lang).contact.cv.split("/").pop()!, lang]));

export function generateStaticParams() {
  return [...FILES.keys()].map((file) => ({ file }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }): Promise<Response> {
  const { file } = await params;
  const lang = FILES.get(file);
  if (!lang) return new Response("not found", { status: 404 });

  const pdf = await renderCv(getPortfolio(lang), lang);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file}"`,
    },
  });
}
