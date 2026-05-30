export interface Status {
  open: boolean;
  label: string;
}

export interface Identity {
  name: string;
  fullName: string;
  role: string;
  stack: string;
  location: string;
  tagline: string;
  handle: string;
  status: Status;
  uptime: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  place: string;
  period: string;
  sector: string;
  current: boolean;
  points: string[];
  stack: string[];
}

export interface Screenshot {
  src: string;
  cap: string;
}

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string;
  blurb: string;
  highlights: string[];
  stack: string[];
  shots: Screenshot[];
  placeholder?: string;
  link: string | null;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Education {
  degree: string;
  school: string;
  place: string;
}

export interface Language {
  name: string;
  level: string;
  pct: number;
}

export interface Contact {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  cv: string;
}

export interface Portfolio {
  identity: Identity;
  about: string[];
  experience: ExperienceEntry[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education;
  languages: Language[];
  contact: Contact;
}

export type BootStatus = "" | "ok" | "warn";
export type BootLine = readonly [timestamp: string, message: string, status: BootStatus];
