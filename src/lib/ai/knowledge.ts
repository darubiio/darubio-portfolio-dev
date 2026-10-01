import { getPortfolio } from "@/lib/i18n/getPortfolio";
import type { Lang } from "@/lib/i18n/types";
import type { Portfolio } from "@/lib/types";

/**
 * Deterministic, zero-cost fallback used whenever the live model is
 * unavailable (AI disabled, missing key, over budget, provider error, or
 * rate-limited). Keyword-matched answers drawn straight from localized
 * portfolio data, so `ask` always returns something useful and on-message in
 * the visitor's language.
 */
interface Rule {
  match: RegExp;
  answer: () => string;
}

function buildRules(lang: Lang, p: Portfolio): Rule[] {
  const { identity, experience, projects, skills, contact, languages, education } = p;
  const es = lang === "es";

  return [
    {
      match: /\b(hire|available|availab|open to work|freelance|contract|disponib|contrat)\b/i,
      answer: () =>
        es
          ? `${identity.name} está ${identity.status.label.toLowerCase()}. Contáctale en ${contact.email} o ${contact.linkedin} — mira el comando contact.`
          : `${identity.name} is ${identity.status.label.toLowerCase()}. Reach him at ${contact.email} or ${contact.linkedin} — see the contact command.`,
    },
    {
      match: /\b(bank|caixa|fintech|finance|banca|financ)\b/i,
      answer: () =>
        es
          ? `Sí — es Ingeniero de Software en CaixaBank (banca) construyendo micro-frontends en React y plugins de Backstage a medida, con revisión y CI/CD de nivel bancario.`
          : `Yes — he's a Software Engineer at CaixaBank (banking) building React micro-frontends and custom Backstage plugins, with banking-grade review and CI/CD.`,
    },
    {
      match: /\b(react|frontend|front-end|next\.?js|typescript)\b/i,
      answer: () =>
        es
          ? `Su punto fuerte. ${identity.name} trabaja a diario con ${skills[0].items.slice(0, 6).join(", ")} — más de 6 años llevando React/Next.js a producción, incluidas arquitecturas de micro-frontends.`
          : `Core strength. ${identity.name} works daily in ${skills[0].items.slice(0, 6).join(", ")} — 6+ years shipping production React/Next.js, including micro-frontend architectures.`,
    },
    {
      match: /\b(backend|node|api|\.net|golang|\bgo\b|database|postgres|redis|sql|base de datos)\b/i,
      answer: () =>
        es
          ? `Es full-stack: ${skills[1].items.join(", ")} en backend, ${skills[2].items.join(", ")} para datos. Construyó sistemas políglotas en tiempo real (Node.js, .NET, Go) para los túneles de la M-30 de Madrid.`
          : `He's full-stack: ${skills[1].items.join(", ")} on the backend, ${skills[2].items.join(", ")} for data. Built polyglot real-time systems (Node.js, .NET, Go) for Madrid's M-30 tunnels.`,
    },
    {
      match: /\b(project|built|build|proyecto|portfolio work|construy)\b/i,
      answer: () =>
        es
          ? `Destacados: ${projects.map((p2) => `${p2.name} (${p2.kind})`).join(", ")}. Ejecuta el comando projects para capturas y detalles.`
          : `Highlights: ${projects.map((p2) => `${p2.name} (${p2.kind})`).join(", ")}. Run the projects command for screenshots and details.`,
    },
    {
      match: /\b(experience|years|senior|background|trayector|experiencia|años)\b/i,
      answer: () =>
        es
          ? `Más de 6 años en banca (CaixaBank), transporte (M-30 de Madrid, +1M de viajes diarios en producción) y logística. Actualmente ${experience[0].role} en ${experience[0].company}.`
          : `6+ years across banking (CaixaBank), transport (Madrid M-30, 1M+ daily trips in production) and logistics. Currently ${experience[0].role} at ${experience[0].company}.`,
    },
    {
      match: /\b(language|idioma|english|spanish|ingl|españ)\b/i,
      answer: () =>
        (es ? "Idiomas: " : "Languages: ") + languages.map((l) => `${l.name} (${l.level})`).join(", ") + ".",
    },
    {
      match: /\b(study|degree|education|university|estudi|carrera|título|titulac)\b/i,
      answer: () => `${education.degree} — ${education.school} (${education.place}).`,
    },
    {
      match: /\b(contact|email|reach|linkedin|github|contacto|correo)\b/i,
      answer: () =>
        es
          ? `Correo ${contact.email}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}. El comando contact lo tiene todo.`
          : `Email ${contact.email}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}. The contact command has it all.`,
    },
  ];
}

function defaultAnswer(lang: Lang, p: Portfolio): string {
  const { identity } = p;
  return lang === "es"
    ? `${identity.name} es ${identity.role} (${identity.stack}) con más de 6 años llevando a producción en banca, transporte y logística. Pregunta por su experiencia, proyectos, skills o disponibilidad — o prueba los comandos about, projects y contact.`
    : `${identity.name} is a ${identity.role} (${identity.stack}) with 6+ years shipping to production across banking, transport and logistics. Ask about his experience, projects, skills or availability — or try the about, projects and contact commands.`;
}

/** Fixed reply for detected injection / off-topic-steering attempts. */
export function refusal(lang: Lang): string {
  const name = getPortfolio(lang).identity.name;
  return lang === "es"
    ? `Solo respondo preguntas sobre ${name} — su experiencia, proyectos, skills y disponibilidad. Prueba los comandos about, projects o contact.`
    : `I only answer questions about ${name} — his experience, projects, skills and availability. Try the about, projects or contact commands.`;
}

export function cannedAnswer(question: string, lang: Lang): string {
  const p = getPortfolio(lang);
  const q = question.toLowerCase();
  for (const rule of buildRules(lang, p)) {
    if (rule.match.test(q)) return rule.answer();
  }
  return defaultAnswer(lang, p);
}
