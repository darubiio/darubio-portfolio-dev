import type { ComponentType } from "react";
import type { CommandName } from "@/lib/commands";
import type { OutputSpec } from "@/lib/history";
import { Welcome } from "@/components/outputs/Welcome";
import { Help } from "@/components/outputs/Help";
import { About } from "@/components/outputs/About";
import { Stats } from "@/components/outputs/Stats";
import { Share } from "@/components/outputs/Share";
import { Ask } from "@/components/outputs/Ask";
import { Experience } from "@/components/outputs/Experience";
import { Projects } from "@/components/outputs/Projects";
import { Skills } from "@/components/outputs/Skills";
import { Education } from "@/components/outputs/Education";
import { Languages } from "@/components/outputs/Languages";
import { Contact } from "@/components/outputs/Contact";
import { Resume } from "@/components/outputs/Resume";
import { Neofetch } from "@/components/outputs/Neofetch";
import { NotFound } from "@/components/outputs/NotFound";
import { ThemeNotice } from "@/components/outputs/ThemeNotice";
import { LangNotice } from "@/components/outputs/LangNotice";
import { MatrixNotice } from "@/components/outputs/MatrixNotice";
import { Sudo } from "@/components/outputs/easter/Sudo";
import { Whoami } from "@/components/outputs/easter/Whoami";
import { Ls } from "@/components/outputs/easter/Ls";
import { Coffee } from "@/components/outputs/easter/Coffee";
import { Joke } from "@/components/outputs/easter/Joke";
import { OpenToWork } from "@/components/outputs/easter/OpenToWork";

const REGISTRY: Record<CommandName, ComponentType> = {
  welcome: Welcome,
  help: Help,
  about: About,
  stats: Stats,
  share: Share,
  experience: Experience,
  projects: Projects,
  skills: Skills,
  education: Education,
  languages: Languages,
  contact: Contact,
  resume: Resume,
  neofetch: Neofetch,
  sudo: Sudo,
  whoami: Whoami,
  ls: Ls,
  coffee: Coffee,
  joke: Joke,
  "open-to-work": OpenToWork,
};

export function CommandOutput({ spec }: { spec: OutputSpec }) {
  switch (spec.type) {
    case "command": {
      const Output = REGISTRY[spec.name];
      return <Output />;
    }
    case "ask":
      return <Ask question={spec.question} />;
    case "notfound":
      return <NotFound cmd={spec.cmd} />;
    case "theme":
      return <ThemeNotice theme={spec.theme} />;
    case "lang":
      return <LangNotice lang={spec.lang} />;
    case "matrix":
      return <MatrixNotice />;
  }
}
