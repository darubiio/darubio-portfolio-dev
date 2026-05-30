import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "design_handoff_terminal_portfolio/**"] },
  ...[coreWebVitals, typescript].flat(),
];

export default eslintConfig;
