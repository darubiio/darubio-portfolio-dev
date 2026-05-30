import { OutputBlock } from "@/components/outputs/OutputBlock";
import { CommandLink } from "@/components/outputs/CommandLink";
import { StatusPill } from "@/components/outputs/StatusPill";
import { portfolio } from "@/lib/portfolio";

const { identity, contact } = portfolio;

export function OpenToWork() {
  return (
    <OutputBlock>
      <div className="row">
        <StatusPill label={identity.status.label} />
      </div>
      <div className="row">
        Currently open to senior frontend / full-stack roles (React · TypeScript · Next.js).
      </div>
      <div className="row">
        Reach me → <CommandLink cmd="contact">contact</CommandLink> <span className="muted">·</span>{" "}
        <a className="link" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      </div>
    </OutputBlock>
  );
}
