import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom breakpoints for the responsive rail/nav work. Extended (not overridden) so
      // Tailwind's default sm/md/lg/xl scale stays intact for any existing usage.
      screens: {
        tablet: "768px",
        desktop: "1200px",
      },
      colors: {
        primary: { DEFAULT: "#EF626C", light: "#F4868D", hover: "#D64550" },
        ink: { DEFAULT: "#22181C", 2: "#312F2F" },
        bg: "#F6E8EA",
        surface: "#FFFFFF",
        border: { DEFAULT: "#E7D9DC", light: "#F0E4E6" },
        "text-secondary": "#7A6E72",
        "text-meta": "#A2969A",
        "accent-border": "#F5C6C9",
        tag: { bg: "#FBE0E2", text: "#EF626C" },
        teal: { DEFAULT: "#2BB8A6", bg: "#DDF4F0", text: "#17756A" },
        idea: { bg: "#FBE0E2", text: "#C23F49", dot: "#EF626C" },
        launch: { bg: "#E9E4E6", text: "#22181C", dot: "#22181C" },
        sidebar: {
          nav: "#A99DA1",
          navActive: "#FFFFFF",
          muted: "#D8CED1",
          userSub: "#9C8F93",
        },
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "22px",
        pill: "999px",
        tile: "9px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(26,26,46,.045)",
        accent: "0 14px 33px -14px rgba(239,98,108,.35)",
        "btn-primary": "0 10px 24px -8px rgba(239,98,108,.65)",
        "chip-primary": "0 6px 16px -6px rgba(239,98,108,.7)",
        shell:
          "0 30px 70px -24px rgba(26,26,46,.42), 0 0 0 1px rgba(26,26,46,.05)",
        focus: "0 0 0 4px rgba(239,98,108,.10)",
      },
    },
  },
  plugins: [],
};
export default config;
