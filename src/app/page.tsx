import { Terminal } from "@/components/terminal/Terminal";
import { portfolio } from "@/lib/portfolio";
import { asset, externalUrl } from "@/lib/site";

const { identity, about, experience, projects, skills, education, languages, contact } = portfolio;

export default function Home() {
  return (
    <>
      <main className="sr-only">
        <h1>
          {identity.name} — {identity.role}
        </h1>
        <p>{identity.stack}</p>
        <p>{identity.tagline}</p>
        <p>{about.filter(Boolean).join(" ")}</p>

        <h2>Experience</h2>
        <ul>
          {experience.map((entry) => (
            <li key={`${entry.company}-${entry.period}`}>
              <h3>
                {entry.role} @ {entry.company}
              </h3>
              <p>
                {entry.period} · {entry.place} · {entry.sector}
              </p>
              <ul>
                {entry.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h3>
                {project.name} — {project.kind} ({project.year})
              </h3>
              <p>{project.blurb}</p>
              <ul>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {project.link && (
                <p>
                  <a href={externalUrl(project.link)}>{project.link}</a>
                </p>
              )}
            </li>
          ))}
        </ul>

        <h2>Skills</h2>
        <ul>
          {skills.map((group) => (
            <li key={group.group}>
              <strong>{group.group}:</strong> {group.items.join(", ")}
            </li>
          ))}
        </ul>

        <h2>Education</h2>
        <p>
          {education.degree} — {education.school} · {education.place}
        </p>

        <h2>Languages</h2>
        <ul>
          {languages.map((language) => (
            <li key={language.name}>
              {language.name}: {language.level}
            </li>
          ))}
        </ul>

        <h2>Contact</h2>
        <ul>
          <li>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          <li>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </li>
          <li>
            <a href={externalUrl(contact.linkedin)}>{contact.linkedin}</a>
          </li>
          <li>
            <a href={externalUrl(contact.github)}>{contact.github}</a>
          </li>
          <li>
            <a href={asset(contact.cv)}>Download CV (PDF)</a>
          </li>
        </ul>
      </main>
      <Terminal />
    </>
  );
}
