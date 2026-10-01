"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ProjectCard } from "@/components/outputs/ProjectCard";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Projects() {
  const { projects } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.projects}</Heading>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </OutputBlock>
  );
}
