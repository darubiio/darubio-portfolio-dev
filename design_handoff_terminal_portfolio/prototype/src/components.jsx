/* =========================================================
   components.jsx — rich output renderers for each command
   Exposes window.OUT (map of command -> React node factory)
   ========================================================= */
const P = window.PORTFOLIO;

const BANNER =
`██████╗  █████╗ ███╗   ██╗██╗███████╗██╗
██╔══██╗██╔══██╗████╗  ██║██║██╔════╝██║
██║  ██║███████║██╔██╗ ██║██║█████╗  ██║
██║  ██║██╔══██║██║╚██╗██║██║██╔══╝  ██║
██████╔╝██║  ██║██║ ╚████║██║███████╗███████╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚══════╝
██████╗ ██╗   ██╗██████╗ ██╗ ██████╗
██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
██████╔╝██║   ██║██████╔╝██║██║   ██║
██╔══██╗██║   ██║██╔══██╗██║██║   ██║
██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝`;

const AVATAR =
` ___
[o,o]
(_"_)
-"-"-`;

// helper: section heading
const H = ({ children }) => (
  <div className="h"><span className="hash">#</span>{children}<span className="rule" /></div>
);

// run() lets buttons inside output trigger new commands
const fire = (cmd) => window.__runCommand && window.__runCommand(cmd);
const A = ({ href, cmd, children }) =>
  <a className="link" {...(href ? { href, target: "_blank", rel: "noreferrer" } : { onClick: () => fire(cmd) })}>{children}</a>;

window.OUT = {
  // ---------------------------------------------------------
  welcome: () => (
    <div className="out">
      <div className="banner">{BANNER}</div>
      <div className="row">
        <span className="b">{P.identity.role}</span> <span className="muted">·</span> <span className="str">{P.identity.stack}</span>
      </div>
      <div className="row muted">{P.identity.tagline} <span className="status-pill"><span className="dot" />{P.identity.status.label}</span></div>
      <div className="row" style={{ marginTop: 8 }}>
        <span className="cmt">// Type a command, or just click the buttons below. Try </span>
        <A cmd="help">help</A><span className="cmt"> if you're lost.</span>
      </div>
    </div>
  ),

  help: () => {
    const cmds = [
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
    return (
      <div className="out">
        <H>available commands</H>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(110px,auto) 1fr", gap: "3px 16px" }}>
          {cmds.map(([c, d]) => (
            <React.Fragment key={c}>
              <div><A cmd={c}>{c}</A></div>
              <div className="muted">{d}</div>
            </React.Fragment>
          ))}
        </div>
        <div className="row cmt" style={{ marginTop: 10 }}>// psst — there are a few hidden commands. curious people use `sudo`.</div>
      </div>
    );
  },

  about: () => (
    <div className="out">
      <H>about</H>
      <div className="about-grid">
        <div className="avatar">{AVATAR}</div>
        <div>
          {P.about.map((l, i) =>
            l === "" ? <div key={i} style={{ height: 8 }} />
            : <div key={i} className="row" dangerouslySetInnerHTML={{ __html: hl(l) }} />
          )}
          <div className="about-meta" style={{ marginTop: 12 }}>
            <div><span className="muted">name   </span> <span className="b">{P.identity.fullName}</span></div>
            <div><span className="muted">role   </span> <span className="fn">{P.identity.role}</span></div>
            <div><span className="muted">based  </span> <span className="str">{P.identity.location}</span></div>
            <div><span className="muted">status </span> <span className="status-pill"><span className="dot" />{P.identity.status.label}</span></div>
          </div>
        </div>
      </div>
    </div>
  ),

  experience: () => (
    <div className="out">
      <H>experience</H>
      <div className="tl">
        {P.experience.map((e, i) => (
          <div className={"tl-item" + (e.current ? " cur" : "")} key={i}>
            <span className="tl-dot" />
            <div className="tl-head">
              <span className="tl-role">{e.role}</span>
              <span className="muted">@</span>
              <span className="tl-co">{e.company}</span>
              <span className="tl-period">{e.period}</span>
            </div>
            <div className="tl-sub">{e.place} · {e.sector}{e.current ? " · now" : ""}</div>
            <ul className="tl-pts">{e.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
            <div className="chips">{e.stack.map(s => <span className="chip" key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  projects: () => (
    <div className="out">
      <H>featured projects</H>
      {P.projects.map(pr => (
        <div className="proj" key={pr.id}>
          <div className="proj-head">
            <span className="proj-name">{pr.name}</span>
            <span className="proj-kind">{pr.kind}</span>
            <span className="proj-year">{pr.year}</span>
          </div>
          <div className="proj-blurb">{pr.blurb}</div>
          <ul className="proj-hi">{pr.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
          {pr.shots && pr.shots.length > 0 && (
            <div className="shots">
              {pr.shots.map((s, i) => (
                <div className="shot" key={i}>
                  <img src={s.src} alt={s.cap} loading="lazy" onClick={() => window.__lightbox(s.src)} />
                  <div className="cap">{s.cap}</div>
                </div>
              ))}
            </div>
          )}
          {pr.placeholder && <div className="proj-ph">{pr.placeholder}</div>}
          <div className="proj-foot">
            <div className="chips">{pr.stack.map(s => <span className="chip accent" key={s}>{s}</span>)}</div>
            {pr.link && <div style={{ marginTop: 8 }}><span className="muted">↳ </span><a className="link" href={"https://" + pr.link} target="_blank" rel="noreferrer">{pr.link}</a></div>}
          </div>
        </div>
      ))}
    </div>
  ),

  skills: () => (
    <div className="out">
      <H>skills</H>
      {P.skills.map(g => (
        <div className="skill-grp" key={g.group}>
          <div className="label">{g.group}</div>
          <div className="chips">{g.items.map(s => <span className="chip" key={s}>{s}</span>)}</div>
        </div>
      ))}
    </div>
  ),

  education: () => (
    <div className="out">
      <H>education</H>
      <div className="row"><span className="b">{P.education.degree}</span></div>
      <div className="row"><span className="fn">{P.education.school}</span> <span className="muted">· {P.education.place}</span></div>
    </div>
  ),

  languages: () => (
    <div className="out">
      <H>languages</H>
      {P.languages.map(l => (
        <div className="bar-wrap" key={l.name}>
          <span className="b">{l.name}</span>
          <span className="bar"><i style={{ width: l.pct + "%" }} /></span>
          <span className="muted" style={{ fontSize: 12 }}>{l.level}</span>
        </div>
      ))}
    </div>
  ),

  contact: () => {
    const c = P.contact;
    return (
      <div className="out">
        <H>contact</H>
        <div className="contact-list">
          <div className="crow"><span className="k">email</span><a className="link" href={"mailto:" + c.email}>{c.email}</a></div>
          <div className="crow"><span className="k">phone</span><a className="link" href={"tel:" + c.phone.replace(/\s/g, "")}>{c.phone}</a></div>
          <div className="crow"><span className="k">location</span><span className="str">{c.location}</span></div>
          <div className="crow"><span className="k">linkedin</span><a className="link" href={"https://" + c.linkedin} target="_blank" rel="noreferrer">{c.linkedin}</a></div>
          <div className="crow"><span className="k">github</span><a className="link" href={"https://" + c.github} target="_blank" rel="noreferrer">{c.github}</a></div>
          <div className="crow"><span className="k">resume</span><a className="link" href={c.cv} download>download CV (.pdf)</a></div>
        </div>
        <div className="row cmt" style={{ marginTop: 10 }}>// I usually reply faster than CI on a Monday morning.</div>
      </div>
    );
  },

  neofetch: () => {
    const rows = [
      ["OS", "macOS · darwin (terminal portfolio v1.0)"],
      ["Host", P.identity.fullName],
      ["Role", P.identity.role],
      ["Uptime", P.identity.uptime],
      ["Shell", "fira-code zsh w/ ligatures"],
      ["Theme", "One Dark Pro"],
      ["Stack", P.identity.stack],
      ["Location", P.identity.location],
      ["Status", P.identity.status.label],
    ];
    return (
      <div className="out">
        <div className="about-grid">
          <div className="avatar" style={{ width: 110, height: 110 }}>{AVATAR}</div>
          <div>
            <div className="row"><span className="fn b">{P.identity.handle}</span><span className="muted">@</span><span className="purple b" style={{ color: "var(--purple)" }}>portfolio</span></div>
            <div className="row muted" style={{ marginBottom: 6 }}>{"─".repeat(28)}</div>
            {rows.map(([k, v]) => (
              <div className="row" key={k}><span className="fn" style={{ display: "inline-block", minWidth: 90 }}>{k}</span><span className="muted">: </span><span>{v}</span></div>
            ))}
            <div className="chips" style={{ marginTop: 10 }}>
              {["#e06c75", "#d19a66", "#e5c07b", "#98c379", "#56b6c2", "#61afef", "#c678dd"].map(c =>
                <span key={c} style={{ width: 18, height: 18, borderRadius: 4, background: c, display: "inline-block" }} />)}
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ---- easter eggs ----
  sudo: () => (
    <div className="out">
      <div className="row"><span className="var">[sudo]</span> password for {P.identity.handle}: <span className="muted">··········</span></div>
      <div className="row" style={{ color: "var(--red)" }}>{P.identity.handle} is not in the sudoers file. This incident will be reported. 🚨</div>
      <div className="row cmt">// nice try. hidden commands: whoami · ls · matrix · coffee · joke · open-to-work</div>
    </div>
  ),
  whoami: () => <div className="out"><div className="row"><span className="str">{P.identity.handle}</span> <span className="cmt">// just a dev who likes shipping things that stay shipped.</span></div></div>,
  ls: () => (
    <div className="out">
      <div className="row muted">drwxr-xr-x  about.md  experience.log  projects/  skills.json  contact.vcf</div>
      <div className="row cmt">// run a command name to `cat` any of these.</div>
    </div>
  ),
  coffee: () => <div className="out"><div className="row"><span className="var">HTTP 418</span> <span className="b">I'm a teapot</span> <span className="cmt">// ☕ brewing... runs on coffee & TypeScript.</span></div></div>,
  joke: () => {
    const jokes = [
      "There are 10 kinds of people: those who read binary and those who don't.",
      "It works on my machine. ¯\\_(ツ)_/¯  Ship the laptop then.",
      "A SQL query walks into a bar, sees two tables and asks: 'Can I JOIN you?'",
      "Why do Java devs wear glasses? Because they don't C#.",
      "99 little bugs in the code, take one down, patch it around... 127 little bugs in the code.",
    ];
    return <div className="out"><div className="row str">{jokes[Math.floor(Math.random() * jokes.length)]}</div></div>;
  },
  "open-to-work": () => (
    <div className="out">
      <div className="row"><span className="status-pill"><span className="dot" />{P.identity.status.label}</span></div>
      <div className="row">Currently open to senior frontend / full-stack roles (React · TypeScript · Next.js).</div>
      <div className="row">Reach me → <A cmd="contact">contact</A> <span className="muted">·</span> <a className="link" href={"mailto:" + P.contact.email}>{P.contact.email}</a></div>
    </div>
  ),
  resume: () => (
    <div className="out">
      <div className="row"><span className="ok" style={{ color: "var(--green)" }}>✓</span> downloading <span className="b">Daniel-Rubio-CV.pdf</span> ...</div>
      <div className="row"><a className="link" href={P.contact.cv} download>click here if the download didn't start</a></div>
    </div>
  ),

  notfound: (cmd) => (
    <div className="out">
      <div className="row"><span className="var">zsh:</span> command not found: <span className="b">{cmd}</span></div>
      <div className="row cmt">// try <span className="str">help</span> to see what I respond to.</div>
    </div>
  ),
};

// crude syntax highlighter for // comments inside about text
function hl(line) {
  const esc = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/(\/\/.*)$/, '<span class="cmt">$1</span>');
}

window.BANNER_TEXT = BANNER;
