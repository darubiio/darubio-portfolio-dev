// ============================================================
//  Portfolio data — Daniel Rubio
//  Single source of truth for every command output.
// ============================================================
window.PORTFOLIO = {
  identity: {
    name: "Daniel Rubio",
    fullName: "Daniel Alejandro Rubio Linares",
    role: "Senior Software Engineer",
    stack: "React · TypeScript · Next.js · Node.js",
    location: "Madrid, Spain",
    tagline: "6+ years shipping full-stack systems to production.",
    handle: "darubiio",
    status: { open: true, label: "Open to work" },
    uptime: "6+ years in prod",
  },

  about: [
    "Software engineer with 6+ years building full-stack applications at scale",
    "with React, Next.js, TypeScript and Node.js. Track record delivering",
    "mission-critical systems to production across banking, transport and logistics.",
    "",
    "I like the boring parts: reliability, observability, and code that the",
    "on-call engineer (sometimes me) doesn't curse at 3am. // 99.9% uptime, 0.1% luck",
  ],

  // ---- Experience timeline (most recent first) -------------
  experience: [
    {
      role: "Software Engineer",
      company: "CaixaBank",
      place: "Las Rozas, Madrid · Spain",
      period: "Nov 2024 — Present",
      sector: "Banking",
      current: true,
      points: [
        "Built & maintained internal UIs on a React micro-frontend architecture, integrating with APIs alongside backend & infra teams.",
        "Designed and shipped custom frontend plugins for the corporate Backstage developer portal, improving discovery & adoption of internal services.",
        "Applied design patterns, Jest testing and CI/CD in agile environments.",
      ],
      stack: ["React", "TypeScript", "Micro-Frontends", "Jest", "Backstage"],
    },
    {
      role: "Software Engineer",
      company: "Freelance",
      place: "Madrid · Spain",
      period: "Aug 2025 — Present",
      sector: "Logistics & Supply Chain",
      current: true,
      points: [
        "Designed & built a PWA on top of Zoho Inventory giving warehouse operators an optimized UI for inventory transfers, shipment prep and goods receiving with barcode-scan verification.",
        "Implemented Redis-backed collaborative multi-shift sessions, granular per-warehouse access control with CASL, and OAuth 2.0 auth with Zoho.",
        "Added serial-number scanning & tracking, enabling unit-level traceability across receiving, transfers and picking.",
      ],
      stack: ["Next.js", "Redis", "Zoho Inventory API", "PWA", "OAuth 2.0", "CASL"],
    },
    {
      role: "IT Consultant",
      company: "Go Concept (client: SICE)",
      place: "Madrid · Spain",
      period: "Oct 2022 — Nov 2024",
      sector: "Transport",
      current: false,
      points: [
        "Full-stack development of real-time critical systems for traffic management & supervision across interurban roads and tunnels, with high reliability & availability requirements.",
        "Software currently in production in the Calle 30 (M-30 Madrid) tunnels — the largest urban tunnel network in Europe — handling 1M+ daily trips.",
      ],
      stack: ["TypeScript", "React", "Redux", "Node.js", ".NET", "Go", "PostgreSQL", "MySQL", "Redis"],
    },
    {
      role: "JavaScript Developer",
      company: "Freelance",
      place: "Havana, Cuba · remote",
      period: "Oct 2019 — May 2021",
      sector: "Multi-sector",
      current: false,
      points: [
        "Built custom web platforms for clients across management, logistics, fitness and hospitality.",
        "Focused on React component development & testing, also contributing to server-side work and database management.",
      ],
      stack: ["React", "JavaScript", "REST APIs", "SQL"],
    },
    {
      role: "Developer Intern",
      company: "Copextel S.A.",
      place: "Cuba",
      period: "Sep 2019 — Nov 2020",
      sector: "Corporate",
      current: false,
      points: [
        "First professional role as a junior developer contributing to internal web projects with JavaScript in a corporate environment.",
        "Built frontend fundamentals and learned to work inside technical teams.",
      ],
      stack: ["JavaScript", "HTML", "CSS"],
    },
  ],

  // ---- Featured projects -----------------------------------
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
        { src: "assets/perdomo-warehouses.png", cap: "Multi-warehouse dashboard" },
        { src: "assets/perdomo-inventory.png", cap: "Cross-warehouse inventory matrix" },
        { src: "assets/perdomo-receiving.png", cap: "Barcode-scan receiving flow" },
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
        { src: "assets/billroot-invoices.png", cap: "Purchase invoices ledger" },
        { src: "assets/billroot-recurring.png", cap: "Recurring charges forecast" },
        { src: "assets/billroot-detail.png", cap: "Invoice detail panel" },
        { src: "assets/billroot-edit.png", cap: "Editor + live PDF preview" },
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

  // ---- Skills ----------------------------------------------
  skills: [
    { group: "Frontend", items: ["React.js", "Next.js", "Redux", "React Native", "Micro-Frontends", "PWA", "TypeScript", "JavaScript", "HTML", "CSS"] },
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
    phone: "+34 698 925 539",
    location: "Madrid, Spain",
    linkedin: "linkedin.com/in/darubiio",
    github: "github.com/darubiio",
    cv: "assets/Daniel-Rubio-CV.pdf",
  },
};
