import type { Portfolio } from "@/lib/types";

export const portfolio: Portfolio = {
  identity: {
    name: "Daniel Rubio",
    fullName: "Daniel Alejandro Rubio Linares",
    role: "Software Engineer",
    stack: "React · TypeScript · Next.js · Node.js",
    location: "Madrid, Spain",
    tagline: "6+ years shipping full-stack systems to production.",
    handle: "darubiio",
    status: { open: true, label: "Open to work" },
    uptime: "6+ years in prod",
  },

  about: [
    "Software engineer with 6+ years building user interfaces with JavaScript and React,",
    "and the full stack behind them with Next.js, TypeScript and Node.js. Track record",
    "shipping mission-critical systems to production across banking, transport and logistics.",
    "",
    "Focused on clean, efficient front-end work. I like the boring parts: reliability,",
    "observability, code the on-call engineer (sometimes me) doesn't curse at 3am —",
    "and I'm eager to bring that to more innovative, high-impact projects. // 99.9% uptime, 0.1% luck",
  ],

  stats: [
    { value: "6+", unit: "years", label: "in production · banking, transport and logistics", cmd: "experience" },
    { value: "1M+", unit: "trips/day", label: "M-30 tunnels, Madrid · traffic-control software", cmd: "experience" },
    { value: "8", unit: "warehouses", label: "real-time stock · PWA on Zoho Inventory", cmd: "projects" },
    { value: "3", unit: "critical sectors", label: "banking · transport · logistics", cmd: "experience" },
  ],

  experience: [
    {
      role: "Software Engineer",
      company: "CaixaBank Tech",
      place: "Madrid · Spain · hybrid",
      period: "Nov 2024 — Present",
      sector: "Banking",
      current: true,
      points: [
        "Build and maintain internal banking applications on a React micro-frontend architecture, integrating REST APIs and working day to day with backend and infrastructure teams to keep delivery smooth and secure.",
        "Designed and shipped custom frontend plugins for the corporate Backstage developer portal, improving discovery and adoption of internal services.",
        "Own code quality across the delivery cycle: design patterns, Jest test suites and CI/CD pipelines in an agile team.",
      ],
      stack: ["React", "TypeScript", "Micro-Frontends", "Jest", "Backstage", "CI/CD"],
    },
    {
      role: "Software Engineer",
      company: "Freelance",
      place: "Madrid · Spain",
      period: "Aug 2025 — Present",
      sector: "Logistics & Supply Chain",
      current: true,
      points: [
        "Designed and built a PWA on top of Zoho Inventory that gives warehouse operators an optimized UI for inventory transfers, shipment prep and goods receiving with barcode-scan verification.",
        "Implemented Redis-backed collaborative multi-shift sessions, granular per-warehouse access control with CASL and OAuth 2.0 auth against Zoho.",
        "Added serial-number scanning and tracking, enabling unit-level traceability across receiving, transfers and picking.",
      ],
      stack: ["Next.js", "Redis", "Zoho Inventory API", "PWA", "OAuth 2.0", "CASL"],
    },
    {
      role: "IT Consultant",
      company: "Go Concept (client: SICE)",
      place: "Madrid · Spain · hybrid",
      period: "Oct 2022 — Nov 2024",
      sector: "Transport",
      current: false,
      points: [
        "Full-stack development of traffic-control software for interurban highways and tunnels, built to improve traffic management, efficiency and road safety under strict reliability and availability requirements.",
        "Real-time supervision systems now in production in the Calle 30 (M-30 Madrid) tunnels — the largest urban tunnel network in Europe — handling 1M+ daily trips.",
        "Polyglot stack: React, Redux and TypeScript on the front; Node.js, .NET and Go services over PostgreSQL, MySQL and Redis.",
      ],
      stack: ["TypeScript", "React", "Redux", "Node.js", ".NET", "Go", "PostgreSQL", "MySQL", "Redis"],
    },
    {
      role: "Web Developer",
      company: "Freelance",
      place: "Cuba · remote",
      period: "Dec 2019 — May 2021",
      sector: "Multi-sector",
      current: false,
      points: [
        "Delivered custom web platforms for clients in management, logistics, fitness and hospitality, from scoping to launch, fully remote.",
        "Developed and tested React.js components and contributed to server-side development and database management.",
      ],
      stack: ["React", "TypeScript", "JavaScript", "REST APIs", "SQL"],
    },
    {
      role: "Junior JavaScript Developer",
      company: "Copextel S.A.",
      place: "Havana, Cuba",
      period: "Sep 2019 — Nov 2020",
      sector: "Corporate",
      current: false,
      points: [
        "Built user interfaces for the company's internal services with JavaScript, HTML5, CSS3 and Bootstrap.",
        "First professional role: learned to ship inside a corporate engineering team, from code review to release.",
      ],
      stack: ["JavaScript", "HTML5", "CSS3", "Bootstrap"],
    },
  ],

  projects: [
    {
      id: "perdomo",
      name: "Perdomo Distributor",
      kind: "Inventory Management PWA",
      year: "2025",
      blurb:
        "Warehouse-ops PWA on top of Zoho Inventory for a multi-state HVAC distributor. Barcode-scan receiving, inter-warehouse transfers, dispatch and a live cross-warehouse inventory matrix.",
      highlights: [
        "8+ warehouses, real-time stock across all of them",
        "Barcode-scan receiving with serial-number traceability",
        "Redis-backed multi-shift collaborative sessions",
        "Per-warehouse access control (CASL) + Zoho OAuth 2.0",
      ],
      stack: ["Next.js", "Redis", "Zoho API", "PWA", "OAuth 2.0", "CASL"],
      shots: [
        { src: "assets/perdomo-warehouses.webp", cap: "Multi-warehouse dashboard" },
        { src: "assets/perdomo-inventory.webp", cap: "Cross-warehouse inventory matrix" },
        { src: "assets/perdomo-receiving.webp", cap: "Barcode-scan receiving flow" },
      ],
      link: null,
    },
    {
      id: "billroot",
      name: "Billroot",
      kind: "Invoicing & Accounting SaaS",
      year: "2026",
      blurb:
        "A purchase-invoice & accounting product. Recurring invoices, payment scheduling, multi-currency with automatic FX, Spanish chart-of-accounts classification and an inline PDF viewer.",
      highlights: [
        "Recurring billing engine with upcoming-charge forecasting",
        "Multi-currency (USD/EUR) with automatic exchange rates",
        "Accounting-account classification + deductible tracking",
        "Inline PDF viewer & document attachments",
      ],
      stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Vercel"],
      shots: [
        { src: "assets/billroot-invoices.webp", cap: "Purchase invoices ledger" },
        { src: "assets/billroot-recurring.webp", cap: "Recurring charges forecast" },
        { src: "assets/billroot-detail.webp", cap: "Invoice detail panel" },
        { src: "assets/billroot-edit.webp", cap: "Editor + live PDF preview" },
      ],
      link: "billroot.app",
    },
    {
      id: "m30",
      name: "M-30 Tunnel Control",
      kind: "Real-time Traffic Supervision",
      year: "2022–2024",
      blurb:
        "Mission-critical full-stack systems for real-time traffic management & supervision of Madrid's M-30 — the largest urban tunnel network in Europe. In production today, 1M+ daily trips.",
      highlights: [
        "Real-time supervision with high-availability requirements",
        "In production across the Calle 30 tunnel network",
        "Polyglot backend: Node.js, .NET and Go",
        "1,000,000+ daily vehicle movements",
      ],
      stack: ["React", "Redux", "Node.js", ".NET", "Go", "PostgreSQL", "Redis"],
      shots: [],
      placeholder: "// classified infrastructure — no screenshots, it watches a million cars a day",
      link: null,
    },
    {
      id: "backstage",
      name: "Backstage Dev Portal",
      kind: "Internal Developer Platform",
      year: "2024–now",
      blurb:
        "Custom frontend plugins for CaixaBank's corporate Backstage developer portal, plus internal UIs on a React micro-frontend architecture. Built to make internal services discoverable and adoptable.",
      highlights: [
        "Custom Backstage plugins for service discovery",
        "React micro-frontend architecture",
        "Jest test coverage + CI/CD pipelines",
        "Banking-grade review & compliance",
      ],
      stack: ["React", "TypeScript", "Micro-Frontends", "Backstage", "Jest"],
      shots: [],
      placeholder: "// internal banking tooling — screenshots stay behind the firewall",
      link: null,
    },
  ],

  skills: [
    {
      group: "Frontend",
      items: ["React.js", "Next.js", "Redux", "React Native", "Micro-Frontends", "PWA", "TypeScript", "JavaScript", "HTML", "CSS"],
    },
    { group: "Backend & APIs", items: ["Node.js", "REST APIs", "OAuth 2.0", ".NET", "Go"] },
    { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
    { group: "Quality & DevOps", items: ["Jest", "Git", "GitHub", "GitLab", "CI/CD", "Vercel", "Agile"] },
    { group: "Other", items: ["Backstage", "Design Patterns", "CASL", "Zoho Inventory API"] },
  ],

  education: {
    degree: "Computer Science Engineering",
    school: "Universidad de las Ciencias Informáticas (UCI)",
    place: "Cuba",
  },

  languages: [
    { name: "Spanish", level: "Native", pct: 100 },
    { name: "English", level: "B2 (CEFR)", pct: 75 },
  ],

  contact: {
    email: "darubiio97@icloud.com",
    location: "Madrid, Spain",
    linkedin: "linkedin.com/in/darubiio",
    github: "github.com/darubiio",
    cv: "assets/Daniel-Rubio-CV.pdf",
  },
};
