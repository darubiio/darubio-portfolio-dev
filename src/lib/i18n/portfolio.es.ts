import type { Portfolio } from "@/lib/types";
import { portfolio as en } from "@/lib/portfolio";

/**
 * Spanish portfolio. Built from the English base (`@/lib/portfolio`) reusing all
 * non-translatable fields (names, contact, links, tech stacks, screenshots, ids,
 * periods, places, percentages) and overriding only the prose.
 *
 * NOTE (first-pass translation — pending Daniel's review): the bio wording is a
 * professional first draft. Refine nuances before shipping.
 */

const role = {
  "Frontend Engineer": "Ingeniero Frontend",
  "Software Engineer": "Ingeniero de Software",
  "IT Consultant": "Consultor IT",
  "Web Developer": "Desarrollador web",
  "Junior JavaScript Developer": "Desarrollador JavaScript junior",
} as const;

const sector = {
  Banking: "Banca",
  "Logistics & Supply Chain": "Logística y cadena de suministro",
  Transport: "Transporte",
  "Multi-sector": "Multisector",
  Corporate: "Corporativo",
} as const;

const MONTHS: Record<string, string> = {
  Jan: "ene.",
  Feb: "feb.",
  Mar: "mar.",
  Apr: "abr.",
  May: "may.",
  Jun: "jun.",
  Jul: "jul.",
  Aug: "ago.",
  Sep: "sept.",
  Oct: "oct.",
  Nov: "nov.",
  Dec: "dic.",
};

/** "Nov 2024 — Present" → "nov. 2024 — actualidad". */
const localizePeriod = (period: string) =>
  period.replace(/\b[A-Z][a-z]{2}\b/g, (month) => MONTHS[month] ?? month).replace("Present", "actualidad");

const PLACE_WORDS: Record<string, string> = { Spain: "España", hybrid: "híbrido", remote: "remoto", Havana: "La Habana" };

/** "Madrid · Spain · hybrid" → "Madrid · España · híbrido". */
const localizePlace = (place: string) => place.replace(/\b[A-Za-z]+\b/g, (word) => PLACE_WORDS[word] ?? word);

// Indexed by the English `experience` order.
const experiencePoints: string[][] = [
  [
    "Construyo y mantengo aplicaciones bancarias internas sobre una arquitectura de micro-frontends en React, integrando APIs REST y trabajando a diario con los equipos de backend e infraestructura para que la entrega sea fluida y segura.",
    "Diseñé y entregué plugins de frontend a medida para el portal de desarrolladores corporativo Backstage, mejorando el descubrimiento y la adopción de servicios internos.",
    "Responsable de la calidad del código en todo el ciclo de entrega: patrones de diseño, suites de tests con Jest y pipelines de CI/CD en un equipo ágil.",
  ],
  [
    "Diseñé y construí una PWA sobre Zoho Inventory que da a los operarios de almacén una UI optimizada para transferencias de inventario, preparación de envíos y recepción de mercancía con verificación por escaneo de códigos de barras.",
    "Implementé sesiones colaborativas multi-turno respaldadas por Redis, control de acceso granular por almacén con CASL y autenticación OAuth 2.0 contra Zoho.",
    "Añadí escaneo y seguimiento por número de serie, habilitando trazabilidad a nivel de unidad en recepción, transferencias y picking.",
  ],
  [
    "Desarrollo full-stack de software de control de tráfico para autovías interurbanas y túneles, orientado a mejorar la gestión, la eficiencia y la seguridad vial bajo requisitos estrictos de fiabilidad y disponibilidad.",
    "Sistemas de supervisión en tiempo real hoy en producción en los túneles de Calle 30 (M-30 Madrid) — la mayor red de túneles urbanos de Europa — gestionando más de 1M de viajes diarios.",
    "Stack políglota: React, Redux y TypeScript en el front; servicios en Node.js, .NET y Go sobre PostgreSQL, MySQL y Redis.",
  ],
  [
    "Entregué plataformas web a medida para clientes de gestión, logística, fitness y hostelería, desde el alcance hasta el lanzamiento, en remoto.",
    "Desarrollé y testeé componentes React.js y contribuí al desarrollo de servidor y a la gestión de bases de datos.",
  ],
  [
    "Construí interfaces de usuario para los servicios internos de la compañía con JavaScript, HTML5, CSS3 y Bootstrap.",
    "Primer rol profesional: aprendí a entregar dentro de un equipo de ingeniería corporativo, de la revisión de código al despliegue.",
  ],
];

// Indexed by the English `projects` order.
const projectContent = [
  {
    kind: "PWA de gestión de inventario",
    blurb:
      "PWA de operativa de almacén sobre Zoho Inventory para un distribuidor de climatización (HVAC) multi-estado. Recepción por escaneo de códigos de barras, transferencias entre almacenes, expedición y una matriz de inventario en vivo entre almacenes.",
    highlights: [
      "8+ almacenes, stock en tiempo real en todos ellos",
      "Recepción por escaneo con trazabilidad por número de serie",
      "Sesiones colaborativas multi-turno respaldadas por Redis",
      "Control de acceso por almacén (CASL) + OAuth 2.0 de Zoho",
    ],
    placeholder: undefined,
  },
  {
    kind: "SaaS de facturación y contabilidad",
    blurb:
      "Un producto de facturas de compra y contabilidad. Facturas recurrentes, programación de pagos, multidivisa con cambio automático, clasificación según el plan contable español y visor de PDF integrado.",
    highlights: [
      "Motor de facturación recurrente con previsión de próximos cargos",
      "Multidivisa (USD/EUR) con tipos de cambio automáticos",
      "Clasificación de cuentas contables + seguimiento de deducibles",
      "Visor de PDF integrado y adjuntos de documentos",
    ],
    placeholder: undefined,
  },
  {
    kind: "Supervisión de tráfico en tiempo real",
    blurb:
      "Sistemas full-stack críticos para la gestión y supervisión de tráfico en tiempo real de la M-30 de Madrid — la mayor red de túneles urbanos de Europa. Hoy en producción, más de 1M de viajes diarios.",
    highlights: [
      "Supervisión en tiempo real con requisitos de alta disponibilidad",
      "En producción en toda la red de túneles de Calle 30",
      "Backend políglota: Node.js, .NET y Go",
      "Más de 1.000.000 de movimientos de vehículos al día",
    ],
    placeholder: "// infraestructura clasificada — sin capturas, vigila un millón de coches al día",
  },
  {
    kind: "Plataforma interna de desarrollo",
    blurb:
      "Plugins de frontend a medida para el portal de desarrolladores corporativo Backstage de CaixaBank, además de UIs internas sobre una arquitectura de micro-frontends en React. Hechos para que los servicios internos sean descubribles y adoptables.",
    highlights: [
      "Plugins de Backstage a medida para descubrimiento de servicios",
      "Arquitectura de micro-frontends en React",
      "Cobertura de tests con Jest + pipelines CI/CD",
      "Revisión y cumplimiento de nivel bancario",
    ],
    placeholder: "// herramientas bancarias internas — las capturas se quedan tras el firewall",
  },
];

const skillGroups = ["Frontend", "Backend y APIs", "Bases de datos", "Calidad y DevOps", "Otros"];

const languageContent = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "B2 (MCER)" },
];

export const portfolioEs: Portfolio = {
  identity: {
    ...en.identity,
    role: role[en.identity.role as keyof typeof role] ?? en.identity.role,
    location: "Madrid, España",
    tagline: "Más de 6 años construyendo frontends en producción para banca, transporte y logística.",
    status: { ...en.identity.status, label: "Disponible para trabajar" },
    uptime: "6+ años en prod",
  },

  about: [
    "Ingeniero frontend con más de 6 años desarrollando aplicaciones web con React, TypeScript",
    "y Next.js. He llevado a producción interfaces para sistemas críticos en banca,",
    "transporte y logística, colaborando estrechamente con equipos de backend y producto.",
    "",
    "Mi trabajo se centra en arquitecturas de componentes escalables, rendimiento, accesibilidad",
    "y código mantenible, respaldado por testing y CI/CD. Busco aportar esa experiencia",
    "a equipos que desarrollen productos ambiciosos y de alto impacto.",
  ],

  stats: [
    { value: "6+", unit: "años", label: "en producción · banca, transporte y logística", cmd: "experience" },
    { value: "1M+", unit: "viajes/día", label: "túneles de la M-30, Madrid · control de tráfico", cmd: "experience" },
    { value: "8", unit: "almacenes", label: "stock en tiempo real · PWA sobre Zoho Inventory", cmd: "projects" },
    { value: "3", unit: "sectores críticos", label: "banca · transporte · logística", cmd: "experience" },
  ],

  experience: en.experience.map((entry, i) => ({
    ...entry,
    role: role[entry.role as keyof typeof role] ?? entry.role,
    sector: sector[entry.sector as keyof typeof sector] ?? entry.sector,
    company: entry.company.replace("client:", "cliente:"),
    period: localizePeriod(entry.period),
    place: localizePlace(entry.place),
    points: experiencePoints[i] ?? entry.points,
  })),

  projects: en.projects.map((project, i) => {
    const c = projectContent[i];
    return c
      ? {
          ...project,
          kind: c.kind,
          blurb: c.blurb,
          highlights: c.highlights,
          ...(c.placeholder !== undefined ? { placeholder: c.placeholder } : {}),
        }
      : project;
  }),

  skills: en.skills.map((group, i) => ({ ...group, group: skillGroups[i] ?? group.group })),

  education: {
    ...en.education,
    degree: "Ingeniería en Ciencias Informáticas",
  },

  languages: en.languages.map((language, i) => ({
    ...language,
    name: languageContent[i]?.name ?? language.name,
    level: languageContent[i]?.level ?? language.level,
  })),

  contact: { ...en.contact, location: "Madrid, España", cv: "cv/Daniel-Rubio-CV-ES.pdf" },
};
