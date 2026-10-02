import PDFDocument from "pdfkit";
import type { Lang } from "@/lib/i18n/types";
import type { Portfolio } from "@/lib/types";
import { externalUrl, SITE_URL } from "@/lib/site";

/**
 * ATS-first CV, rendered from the same data as the site so the two never drift.
 * Layout rules that keep automated parsers happy: one column, real (selectable)
 * text in a standard font, conventional section titles, no tables, images,
 * icons or header/footer blocks, contact details in the body, consistent dates,
 * and a per-role "Tech" line that repeats the exact keywords recruiters search for.
 */

const LABELS = {
  en: {
    summary: "Professional Summary",
    experience: "Professional Experience",
    projects: "Selected Projects",
    skills: "Technical Skills",
    education: "Education",
    languages: "Languages",
    tech: "Tech",
    sector: "Sector",
    portfolio: "Portfolio",
  },
  es: {
    summary: "Perfil Profesional",
    experience: "Experiencia Profesional",
    projects: "Proyectos Destacados",
    skills: "Habilidades Técnicas",
    education: "Formación",
    languages: "Idiomas",
    tech: "Tecnologías",
    sector: "Sector",
    portfolio: "Portfolio",
  },
} satisfies Record<Lang, Record<string, string>>;

const FONT = "Helvetica";
const BOLD = "Helvetica-Bold";
const OBLIQUE = "Helvetica-Oblique";
const INK = "#1a1c22";
const MUTED = "#555b66";
const ACCENT = "#1f4e8c";
const MARGIN = 46;

/**
 * The standard PDF fonts only cover Windows-1252. Swap the few characters outside
 * it for equivalents, so nothing renders as a broken glyph (or confuses a parser).
 */
function clean(text: string): string {
  return text
    .replace(/[→⇒]/g, "->")
    .replace(/[≈~]/g, "~")
    .replace(/[^\u0000-ÿŒœŠšŸŽžƒˆ˜–—‘-„†-•…‰‹›€™]/g, "");
}

const bare = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function renderCv(data: Portfolio, lang: Lang): Promise<Buffer> {
  const L = LABELS[lang];
  const { identity, about, experience, projects, skills, education, languages, contact } = data;
  const allSkills = skills.flatMap((group) => group.items);

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    lang: lang === "es" ? "es-ES" : "en-GB",
    displayTitle: true,
    info: {
      Title: `${identity.fullName} - CV`,
      Author: identity.fullName,
      Subject: `${identity.role} · ${identity.stack}`,
      Keywords: allSkills.join(", "),
      Creator: SITE_URL,
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const width = doc.page.width - MARGIN * 2;
  const left = MARGIN;
  const bottom = () => doc.page.height - MARGIN;
  const ensure = (space: number) => {
    if (doc.y + space > bottom()) doc.addPage();
  };

  const section = (title: string) => {
    ensure(70);
    doc.moveDown(0.7);
    doc.font(BOLD).fontSize(10.5).fillColor(ACCENT).text(clean(title.toUpperCase()), left, doc.y, { characterSpacing: 0.6 });
    const y = doc.y + 1.5;
    doc.moveTo(left, y).lineTo(left + width, y).lineWidth(0.6).strokeColor(ACCENT).stroke();
    doc.y = y + 5;
    doc.fillColor(INK);
  };

  const paragraph = (text: string, size = 9.6) => {
    doc.font(FONT).fontSize(size).fillColor(INK).text(clean(text), left, doc.y, { width, lineGap: 1.6, align: "left" });
  };

  const bullet = (text: string) => {
    const indent = 11;
    const y = doc.y;
    doc.font(FONT).fontSize(9.6).fillColor(INK).text("•", left + 2, y, { lineBreak: false });
    doc.text(clean(text), left + indent, y, { width: width - indent, lineGap: 1.6 });
    doc.moveDown(0.15);
  };

  const labelled = (label: string, value: string) => {
    doc.font(BOLD).fontSize(9.4).fillColor(INK).text(`${clean(label)}: `, left, doc.y, { continued: true, width, lineGap: 1.6 });
    doc.font(FONT).text(clean(value));
  };

  // Header — plain text in the body (ATS often skip real PDF headers).
  doc.font(BOLD).fontSize(21).fillColor(INK).text(clean(identity.fullName), left, MARGIN, { width });
  doc.moveDown(0.15);
  doc.font(BOLD).fontSize(11.5).fillColor(ACCENT).text(clean(`${identity.role} · ${identity.stack}`), { width });
  doc.moveDown(0.3);

  const links: Array<{ text: string; url?: string }> = [
    { text: contact.location },
    { text: contact.phone, url: `tel:${contact.phone.replace(/\s/g, "")}` },
    { text: contact.email, url: `mailto:${contact.email}` },
    { text: bare(contact.linkedin), url: externalUrl(contact.linkedin) },
    { text: bare(contact.github), url: externalUrl(contact.github) },
    { text: bare(SITE_URL), url: SITE_URL },
  ].filter((item) => item.text);
  doc.font(FONT).fontSize(9.2).fillColor(MUTED);
  links.forEach((item, index) => {
    const last = index === links.length - 1;
    doc.text(clean(item.text), { continued: !last, link: item.url ?? null, width });
    if (!last) doc.text("  ·  ", { continued: true, link: null });
  });

  section(L.summary);
  paragraph(about.filter(Boolean).join(" ").replace(/\s+/g, " "));

  // Keywords early: parsers weight them and recruiters scan the top third first.
  section(L.skills);
  skills.forEach((group) => {
    labelled(group.group, group.items.join(", "));
    doc.moveDown(0.1);
  });

  section(L.experience);
  experience.forEach((job, index) => {
    ensure(64);
    if (index > 0) doc.moveDown(0.55);
    const y = doc.y;
    const period = clean(job.period.replace(/\s*—\s*/, " – "));
    doc.font(FONT).fontSize(9.4).fillColor(MUTED);
    const periodWidth = doc.widthOfString(period);
    doc.font(BOLD).fontSize(10.4).fillColor(INK).text(clean(`${job.role} | ${job.company}`), left, y, {
      width: width - periodWidth - 12,
    });
    const afterTitle = doc.y;
    doc.font(FONT).fontSize(9.4).fillColor(MUTED).text(period, left + width - periodWidth, y + 1, { lineBreak: false });
    doc.y = afterTitle;
    doc.font(OBLIQUE).fontSize(9).fillColor(MUTED).text(clean(`${job.place} · ${L.sector}: ${job.sector}`), left, doc.y, { width });
    doc.moveDown(0.25);
    job.points.forEach(bullet);
    doc.font(BOLD).fontSize(9).fillColor(MUTED).text(`${L.tech}: `, left + 11, doc.y, { continued: true, width: width - 11 });
    doc.font(FONT).text(clean(job.stack.join(", ")));
  });

  // Public products only: client and employer work is already covered under experience.
  const showcased = projects.filter((project) => project.link);
  if (showcased.length > 0) {
    section(L.projects);
    showcased.forEach((project, index) => {
      ensure(48);
      if (index > 0) doc.moveDown(0.45);
      doc.font(BOLD).fontSize(10.2).fillColor(INK).text(clean(`${project.name} | ${project.kind} (${project.year})`), left, doc.y, {
        continued: Boolean(project.link),
        width,
      });
      if (project.link) {
        doc.font(FONT).fontSize(9.4).fillColor(ACCENT).text(`  ${bare(project.link)}`, { link: externalUrl(project.link) });
      }
      doc.moveDown(0.2);
      paragraph(project.blurb);
      doc.moveDown(0.15);
      doc.font(BOLD).fontSize(9).fillColor(MUTED).text(`${L.tech}: `, left, doc.y, { continued: true, width });
      doc.font(FONT).text(clean(project.stack.join(", ")));
    });
  }

  section(L.education);
  doc.font(BOLD).fontSize(10).fillColor(INK).text(clean(education.degree), left, doc.y, { width });
  doc.font(FONT).fontSize(9.4).fillColor(MUTED).text(clean(`${education.school} · ${education.place}`), { width });

  section(L.languages);
  paragraph(languages.map((language) => `${language.name}: ${language.level}`).join("   ·   "));

  doc.end();
  return done;
}
