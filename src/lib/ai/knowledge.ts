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
  /** Commands holding the evidence (rendered as chips). */
  cmd: string;
}

function buildRules(lang: Lang, p: Portfolio): Rule[] {
  const { identity, experience, projects, skills, contact, languages, education } = p;
  const es = lang === "es";

  return [
    {
      match: /\b(hire|available|availab|open to work|freelance|contract|disponib|contrat)/i,
      answer: () =>
        es
          ? `${identity.name} está ${identity.status.label.toLowerCase()}. Contáctale en ${contact.email} o ${contact.linkedin} — mira el comando contact.`
          : `${identity.name} is ${identity.status.label.toLowerCase()}. Reach him at ${contact.email} or ${contact.linkedin} — see the contact command.`,
      cmd: "contact",
    },
    {
      match: /\b(bank|caixa|fintech|finance|banca|financ)/i,
      answer: () =>
        es
          ? `Sí — es Ingeniero de Software en CaixaBank (banca) construyendo micro-frontends en React y plugins de Backstage a medida, con revisión y CI/CD de nivel bancario.`
          : `Yes — he's a Software Engineer at CaixaBank (banking) building React micro-frontends and custom Backstage plugins, with banking-grade review and CI/CD.`,
      cmd: "experience, projects",
    },
    {
      match: /\b(react|frontend|front-end|next\.?js|typescript)/i,
      answer: () =>
        es
          ? `Su punto fuerte. ${identity.name} trabaja a diario con ${skills[0].items.slice(0, 6).join(", ")} — más de 6 años llevando React/Next.js a producción, incluidas arquitecturas de micro-frontends.`
          : `Core strength. ${identity.name} works daily in ${skills[0].items.slice(0, 6).join(", ")} — 6+ years shipping production React/Next.js, including micro-frontend architectures.`,
      cmd: "skills, projects",
    },
    {
      match: /\b(backend|node|api|\.net|golang|\bgo\b|database|postgres|redis|sql|base de datos)/i,
      answer: () =>
        es
          ? `Es full-stack: ${skills[1].items.join(", ")} en backend, ${skills[2].items.join(", ")} para datos. Construyó sistemas políglotas en tiempo real (Node.js, .NET, Go) para los túneles de la M-30 de Madrid.`
          : `He's full-stack: ${skills[1].items.join(", ")} on the backend, ${skills[2].items.join(", ")} for data. Built polyglot real-time systems (Node.js, .NET, Go) for Madrid's M-30 tunnels.`,
      cmd: "skills, experience",
    },
    {
      match: /\b(project|built|build|proyecto|portfolio work|construy)/i,
      answer: () =>
        es
          ? `Destacados: ${projects.map((p2) => `${p2.name} (${p2.kind})`).join(", ")}. Ejecuta el comando projects para capturas y detalles.`
          : `Highlights: ${projects.map((p2) => `${p2.name} (${p2.kind})`).join(", ")}. Run the projects command for screenshots and details.`,
      cmd: "projects",
    },
    {
      match: /\b(experience|years|senior|background|trayector|experiencia|años)/i,
      answer: () =>
        es
          ? `Más de 6 años en banca (CaixaBank), transporte (M-30 de Madrid, +1M de viajes diarios en producción) y logística. Actualmente ${experience[0].role} en ${experience[0].company}.`
          : `6+ years across banking (CaixaBank), transport (Madrid M-30, 1M+ daily trips in production) and logistics. Currently ${experience[0].role} at ${experience[0].company}.`,
      cmd: "experience",
    },
    {
      match: /\b(language|idioma|english|spanish|ingl|españ)/i,
      answer: () =>
        (es ? "Idiomas: " : "Languages: ") + languages.map((l) => `${l.name} (${l.level})`).join(", ") + ".",
      cmd: "languages",
    },
    {
      match: /\b(study|degree|education|university|estudi|carrera|título|titulac)/i,
      answer: () => `${education.degree} — ${education.school} (${education.place}).`,
      cmd: "education",
    },
    {
      match: /\b(contact|email|reach|linkedin|github|contacto|correo)/i,
      answer: () =>
        es
          ? `Correo ${contact.email}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}. El comando contact lo tiene todo.`
          : `Email ${contact.email}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}. The contact command has it all.`,
      cmd: "contact",
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

const trailer = (cmd: string, next: string[]) => `\n---\ncmd: ${cmd}\nnext: ${next.join(" | ")}`;

function defaultNext(lang: Lang): string[] {
  return lang === "es"
    ? ["¿Qué hizo en CaixaBank Tech?", "¿Está disponible para trabajar?", "¿Qué proyectos ha construido?"]
    : ["What did he build at CaixaBank Tech?", "Is he open to work?", "Which projects has he shipped?"];
}

export function cannedAnswer(question: string, lang: Lang): string {
  const p = getPortfolio(lang);
  const q = question.toLowerCase();
  for (const rule of buildRules(lang, p)) {
    if (rule.match.test(q)) return rule.answer() + trailer(rule.cmd, defaultNext(lang));
  }
  return defaultAnswer(lang, p) + trailer("about, experience", defaultNext(lang));
}

/** Tech vocabulary a job description may mention that is NOT in the profile — reported as gaps. */
const OTHER_TECH = [
  "angular", "vue", "svelte", "python", "django", "flask", "java", "spring", "kotlin", "swift", "php", "laravel", "ruby",
  "rails", "c#", "c++", "rust", "scala", "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "graphql", "flutter",
  "android", "ios", "elixir", "kafka", "rabbitmq", "elasticsearch", "sass", "tailwind", "cypress", "playwright", "storybook",
  "webpack", "vite", "firebase", "supabase", "prisma", "nestjs", "express", "fastify", "nuxt", "remix", "gatsby",
];

const normalise = (term: string) => term.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, " ").trim();

/**
 * Deterministic `fit`: overlap between the job description and the profile's
 * skills/stacks. Used when the live model is unavailable, so recruiters always
 * get an honest, data-backed answer.
 */
export function cannedFit(jd: string, lang: Lang): string {
  const p = getPortfolio(lang);
  const es = lang === "es";
  const text = jd.toLowerCase();
  const has = (term: string) => {
    const t = normalise(term);
    return t.length > 1 && new RegExp(`(^|[^a-z0-9+#.])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9])`).test(text);
  };
  const known = new Map<string, string>();
  for (const group of p.skills) for (const item of group.items) known.set(normalise(item), item);
  for (const e of p.experience) for (const item of e.stack) known.set(normalise(item), item);
  for (const pr of p.projects) for (const item of pr.stack) known.set(normalise(item), item);
  const matched = [...known.values()].filter(has);
  const pretty = (t: string) =>
    ({ aws: "AWS", gcp: "GCP", php: "PHP", ios: "iOS", "c#": "C#", "c++": "C++", graphql: "GraphQL", nestjs: "NestJS", mongodb: "MongoDB" })[t] ??
    t.charAt(0).toUpperCase() + t.slice(1);
  const missing = OTHER_TECH.filter(has).map(pretty);
  const total = matched.length + missing.length;
  const score = total === 0 ? 5 : Math.max(1, Math.round((10 * matched.length) / total));
  const list = (items: string[]) => (items.length ? items.join(", ") : es ? "ninguna" : "none");

  const body = es
    ? `score: ${score}/10
Encaje: ${matched.length ? `Coincidencias directas: ${list(matched)}. ` : ""}${p.identity.name} lleva más de 6 años en producción en banca, transporte y logística con React, TypeScript, Next.js y Node.js.
Huecos: ${missing.length ? `La oferta menciona ${list(missing)}, que no aparecen en su perfil.` : "ninguno significativo según las tecnologías citadas."}
Cierre: ${p.identity.fullName} — ${p.identity.role}, ${p.identity.status.label.toLowerCase()}, Madrid.`
    : `score: ${score}/10
Match: ${matched.length ? `Direct overlaps: ${list(matched)}. ` : ""}${p.identity.name} has 6+ years in production across banking, transport and logistics with React, TypeScript, Next.js and Node.js.
Gaps: ${missing.length ? `The role mentions ${list(missing)}, which are not in his profile.` : "none significant for the technologies listed."}
Pitch: ${p.identity.fullName} — ${p.identity.role}, ${p.identity.status.label.toLowerCase()}, Madrid.`;

  return body + trailer("skills, experience, contact", es ? ["¿Qué hizo en CaixaBank Tech?", "¿Está disponible?"] : ["What did he build at CaixaBank Tech?", "Is he open to work?"]);
}
