import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ProjectCard } from "@/components/outputs/ProjectCard";
import { portfolio } from "@/lib/portfolio";

export function Projects() {
  return (
    <OutputBlock>
      <Heading>featured projects</Heading>
      {portfolio.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </OutputBlock>
  );
}
