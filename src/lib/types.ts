import type { CommandName } from "@/lib/commands";

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

export interface Stat {
  /** The number, e.g. "1M+". */
  value: string;
  /** The noun that makes the number readable, e.g. "trips/day". */
  unit: string;
  /** Where / context, one short sentence. */
  label: string;
  /** Command that shows the evidence behind the number. */
  cmd: CommandName;
}

export interface Contact {
  email: string;
  location: string;
  linkedin: string;
  github: string;
  cv: string;
}

export interface Portfolio {
  identity: Identity;
  about: string[];
  stats: Stat[];
  experience: ExperienceEntry[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education;
  languages: Language[];
  contact: Contact;
}

