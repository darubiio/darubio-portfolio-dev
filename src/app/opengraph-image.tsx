import { ImageResponse } from "next/og";
import { portfolio } from "@/lib/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${portfolio.identity.name} — ${portfolio.identity.role}`;

const colors = {
  bg: "#15171c",
  glass: "#21252b",
  border: "rgba(255,255,255,0.08)",
  fg: "#abb2bf",
  fgBright: "#d7dae0",
  dim: "#5c6370",
  green: "#98c379",
  blue: "#61afef",
  purple: "#c678dd",
  cyan: "#56b6c2",
};

export default function OpengraphImage() {
  const { identity, stats } = portfolio;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.bg,
          backgroundImage: `radial-gradient(circle at 18% 20%, rgba(97,175,239,0.22), transparent 45%), radial-gradient(circle at 85% 80%, rgba(198,120,221,0.18), transparent 45%)`,
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
            <div style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: "#ff5f57" }} />
            <div style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: "#febc2e" }} />
            <div style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: "#28c840" }} />
            <div style={{ marginLeft: 18, fontSize: 24, color: colors.dim }}>— darubio@portfolio: ~ —</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", padding: "56px 64px", flex: 1, justifyContent: "center" }}>
            <div style={{ display: "flex", fontSize: 30, color: colors.dim, marginBottom: 18 }}>
              <span style={{ color: colors.green }}>darubio</span>
              <span style={{ color: colors.dim }}>@</span>
              <span style={{ color: colors.purple }}>portfolio</span>
              <span style={{ color: colors.cyan, marginLeft: 14 }}>~</span>
              <span style={{ color: colors.blue, marginLeft: 14 }}>$</span>
              <span style={{ color: colors.fgBright, marginLeft: 14 }}>whoami</span>
            </div>
            <div style={{ fontSize: 88, fontWeight: 700, color: colors.fgBright, letterSpacing: -2, lineHeight: 1.05 }}>
              {identity.name}
            </div>
            <div style={{ display: "flex", fontSize: 40, color: colors.blue, marginTop: 14 }}>{identity.role}</div>
            <div style={{ display: "flex", fontSize: 28, color: colors.green, marginTop: 20 }}>{identity.stack}</div>
            <div style={{ display: "flex", gap: 40, marginTop: 36 }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 34, fontWeight: 700, color: colors.blue }}>{stat.value}</span>
                  <span style={{ fontSize: 18, color: colors.dim, marginTop: 6 }}>{stat.label}</span>
                </div>
              ))}
            </div>
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
            <div style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: colors.green }} />
            {identity.status.label} · {identity.location}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
