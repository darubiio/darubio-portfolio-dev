# Handoff: Terminal Portfolio — Daniel Rubio

## Overview
An interactive, console-themed personal portfolio for **Daniel Rubio (Senior Software Engineer)**. It presents itself as a macOS terminal window: it "boots" with a kernel-style log, prints an ASCII banner, then drops into an interactive shell. Visitors can **type commands** (`about`, `experience`, `projects`, …) or **click command buttons** (so non-technical recruiters can use it too). Aesthetic: **One Dark Pro** color theme, **Fira Code** with ligatures, frosted-glass macOS window over an ambient blurred background. Includes a light theme (One Light), CV download, "open to work" status, key-press sounds, and hidden easter-egg commands.

---

## About the Design Files
The files in `prototype/` are a **design reference created in HTML/CSS/React-via-Babel** — a working prototype that demonstrates the intended look, content, and behavior. **They are not meant to be shipped as-is.** The Babel-in-the-browser setup, the global `window.*` wiring, and the single-file CSS are prototype conveniences, not production patterns.

**Your task:** recreate this design in a proper codebase using its established patterns. Daniel's stack is React/Next.js/TypeScript, so the recommended target is **Next.js (App Router) + TypeScript**, but any modern framework is fine. If implementing into an existing repo, follow that repo's conventions (component structure, styling system, lint rules). If starting fresh, scaffold a new Next.js + TypeScript app and port the design faithfully.

Everything you need to reproduce the design pixel-for-pixel — exact colors, fonts, spacing, animations, and all copy — is documented below and embedded in the prototype source.

---

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, animations, and copy are all locked. Recreate the UI pixel-perfectly. The prototype's `src/app.css` is the source of truth for every token and rule; `src/data.js` is the source of truth for all content.

---

## Recommended Target Architecture
```
app/
  layout.tsx              # loads Fira Code, sets <html> theme attr
  page.tsx                # mounts <Terminal/>
components/
  Terminal.tsx            # shell: boot loop, input, history, palette, theme/sound
  Prompt.tsx              # the PS1 line (darubio@portfolio ~ $)
  outputs/                # one component per command output
    Welcome.tsx  About.tsx  Experience.tsx  Projects.tsx
    Skills.tsx  Contact.tsx  Neofetch.tsx  Help.tsx  ...
  Lightbox.tsx
lib/
  portfolio.ts            # typed port of data.js (single source of content)
  commands.ts             # command registry: name -> output component + aliases
  useTheme.ts  useSound.ts  useBootSequence.ts
styles/
  tokens.css              # CSS variables (the :root / [data-theme] blocks)
public/
  assets/                 # the 7 screenshots + CV pdf
```
Suggested: plain CSS Modules or vanilla CSS with the CSS variables already defined — the design is **not** Tailwind-shaped, it's a custom terminal theme, so a global `tokens.css` + scoped module styles is the cleanest port. Recreate `app.css` rule-for-rule.

---

## Screens / Views
This is a **single-screen app** (one terminal window). "Views" are the command outputs rendered into the scrolling history. The window has 4 stacked regions inside a fixed-size frosted card:

### Window frame
- **Container `.window`**: `width: min(1040px, 100%)`, `height: min(760px, 100%)`, `max-height: 100%`, `min-height: 0`. Centered in a full-viewport `.stage` (flex center, padding `clamp(10px,3vh,40px) clamp(10px,3vw,48px)`).
- Background `var(--glass)` with `backdrop-filter: blur(26px) saturate(150%)`, `border: 1px solid var(--border)`, `border-radius: 16px`, shadow `var(--shadow)`. **On mobile (≤720px) the window goes full-bleed**: 100%×100%, `border-radius: 0`.
- The whole page sits over an **ambient background** (`.bg-stage`): 3 blurred color blobs (`filter: blur(70px)`) slowly drifting (22–30s ease-in-out loops) + a faint 44px grid masked by a radial gradient. Disable blob animation under `prefers-reduced-motion`.

**Region 1 — Title bar (`.titlebar`, height 44px, `var(--header)` bg):**
- Left: 3 macOS traffic lights (12px circles): red `#ff5f57` (→ runs `clear`), yellow `#febc2e` (→ `theme`), green `#28c840` (→ `neofetch`).
- Center: `— darubio@portfolio: ~/{boot|shell} —`, 12.5px, `var(--dim)` with the host in `var(--fg)`. Hidden on mobile.
- Right: sound toggle (♪ / ♪̶, active = accent color) and theme toggle (☾ / ☀).

**Region 2 — Terminal body (`.term`, `flex: 1`, `overflow-y: auto`, `min-height: 0`):**
- Scrolling output area. Font 13.5px (12.5px ≤720px, 12px ≤420px), line-height 1.65, padding `18px clamp(14px,2.4vw,26px) 10px`.
- Auto-scrolls to bottom on each new output (`scrollTop = scrollHeight` via `requestAnimationFrame`).
- Custom scrollbar: 9px, thumb `var(--border)`.

**Region 3 — Command palette (`.palette`, `var(--header)` bg, hidden during boot):**
- Hint line: small green pulsing dot + `not a terminal person? just click ↓`.
- Row of buttons (`.cbtn`, flex-wrap, gap 7px): `about ◆`, `experience ❯`, `projects ▤`, `skills ⚙`, `contact ✉`, `resume ↓` (green variant), `neofetch ✦`, `help ?`. Each: 12px, padding `5px 11px`, radius 8px, `var(--glass-2)` bg, hover lifts 1px + accent border. The leading glyph is in accent color.

**Region 4 — Input line (`.input-bar`, `var(--glass-2)` bg):**
- The PS1 prompt + the typed text + a **blinking block caret** (`.bcaret`, 8×17px, accent color, `blink 1.05s steps(1) infinite`; stops blinking / 0.35 opacity when input not focused).
- Implementation note: the real `<input>` is overlaid at `opacity:0` (`position:absolute; inset:0; color:transparent`) capturing keystrokes, while a visible `<span>` mirrors the value and the block caret renders after it. Clicking anywhere in the window focuses the input.

### PS1 prompt (`Prompt` component)
`darubio@portfolio ~ $` where: `darubio`=green (`--green`), `@`=dim, `portfolio`=purple (`--purple`), `~`=cyan (`--cyan`), `$`=accent. Reused both in the input line and as the echo prefix for every entered command.

---

## Command Outputs (the "views")
Each command renders a `.out` block (`animation: fade .35s ease both`; fade = opacity 0→1 + translateY 4px→0). Most start with an `.h` heading: `# <title>` where `#` is accent, followed by a flex rule line (1px `var(--border)`).

| Command | Aliases / trigger | Output |
|---|---|---|
| `welcome` | shown after boot | ASCII banner + role + tagline + open-to-work pill + hint |
| `help` | palette `?`, `help` | 2-col grid of command → description; footer hints at hidden cmds |
| `about` | palette ◆ | avatar tile (ASCII face) + 5-line bio (`//` comments dimmed) + name/role/based/status meta |
| `experience` | palette ❯ | vertical timeline, 5 roles |
| `projects` | palette ▤ | 4 project cards (2 with screenshot strips) |
| `skills` | palette ⚙ | 5 grouped chip clusters |
| `education` | `education` | degree + school |
| `languages` | `languages` | 2 animated proficiency bars |
| `contact` | palette ✉ | email/phone/location/linkedin/github/resume rows |
| `resume` | palette ↓, `resume` | triggers CV download + confirmation text |
| `neofetch` | palette ✦ | ASCII avatar + system-info table + ANSI color swatches |
| `theme` | titlebar ☾/☀, `theme [dark\|light]` | toggles One Dark ⇄ One Light, prints confirmation |
| `clear` | `clear`, `cls`, Ctrl+L | wipes history |
| `matrix` | `matrix` | full-screen green digital-rain canvas; any key/click exits |
| Easter eggs | `sudo`,`whoami`,`ls`,`coffee`,`joke`,`open-to-work` | humorous outputs (see data) |
| (unknown) | anything else | `zsh: command not found: <cmd>` + hint |

### Project card anatomy (`.proj`)
Border `1px var(--border)`, radius 12px, `var(--glass-2)` bg; hover → accent-tinted border.
- **Head** (`.proj-head`, flex-wrap): name (`var(--fg-bright)`, 600, 15px, `flex:0 0 auto`) · kind (accent, 12px) · year (dim, 12px, pushed right with `margin-left:auto`).
- **Blurb** (`var(--fg)`).
- **Highlights** (`.proj-hi`): 2-col grid, each row prefixed with a green `✓`.
- **Screenshots** (`.shots`): horizontal scroll strip; each `.shot` is 260px wide (78vw on mobile), `img` radius 8px + border, hover lifts; clicking opens the **Lightbox** (full-screen `rgba(0,0,0,.78)` + blur, click to dismiss). Caption below in dim 11px.
- Projects without screenshots show a `.proj-ph` placeholder: dashed border + 45° hatch pattern + a dim `//` comment.
- **Footer**: accent chips for the stack + optional external link (`↳ billroot.app`).

### Timeline anatomy (`.tl`)
Vertical 2px rail (`var(--border)`); each item has a 12px dot. **Current roles** (`.cur`) get a green dot with a pulsing inner fill + glow ring. Head row: role (bright, 600) · `@` (dim) · company (accent) · period (dim, right-aligned, wraps full-width on mobile). Sub line: `place · sector · now`. Bullet points use accent `›`. Stack chips below.

---

## Interactions & Behavior

### Boot sequence (`useBootSequence`)
On mount, run an async loop:
1. Wait 340ms.
2. For each of 7 boot lines, append it and wait `150 + random*120` ms. Lines look like `[  0.142] mounting /dev/experience ............ [ ok ]` — timestamp in cyan (`[…]`, `.padStart(8)`), `[ ok ]` green, `[warn]` yellow.
3. Wait ~280ms, then reveal the welcome output, set `booting=false`, focus the input.
- **Skip:** any `keydown`/`pointerdown` during boot sets a skip flag → fast-forwards to welcome.
- ⚠️ **Porting gotcha (important):** build each appended line from a **value captured before** the state update, not by reading a loop index inside a functional `setState` updater — the index will have advanced by the time the updater runs and you'll append `undefined`. (This exact bug bit the prototype.) Prefer `setLines(BOOT.slice(0, k+1))`.

### Input
- **Enter** runs the command, echoes `PS1 + command` into history, appends output, clears input.
- **↑/↑** walk through entered-command history.
- **Tab** autocompletes against known command names.
- **Ctrl+L** clears.
- Each printable keypress optionally plays a `blip()` (Web Audio square wave, ~420–560Hz, 60ms, gain 0.04) when sound is enabled.

### Theme
- `data-theme="light"` on `<html>` swaps the entire CSS-variable set (One Dark ⇄ One Light). Persist to `localStorage["rubio-theme"]`; default `dark`. Transition `background/color 0.5s ease`.

### Sound
- Toggle persisted to `localStorage["rubio-sound"]` (`on`/`off`), default off.

### Matrix easter egg
- Append a fixed full-screen `<canvas>`; classic falling-glyph rain in `var(--green)` over a low-alpha black trail (`rgba(0,0,0,0.06)` fill each frame), 16px cells, glyphs from `01ﾊﾐﾋ…DANIELRUBIO<>[]{}/\=+*`. Remove on next key/click.

### Responsive
- ≤720px: full-bleed window, smaller type, single-column highlights, hidden title text, shots 78vw.
- ≤420px: 12px base, tighter palette buttons.
- Honor `prefers-reduced-motion` (kill blob drift).

---

## State Management
Local component state (no server state needed):
- `history: {id, type:'cmd'|'out', cmd?, node}[]` — the printed transcript.
- `bootLines: string[3][]` — accumulating boot log.
- `booting: boolean`.
- `value: string` — current input.
- `theme: 'dark'|'light'` (persisted), `sound: boolean` (persisted).
- `focused: boolean`, `lightbox: string|null` (open image src).
- Refs: incrementing id counter, entered-command history + index, skip flag, term scroll el, input el.
- A command registry maps `name → output factory`, with aliases (`cls`→`clear`) and a `notfound` fallback. In the prototype, outputs reach back into the shell via `window.__runCommand` / `window.__lightbox`; **in the port, pass callbacks via context/props instead of globals.**

No data fetching. All content is static (see `lib/portfolio.ts`).

---

## Design Tokens
All defined in `prototype/src/app.css` under `:root` and `[data-theme="light"]`. Recreate verbatim.

### One Dark Pro (default)
| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--bg-deep` | `#15171c` | | `--blue` (accent) | `#61afef` |
| `--glass` | `rgba(40,44,52,0.62)` | | `--green` | `#98c379` |
| `--glass-2` | `rgba(33,37,43,0.72)` | | `--purple` | `#c678dd` |
| `--header` | `rgba(30,33,39,0.78)` | | `--red` | `#e06c75` |
| `--border` | `rgba(255,255,255,0.08)` | | `--yellow` | `#e5c07b` |
| `--border-2` | `rgba(255,255,255,0.05)` | | `--orange` | `#d19a66` |
| `--fg` | `#abb2bf` | | `--cyan` | `#56b6c2` |
| `--fg-bright` | `#d7dae0` | | `--dim` | `#5c6370` |

Shadow: `0 30px 80px -20px rgba(0,0,0,.7), 0 8px 24px -8px rgba(0,0,0,.5)`. Selection: `rgba(97,175,239,.30)`. Blobs: blue `rgba(97,175,239,.40)`, purple `rgba(198,120,221,.32)`, cyan `rgba(86,182,194,.26)`.

### One Light (`[data-theme="light"]`)
`--bg-deep:#d3d5da` · `--glass:rgba(250,250,250,0.66)` · `--glass-2:rgba(244,244,245,0.78)` · `--header:rgba(236,236,238,0.82)` · `--border:rgba(0,0,0,0.10)` · `--fg:#383a42` · `--fg-bright:#1a1c22` · `--dim:#a0a1a7` · `--blue:#4078f2` · `--green:#50a14f` · `--purple:#a626a4` · `--red:#e45649` · `--yellow:#c18401` · `--orange:#986801` · `--cyan:#0184bc`.

### Type
- **Font:** `Fira Code` (weights 300–700), `font-feature-settings: 'liga' 1, 'calt' 1` (**ligatures on** — this is core to the aesthetic). Fallbacks: `ui-monospace, 'SF Mono', Menlo, monospace`.
- Sizes: base 13.5px; headings 14px; chips 11.5–12px; captions 11px; banner `clamp(7px,1.5vw,11px)` (it's `white-space: pre` ASCII art).

### Other
- Radii: window 16px, cards 12px, chips/buttons 8px, pills 999px, small tiles 4–6px.
- Spacing rhythm: output blocks `margin: 4px 0 16px`; section headings `margin-bottom: 12px`.
- Backdrop blur: 26px / saturate 150% on the window; 70px on blobs; 8px on lightbox.

---

## Content (single source of truth)
**Port `prototype/src/data.js` into a typed `lib/portfolio.ts` and keep ALL copy verbatim.** It contains: identity (name, role, stack, location, tagline, status), the 5-entry experience timeline, the 4 projects (Perdomo Distributor, Billroot, M-30 Tunnel Control, Backstage Dev Portal) with blurbs/highlights/stacks/screenshots, the 5 skill groups, education, languages, contact, and the easter-egg copy. Don't paraphrase — the wording (including the programmer-humor `//` comments) is intentional.

⚠️ **Verify before publishing:** the GitHub handle is currently a best-guess `github.com/darubiio` — confirm with Daniel. LinkedIn `linkedin.com/in/darubiio`, email `darubiio97@icloud.com`, phone `+34 698 925 539` are from the CV.

---

## Assets
In `prototype/assets/` (move to `public/assets/` in the port):
- `perdomo-warehouses.png`, `perdomo-inventory.png`, `perdomo-receiving.png` — Perdomo Distributor screenshots.
- `billroot-invoices.png`, `billroot-detail.png`, `billroot-recurring.png`, `billroot-edit.png` — Billroot screenshots.
- `Daniel-Rubio-CV.pdf` — linked by the `resume`/`contact` commands (served as a download).
- **Fira Code** is loaded from Google Fonts in the prototype; in production prefer self-hosting (e.g. `@fontsource/fira-code`) for offline/perf.
- ASCII art (the `DANIEL RUBIO` banner and the little avatar face) lives as string constants in `src/components.jsx` / `src/terminal.jsx` — copy them exactly (they're whitespace-sensitive, `white-space: pre`).

---

## Files in this bundle
```
prototype/
  Daniel Rubio — Terminal Portfolio.html   # entry: loads React/Babel + the 3 scripts
  src/app.css         # ALL styling + design tokens (source of truth for visuals)
  src/data.js         # ALL content (source of truth for copy) → port to portfolio.ts
  src/components.jsx  # output renderers (one factory per command) + ASCII constants
  src/terminal.jsx    # shell: boot loop, input, history, palette, theme, sound, matrix
  assets/             # 7 screenshots + CV pdf
```

## Suggested first steps for Claude Code
1. Scaffold (or open) the target repo; if new: `npx create-next-app@latest --ts`.
2. Drop the tokens into `styles/tokens.css`; wire `<html data-theme>` + Fira Code in `layout.tsx`.
3. Port `data.js` → typed `lib/portfolio.ts`.
4. Build `Terminal.tsx` (boot loop + input + history + palette), then one output component per command, mirroring `components.jsx`.
5. Replace the `window.__runCommand`/`window.__lightbox` globals with a small React context.
6. Move assets to `public/`, self-host Fira Code, confirm the GitHub URL, ship.
```
```
