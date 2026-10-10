import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { portfolio } from "@/lib/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${portfolio.identity.name} — ${portfolio.identity.role}`;

const colors = {
  bg: "#0d1522",
  glass: "#131d2e",
  border: "rgba(242,241,238,0.09)",
  fg: "#c3c8d1",
  fgBright: "#f2f1ee",
  dim: "#8792a3",
  green: "#a3bfa0",
  blue: "#9db8dd",
  purple: "#b4a8d2",
  cyan: "#93bfc6",
};

export default async function OpengraphImage() {
  const { identity, stats } = portfolio;
  // Generated at build time: the avatar is embedded as PNG (the OG renderer has no WebP support).
  const avatar = await sharp(
    await readFile(path.join(process.cwd(), "public/assets/avatar.webp")),
  )
    .resize(320, 320)
    .png()
    .toBuffer();
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.bg,
        fontFamily: "monospace",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          backgroundColor: colors.glass,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 28px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              backgroundColor: "#3a4558",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              backgroundColor: "#3a4558",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              backgroundColor: "#3a4558",
            }}
          />
          <div style={{ marginLeft: 18, fontSize: 24, color: colors.dim }}>
            — darubio@portfolio: ~ —
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: "56px 64px",
            flex: 1,
            alignItems: "center",
            gap: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: colors.dim,
                marginBottom: 18,
              }}
            >
              <span style={{ color: colors.green }}>darubio</span>
              <span style={{ color: colors.dim }}>@</span>
              <span style={{ color: colors.purple }}>portfolio</span>
              <span style={{ color: colors.cyan, marginLeft: 14 }}>~</span>
              <span style={{ color: colors.blue, marginLeft: 14 }}>$</span>
              <span style={{ color: colors.fgBright, marginLeft: 14 }}>
                whoami
              </span>
            </div>
            <div
              style={{
                fontSize: 88,
                fontWeight: 700,
                color: colors.fgBright,
                letterSpacing: -2,
                lineHeight: 1.05,
              }}
            >
              {identity.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 40,
                color: colors.blue,
                marginTop: 14,
              }}
            >
              {identity.role}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: colors.green,
                marginTop: 20,
              }}
            >
              {identity.stack}
            </div>
            <div
              style={{
                display: "flex",
                gap: 28,
                marginTop: 34,
                fontSize: 24,
                color: colors.blue,
              }}
            >
              {stats.map((stat, i) => (
                <span key={stat.unit} style={{ display: "flex", gap: 28 }}>
                  {i > 0 ? <span style={{ color: colors.dim }}>·</span> : null}
                  <span>
                    <span style={{ fontWeight: 700 }}>{stat.value}</span>
                    <span style={{ marginLeft: 8 }}>{stat.unit}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>
          <img
            src={avatarSrc}
            width={260}
            height={260}
            alt=""
            style={{
              width: 260,
              height: 260,
              borderRadius: 40,
              border: `2px solid ${colors.border}`,
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 28px",
            borderTop: `1px solid ${colors.border}`,
            fontSize: 24,
            color: colors.dim,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              backgroundColor: colors.green,
            }}
          />
          {identity.status.label} · {identity.location}
        </div>
      </div>
    </div>,
    size,
  );
}
