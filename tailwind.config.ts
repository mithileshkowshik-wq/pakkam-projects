import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
      // Named steps for the sizes the app reaches for constantly — replaces the scattered
      // text-[11px]/text-[13px]/text-[14.5px] arbitrary values in components touched this pass.
      fontSize: {
        fine: ["11px", { lineHeight: "1.4" }],
        label: ["12.5px", { lineHeight: "1.4" }],
        meta: ["13px", { lineHeight: "1.5" }],
        note: ["13.5px", { lineHeight: "1.5" }],
        body: ["14.5px", { lineHeight: "1.55" }],
      },
      boxShadow: {
        // Layered, softer resting card shadow (was a single flat blur).
        card: "0 1px 2px rgba(34,24,28,.04), 0 6px 18px -6px rgba(34,24,28,.07)",
        // Hover elevation for interactive cards — warm coral tint so lift reads on the pink page bg.
        "card-hover":
          "0 2px 4px rgba(34,24,28,.05), 0 18px 36px -14px rgba(239,98,108,.22)",
        accent: "0 14px 33px -14px rgba(239,98,108,.35)",
        "btn-primary": "0 10px 24px -8px rgba(239,98,108,.65)",
        "chip-primary": "0 6px 16px -6px rgba(239,98,108,.7)",
        // Floating action button / hero CTA glow.
        fab: "0 10px 24px -6px rgba(239,98,108,.55), 0 2px 6px rgba(239,98,108,.28)",
        // Popover/modal-weight elevation (auth card, etc.).
        pop: "0 24px 60px -20px rgba(34,24,28,.28), 0 0 0 1px rgba(34,24,28,.03)",
        // Upward shadow for the mobile bottom tab bar.
        rail: "0 -10px 30px -14px rgba(34,24,28,.22)",
        shell:
          "0 30px 70px -24px rgba(26,26,46,.42), 0 0 0 1px rgba(26,26,46,.05)",
        focus: "0 0 0 4px rgba(239,98,108,.10)",
      },
      backgroundImage: {
        // The single brand gradient — buttons, FAB, active accents all share this exact ramp.
        "brand-gradient": "linear-gradient(120deg,#F4868D 0%,#EF626C 58%,#DE4E59 100%)",
        // Profile banner: wider, softer three-stop sweep.
        "banner-gradient":
          "linear-gradient(115deg,#F7A9AE 0%,#EF626C 52%,#D64550 100%)",
        // Barely-there warm sheen for accent cards (white → blush).
        "card-sheen": "linear-gradient(165deg,#FFFFFF 55%,#FFF3F4 100%)",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },
  plugins: [animate],
};
export default config;
