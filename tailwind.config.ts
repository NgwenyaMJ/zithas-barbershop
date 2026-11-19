import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { ink: "#10100f", panel: "#191917", gold: "#c9a66b", muted: "#a7a39b" },
    fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] },
    boxShadow: { gold: "0 10px 35px rgba(201,166,107,.12)" }
  }},
  plugins: []
};
export default config;
