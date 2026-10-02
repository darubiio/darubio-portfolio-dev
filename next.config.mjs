const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' needed: Next.js streams RSC payload via inline scripts and the
  // theme/lang boot scripts in layout.tsx are inline. A nonce would force dynamic
  // rendering of the (otherwise static) page. No user-supplied HTML is ever rendered.
  // React and Turbopack use eval() for dev-only debugging (source maps, HMR) — never in production.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  // pdfkit reads its font metrics from node_modules at runtime: keep it out of the bundle.
  serverExternalPackages: ["pdfkit"],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Static imports carry a content hash in the URL, so optimized output can be cached for a year.
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    // The CV used to be a hand-made static file; old links now get the generated one.
    return [{ source: "/assets/Daniel-Rubio-CV.pdf", destination: "/cv/Daniel-Rubio-CV-ES.pdf", permanent: true }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
