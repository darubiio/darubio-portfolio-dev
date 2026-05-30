import { Fragment } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { CommandLink } from "@/components/outputs/CommandLink";

const COMMANDS: ReadonlyArray<[string, string]> = [
  ["about", "who I am, the short version"],
  ["experience", "where I've shipped code"],
  ["projects", "things I built (with screenshots)"],
  ["skills", "the tech I reach for"],
  ["education", "the degree"],
  ["languages", "human languages"],
  ["contact", "how to reach me"],
  ["resume", "download my CV (.pdf)"],
  ["neofetch", "system info, terminal-nerd style"],
  ["theme", "toggle dark / light"],
  ["clear", "wipe the screen"],
];

export function Help() {
  return (
    <OutputBlock>
      <Heading>available commands</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(110px,auto) 1fr", gap: "3px 16px" }}>
        {COMMANDS.map(([command, description]) => (
          <Fragment key={command}>
            <div>
              <CommandLink cmd={command}>{command}</CommandLink>
            </div>
            <div className="muted">{description}</div>
          </Fragment>
        ))}
      </div>
      <div className="row cmt" style={{ marginTop: 10 }}>
        {"// psst — there are a few hidden commands. curious people use `sudo`."}
      </div>
    </OutputBlock>
  );
}
