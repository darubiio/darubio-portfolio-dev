import Link from "next/link";

export const metadata = {
  title: "404",
};

export default function NotFound() {
  return (
    <div className="stage">
      <div className="window" style={{ height: "auto", maxWidth: 560, padding: "28px clamp(18px, 4vw, 36px)" }}>
        <div className="row">
          <span className="var">zsh:</span> command not found: <span className="b">this-page</span>
        </div>
        <div className="row cmt">{"// the route you asked for is not on the stack."}</div>
        <div className="row" style={{ marginTop: 12 }}>
          <Link className="link" href="/">
            cd ~
          </Link>
        </div>
      </div>
    </div>
  );
}
