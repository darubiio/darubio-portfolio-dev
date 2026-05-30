import { OutputBlock } from "@/components/outputs/OutputBlock";
import { portfolio } from "@/lib/portfolio";
import { asset } from "@/lib/site";

export function Resume() {
  return (
    <OutputBlock>
      <div className="row">
        <span className="ok" style={{ color: "var(--green)" }}>
          ✓
        </span>{" "}
        downloading <span className="b">Daniel-Rubio-CV.pdf</span> ...
      </div>
      <div className="row">
        <a className="link" href={asset(portfolio.contact.cv)} download>
          click here if the download didn&apos;t start
        </a>
      </div>
    </OutputBlock>
  );
}
