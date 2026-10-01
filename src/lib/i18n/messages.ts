import type { BootLine } from "@/lib/types";
import type { Lang } from "@/lib/i18n/types";

/**
 * All UI "chrome" strings (everything that is NOT portfolio bio prose — that
 * lives in the localized portfolio variants). Keyed by language. The shape is
 * shared by both locales so TypeScript guarantees parity: a missing key in `es`
 * is a compile error.
 */
export interface Messages {
  headings: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    languages: string;
    contact: string;
    help: string;
  };
  welcome: {
    hintPre: string;
    hintHelp: string;
    hintPost: string;
    askNew: string;
    askQuestion: string;
  };
  help: {
    /** description per command name (command name itself stays as typed) */
    commands: Record<string, string>;
    order: readonly string[];
    hiddenNote: string;
  };
  about: { name: string; role: string; based: string; status: string };
  neofetch: {
    os: string;
    host: string;
    role: string;
    uptime: string;
    shell: string;
    theme: string;
    stack: string;
    location: string;
    status: string;
  };
  stats: { see: string };
  share: { intro: string; copy: string; copied: string };
  ask: { thinking: string; unavailable: string };
  notfound: { notFound: string; tryPre: string; tryPost: string };
  theme: { label: string };
  lang: { label: string; en: string; es: string };
  palette: { hint: string };
  contact: {
    labels: { email: string; location: string; linkedin: string; github: string; resume: string };
    downloadCv: string;
    replyNote: string;
  };
  resume: { downloading: string; fallback: string };
  matrix: { notice: string };
  timeline: { now: string };
  easter: {
    sudoPassword: string;
    sudoIncident: string;
    sudoHidden: string;
    whoami: string;
    lsNote: string;
    coffee: string;
    openToWork: string;
    reachMe: string;
    jokes: readonly string[];
  };
  langHint: { text: string; cta: string };
  boot: readonly BootLine[];
}

const en: Messages = {
  headings: {
    about: "about",
    experience: "experience",
    projects: "featured projects",
    skills: "skills",
    education: "education",
    languages: "languages",
    contact: "contact",
    help: "available commands",
  },
  welcome: {
    hintPre: "// Type a command, or just click the buttons below. Try ",
    hintHelp: "help",
    hintPost: " if you're lost.",
    askNew: "// new — ask me anything: ",
    askQuestion: "Can he ship a SaaS solo?",
  },
  help: {
    commands: {
      about: "who I am, the short version",
      ask: "ask the AI assistant anything about me",
      stats: "the numbers at a glance",
      experience: "where I've shipped code",
      projects: "things I built (with screenshots)",
      skills: "the tech I reach for",
      education: "the degree",
      languages: "human languages",
      contact: "how to reach me",
      resume: "download my CV (.pdf)",
      share: "copy a link to this view",
      neofetch: "system info, terminal-nerd style",
      theme: "toggle dark / light",
      lang: "switch language (en / es)",
      clear: "wipe the screen",
    },
    order: [
      "about",
      "ask",
      "stats",
      "experience",
      "projects",
      "skills",
      "education",
      "languages",
      "contact",
      "resume",
      "share",
      "neofetch",
      "theme",
      "lang",
      "clear",
    ],
    hiddenNote: "// psst — there are a few hidden commands. curious people use `sudo`.",
  },
  about: { name: "name   ", role: "role   ", based: "based  ", status: "status " },
  neofetch: {
    os: "OS",
    host: "Host",
    role: "Role",
    uptime: "Uptime",
    shell: "Shell",
    theme: "Theme",
    stack: "Stack",
    location: "Location",
    status: "Status",
  },
  stats: { see: "view" },
  share: {
    intro: "// share this view — the URL deep-links straight back here",
    copy: "copy link",
    copied: "✓ copied",
  },
  ask: { thinking: "thinking", unavailable: "assistant unavailable right now — try the contact command." },
  notfound: { notFound: "command not found: ", tryPre: "// try ", tryPost: " to see what I respond to." },
  theme: { label: "theme → " },
  lang: { label: "language → ", en: "English 🇬🇧", es: "Español 🇪🇸" },
  palette: { hint: "not a terminal person? just click ↓" },
  contact: {
    labels: { email: "email", location: "location", linkedin: "linkedin", github: "github", resume: "resume" },
    downloadCv: "download CV (.pdf)",
    replyNote: "// I usually reply faster than CI on a Monday morning.",
  },
  resume: { downloading: "downloading", fallback: "click here if the download didn't start" },
  matrix: { notice: "// entering the matrix... press any key to exit." },
  timeline: { now: "now" },
  easter: {
    sudoPassword: "password for",
    sudoIncident: "is not in the sudoers file. This incident will be reported. 🚨",
    sudoHidden: "// nice try. hidden commands: whoami · ls · matrix · coffee · joke · open-to-work",
    whoami: "// just a dev who likes shipping things that stay shipped.",
    lsNote: "// run a command name to `cat` any of these.",
    coffee: "// ☕ brewing... runs on coffee & TypeScript.",
    openToWork: "Currently open to frontend / full-stack roles (React · TypeScript · Next.js).",
    reachMe: "Reach me → ",
    jokes: [
      "There are 10 kinds of people: those who read binary and those who don't.",
      "It works on my machine. ¯\\_(ツ)_/¯  Ship the laptop then.",
      "A SQL query walks into a bar, sees two tables and asks: 'Can I JOIN you?'",
      "Why do Java devs wear glasses? Because they don't C#.",
      "99 little bugs in the code, take one down, patch it around... 127 little bugs in the code.",
    ],
  },
  langHint: { text: "// looks like you prefer Spanish — switch with ", cta: "lang es" },
  boot: [
    ["0.000000", "booting darubio@portfolio · kernel 1.0.0 · react 19.3 · next 16", ""],
    ["0.142", "mounting /dev/experience ............", "ok"],
    ["0.318", "loading react@19.2 .................", "ok"],
    ["0.504", "decrypting projects.tar.gz ..........", "ok"],
    ["0.731", "warming up fira-code ligatures ......", "ok"],
    ["0.918", "negotiating coffee protocol .........", "warn"],
    ["1.204", "starting interactive shell ..........", "ok"],
  ],
};

const es: Messages = {
  headings: {
    about: "sobre mí",
    experience: "experiencia",
    projects: "proyectos destacados",
    skills: "habilidades",
    education: "educación",
    languages: "idiomas",
    contact: "contacto",
    help: "comandos disponibles",
  },
  welcome: {
    hintPre: "// Escribe un comando, o haz clic en los botones de abajo. Prueba ",
    hintHelp: "help",
    hintPost: " si te pierdes.",
    askNew: "// nuevo — pregúntame lo que sea: ",
    askQuestion: "¿Puede sacar un SaaS él solo?",
  },
  help: {
    commands: {
      about: "quién soy, en breve",
      ask: "pregúntale al asistente de IA lo que sea sobre mí",
      stats: "los números de un vistazo",
      experience: "dónde he llevado código a producción",
      projects: "cosas que he construido (con capturas)",
      skills: "la tecnología que uso",
      education: "la titulación",
      languages: "idiomas que hablo",
      contact: "cómo contactarme",
      resume: "descargar mi CV (.pdf)",
      share: "copiar un enlace a esta vista",
      neofetch: "info del sistema, estilo terminal",
      theme: "alternar oscuro / claro",
      lang: "cambiar idioma (en / es)",
      clear: "limpiar la pantalla",
    },
    order: [
      "about",
      "ask",
      "stats",
      "experience",
      "projects",
      "skills",
      "education",
      "languages",
      "contact",
      "resume",
      "share",
      "neofetch",
      "theme",
      "lang",
      "clear",
    ],
    hiddenNote: "// psst — hay unos cuantos comandos ocultos. los curiosos usan `sudo`.",
  },
  about: { name: "nombre ", role: "rol    ", based: "lugar  ", status: "estado " },
  neofetch: {
    os: "SO",
    host: "Host",
    role: "Rol",
    uptime: "Uptime",
    shell: "Shell",
    theme: "Tema",
    stack: "Stack",
    location: "Lugar",
    status: "Estado",
  },
  stats: { see: "ver" },
  share: {
    intro: "// comparte esta vista — la URL te trae de vuelta aquí directamente",
    copy: "copiar enlace",
    copied: "✓ copiado",
  },
  ask: { thinking: "pensando", unavailable: "asistente no disponible ahora mismo — prueba el comando contact." },
  notfound: { notFound: "comando no encontrado: ", tryPre: "// prueba ", tryPost: " para ver a qué respondo." },
  theme: { label: "tema → " },
  lang: { label: "idioma → ", en: "English 🇬🇧", es: "Español 🇪🇸" },
  palette: { hint: "¿no eres de terminal? haz clic ↓" },
  contact: {
    labels: { email: "correo", location: "lugar", linkedin: "linkedin", github: "github", resume: "cv" },
    downloadCv: "descargar CV (.pdf)",
    replyNote: "// suelo responder más rápido que la CI un lunes por la mañana.",
  },
  resume: { downloading: "descargando", fallback: "haz clic aquí si la descarga no empezó" },
  matrix: { notice: "// entrando en la matrix... pulsa cualquier tecla para salir." },
  timeline: { now: "ahora" },
  easter: {
    sudoPassword: "contraseña de",
    sudoIncident: "no está en el fichero sudoers. Este incidente será reportado. 🚨",
    sudoHidden: "// buen intento. comandos ocultos: whoami · ls · matrix · coffee · joke · open-to-work",
    whoami: "// solo un dev al que le gusta entregar cosas que se quedan entregadas.",
    lsNote: "// ejecuta el nombre de un comando para hacer `cat` de cualquiera de estos.",
    coffee: "// ☕ preparando... funciona con café y TypeScript.",
    openToWork: "Abierto a roles de frontend / full-stack (React · TypeScript · Next.js).",
    reachMe: "Contáctame → ",
    jokes: [
      "Hay 10 tipos de personas: las que leen binario y las que no.",
      "En mi máquina funciona. ¯\\_(ツ)_/¯  Pues envía el portátil.",
      "Una query SQL entra en un bar, ve dos tablas y pregunta: '¿Puedo hacer JOIN con vosotras?'",
      "¿Por qué los devs de Java llevan gafas? Porque no ven C#.",
      "99 bugs en el código, quita uno, parchéalo... 127 bugs en el código.",
    ],
  },
  langHint: { text: "// parece que prefieres español — cambia con ", cta: "lang es" },
  boot: [
    ["0.000000", "arrancando darubio@portfolio · kernel 1.0.0 · react 19.3 · next 16", ""],
    ["0.142", "montando /dev/experience ...........", "ok"],
    ["0.318", "cargando react@19.2 ................", "ok"],
    ["0.504", "descifrando projects.tar.gz ........", "ok"],
    ["0.731", "calentando ligaduras fira-code .....", "ok"],
    ["0.918", "negociando protocolo del café ......", "warn"],
    ["1.204", "iniciando shell interactiva ........", "ok"],
  ],
};

export const messages: Record<Lang, Messages> = { en, es };
