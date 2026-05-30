/* =========================================================
   terminal.jsx — boot sequence, shell, palette, extras
   ========================================================= */
const { useState, useEffect, useRef, useCallback } = React;

const PS1 = () => (
  <span className="ps1">
    <span className="prompt-user">darubio</span>
    <span className="prompt-at">@</span>
    <span className="prompt-host">portfolio</span>
    <span> </span><span className="prompt-tilde">~</span><span> </span>
    <span className="caret">$</span><span> </span>
  </span>
);

const BOOT = [
  ["0.000000", "booting darubio@portfolio · kernel 1.0.0", ""],
  ["0.142", "mounting /dev/experience ............", "ok"],
  ["0.318", "loading react@18.3.1 ................", "ok"],
  ["0.504", "decrypting projects.tar.gz ..........", "ok"],
  ["0.731", "warming up fira-code ligatures ......", "ok"],
  ["0.918", "negotiating coffee protocol .........", "warn"],
  ["1.204", "starting interactive shell ..........", "ok"],
];

// palette buttons shown to everyone (great for non-technical visitors)
const PALETTE = [
  ["about", "◆"], ["experience", "❯"], ["projects", "▤"], ["skills", "⚙"],
  ["contact", "✉"], ["resume", "↓", "cv"], ["neofetch", "✦"],
];

let audioCtx = null;
function blip() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "square";
    o.frequency.value = 420 + Math.random() * 140;
    g.gain.setValueAtTime(0.04, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.06);
  } catch (e) {}
}

function App() {
  const [history, setHistory] = useState([]); // {id, type, cmd?, node}
  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState([]);
  const [value, setValue] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("rubio-theme") || "dark");
  const [sound, setSound] = useState(() => localStorage.getItem("rubio-sound") === "on");
  const [focused, setFocused] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  const termRef = useRef(null);
  const inputRef = useRef(null);
  const idRef = useRef(0);
  const cmdHist = useRef([]);       // typed command history
  const histIdx = useRef(-1);
  const skipRef = useRef(false);
  const nid = () => ++idRef.current;

  // ---- theme ----
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rubio-theme", theme);
  }, [theme]);
  useEffect(() => { localStorage.setItem("rubio-sound", sound ? "on" : "off"); }, [sound]);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      const t = termRef.current;
      if (t) t.scrollTop = t.scrollHeight;
    });
  }, []);

  // ---- reveal welcome (idempotent) ----
  const showWelcome = useCallback(() => {
    skipRef.current = true;
    setBooting(false);
    setHistory(h => h.length ? h : [{ id: nid(), type: "out", node: window.OUT.welcome() }]);
    scrollDown();
    setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
  }, [scrollDown]);

  // ---- boot sequence (single deterministic async loop) ----
  useEffect(() => {
    let cancelled = false;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const onSkip = () => { skipRef.current = true; };
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);

    (async () => {
      await sleep(340);
      for (let k = 0; k < BOOT.length; k++) {
        if (cancelled) return;
        if (skipRef.current) break;
        setBootLines(BOOT.slice(0, k + 1));
        scrollDown();
        await sleep(150 + Math.random() * 120);
      }
      if (cancelled) return;
      setBootLines(BOOT);
      await sleep(skipRef.current ? 120 : 280);
      if (cancelled) return;
      showWelcome();
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
    };
  }, [showWelcome]);

  // ---- command runner ----
  const run = useCallback((raw) => {
    const cmd = (raw || "").trim();
    const key = cmd.toLowerCase();
    if (cmd) { cmdHist.current.push(cmd); histIdx.current = cmdHist.current.length; }

    // echo line
    const echo = { id: nid(), type: "cmd", cmd };

    if (key === "clear" || key === "cls") { setHistory([]); return; }
    if (key === "theme" || key === "theme dark" || key === "theme light") {
      const next = key === "theme light" ? "light" : key === "theme dark" ? "dark" : (theme === "dark" ? "light" : "dark");
      setTheme(next);
      setHistory(h => [...h, echo, { id: nid(), type: "out", node: (
        <div className="out"><div className="row"><span className="ok" style={{ color: "var(--green)" }}>✓</span> theme → <span className="b">{next === "dark" ? "One Dark Pro" : "One Light"}</span></div></div>
      ) }]);
      scrollDown(); return;
    }
    if (key === "matrix") {
      setHistory(h => [...h, echo, { id: nid(), type: "out", node: <div className="out"><div className="row cmt">// entering the matrix... press any key to exit.</div></div> }]);
      startMatrix(); scrollDown(); return;
    }

    let node;
    if (key === "" ) node = null;
    else if (window.OUT[key]) node = window.OUT[key]();
    else if (key === "help" ) node = window.OUT.help();
    else node = window.OUT.notfound(cmd);

    setHistory(h => node ? [...h, echo, { id: nid(), type: "out", node }] : [...h, echo]);
    scrollDown();

    if (key === "resume") setTimeout(() => triggerDownload(P_CV), 200);
  }, [theme, scrollDown]);

  // expose to links/buttons
  useEffect(() => {
    window.__runCommand = (c) => { showWelcome(); run(c); inputRef.current && inputRef.current.focus(); };
    window.__lightbox = (src) => setLightbox(src);
  }, [run, showWelcome]);

  // ---- input handlers ----
  const onKeyDown = (e) => {
    if (sound && e.key.length === 1) blip();
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHist.current.length) {
        histIdx.current = Math.max(0, histIdx.current - 1);
        setValue(cmdHist.current[histIdx.current] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHist.current.length) {
        histIdx.current = Math.min(cmdHist.current.length, histIdx.current + 1);
        setValue(cmdHist.current[histIdx.current] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const all = Object.keys(window.OUT).concat(["clear", "theme", "matrix"]);
      const m = all.find(c => c.startsWith(value.toLowerCase()) && value);
      if (m) setValue(m);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault(); setHistory([]);
    }
  };

  const P_CV = (window.PORTFOLIO.contact.cv);

  return (
    <div className="stage" onClick={() => inputRef.current && inputRef.current.focus()}>
      <div className="window" onClick={(e) => e.stopPropagation()}>
        {/* title bar */}
        <div className="titlebar">
          <div className="lights">
            <span className="light r" title="exit" onClick={() => run("clear")} />
            <span className="light y" title="theme" onClick={() => run("theme")} />
            <span className="light g" title="neofetch" onClick={() => run("neofetch")} />
          </div>
          <div className="title">— <b>darubio@portfolio</b>: ~/{booting ? "boot" : "shell"} —</div>
          <div className="tb-actions">
            <span className={"tb-btn" + (sound ? " active" : "")} title="key sounds" onClick={() => setSound(s => !s)}>{sound ? "♪" : "♪̶"}</span>
            <span className="tb-btn" title="toggle theme" onClick={() => run("theme")}>{theme === "dark" ? "☾" : "☀"}</span>
          </div>
        </div>

        {/* terminal body */}
        <div className="term" ref={termRef} onClick={() => inputRef.current && inputRef.current.focus()}>
          {/* boot log */}
          {bootLines.length > 0 && (
            <div className="out" style={{ marginBottom: booting ? 0 : 14 }}>
              {bootLines.map((b, i) => (
                <div className="boot-line row" key={i}>
                  <span className="ts">[{b[0].padStart(8)}]</span> {b[1]}{" "}
                  {b[2] === "ok" && <span className="ok">[ ok ]</span>}
                  {b[2] === "warn" && <span className="warn">[warn]</span>}
                </div>
              ))}
              {booting && <div className="row type-caret muted" style={{ marginTop: 2 }}> </div>}
            </div>
          )}

          {/* history */}
          {history.map(item =>
            item.type === "cmd" ? (
              <div className="row" key={item.id}><PS1 /><span className="cmd-echo">{item.cmd}</span></div>
            ) : (
              <React.Fragment key={item.id}>{item.node}</React.Fragment>
            )
          )}
        </div>

        {/* clickable command palette */}
        {!booting && (
          <div className="palette">
            <div className="hint"><span className="status-pill"><span className="dot" /></span> not a terminal person? just click ↓</div>
            <div className="cmd-row">
              {PALETTE.map(([c, ic, cls]) => (
                <button className={"cbtn" + (cls === "cv" ? " cv" : "")} key={c} onClick={() => { if (sound) blip(); run(c); }}>
                  <span className="ic">{ic}</span>{c}
                </button>
              ))}
              <button className="cbtn" onClick={() => { if (sound) blip(); run("help"); }}><span className="ic">?</span>help</button>
            </div>
          </div>
        )}

        {/* input line */}
        <form className="input-bar" style={{ position: "relative" }}
          onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }}>
          <PS1 />
          <span className="cmd-echo" style={{ whiteSpace: "pre" }}>{value}</span>
          <span className="bcaret" style={focused ? {} : { animation: "none", opacity: 0.35 }} />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            spellCheck={false} autoComplete="off" autoCapitalize="off" autoCorrect="off"
            aria-label="terminal input"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, border: "none", background: "transparent", font: "inherit", color: "transparent", cursor: "text", padding: "0 18px" }}
          />
        </form>
      </div>

      {/* lightbox */}
      <div className={"lightbox" + (lightbox ? " show" : "")} onClick={() => setLightbox(null)}>
        {lightbox && <img src={lightbox} alt="screenshot" />}
      </div>
    </div>
  );
}

// ---- helpers ----
function triggerDownload(href) {
  const a = document.createElement("a");
  a.href = href; a.download = ""; document.body.appendChild(a); a.click(); a.remove();
}

function startMatrix() {
  if (document.querySelector(".matrix-canvas")) return;
  const cv = document.createElement("canvas");
  cv.className = "matrix-canvas";
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
  resize(); window.addEventListener("resize", resize);
  const chars = "01ﾊﾐﾋｰｳ｜ｸDANIELRUBIO<>[]{}/\\=+*".split("");
  const cols = Math.floor(cv.width / 16);
  const drops = Array(cols).fill(1);
  const css = getComputedStyle(document.documentElement);
  const green = css.getPropertyValue("--green").trim() || "#98c379";
  let raf;
  const draw = () => {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = green;
    ctx.font = "15px Fira Code, monospace";
    for (let i = 0; i < drops.length; i++) {
      const t = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(t, i * 16, drops[i] * 16);
      if (drops[i] * 16 > cv.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    raf = requestAnimationFrame(draw);
  };
  draw();
  const exit = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", exit);
    window.removeEventListener("pointerdown", exit);
    cv.remove();
  };
  setTimeout(() => {
    window.addEventListener("keydown", exit);
    window.addEventListener("pointerdown", exit);
  }, 100);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
