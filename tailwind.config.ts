import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
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
        // "Cobalt Blueprint" palette — every token is CSS-variable-backed (values live in
        // app/globals.css's :root/.dark blocks) so a single `.dark` class toggle on <html>
        // re-resolves the entire theme at once. No plain hex tokens remain.
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          2: "rgb(var(--color-ink-2) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          light: "rgb(var(--color-border-light) / <alpha-value>)",
        },
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-meta": "rgb(var(--color-text-meta) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          light: "rgb(var(--color-primary-light) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
        },
        "accent-border": "rgb(var(--color-accent-border) / <alpha-value>)",
        tag: {
          bg: "rgb(var(--color-tag-bg) / <alpha-value>)",
          text: "rgb(var(--color-tag-text) / <alpha-value>)",
        },
        teal: {
          DEFAULT: "rgb(var(--color-teal) / <alpha-value>)",
          bg: "rgb(var(--color-teal-bg) / <alpha-value>)",
          text: "rgb(var(--color-teal-text) / <alpha-value>)",
        },
        idea: {
          bg: "rgb(var(--color-idea-bg) / <alpha-value>)",
          text: "rgb(var(--color-idea-text) / <alpha-value>)",
          dot: "rgb(var(--color-idea-dot) / <alpha-value>)",
        },
        launch: {
          bg: "rgb(var(--color-launch-bg) / <alpha-value>)",
          text: "rgb(var(--color-launch-text) / <alpha-value>)",
          dot: "rgb(var(--color-launch-dot) / <alpha-value>)",
        },
        // The always-dark rail is gone — the shell is theme-aware paper now — but the token
        // names survive (frozen call sites) and resolve to the structural neutrals per theme.
        sidebar: {
          nav: "rgb(var(--color-sidebar-nav) / <alpha-value>)",
          navActive: "rgb(var(--color-sidebar-nav-active) / <alpha-value>)",
          muted: "rgb(var(--color-sidebar-muted) / <alpha-value>)",
          userSub: "rgb(var(--color-sidebar-user-sub) / <alpha-value>)",
        },
      },
      // Crisper, more technical corner language than the old bubbly 10/16/22 scale.
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        pill: "999px",
        tile: "8px",
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
        // Cool ink resting shadow; cobalt-tinted lift on hover so elevation reads on paper.
        card: "0 1px 2px rgba(17,23,48,.04), 0 6px 18px -6px rgba(17,23,48,.07)",
        "card-hover":
          "0 2px 4px rgba(17,23,48,.05), 0 18px 36px -14px rgba(62,99,221,.20)",
        accent: "0 14px 33px -14px rgba(62,99,221,.28)",
        "btn-primary": "0 10px 24px -8px rgba(62,99,221,.55)",
        "chip-primary": "0 6px 16px -6px rgba(62,99,221,.55)",
        // Floating action button / hero CTA glow.
        fab: "0 10px 24px -6px rgba(62,99,221,.45), 0 2px 6px rgba(62,99,221,.25)",
        // Popover/modal-weight elevation (auth card, etc.).
        pop: "0 24px 60px -20px rgba(17,23,48,.28), 0 0 0 1px rgba(17,23,48,.03)",
        // Upward shadow for the mobile bottom tab bar.
        rail: "0 -10px 30px -14px rgba(17,23,48,.22)",
        shell:
          "0 30px 70px -24px rgba(17,23,48,.42), 0 0 0 1px rgba(17,23,48,.05)",
        focus: "0 0 0 4px rgba(62,99,221,.12)",
      },
      backgroundImage: {
        // The single brand gradient — buttons, FAB, active accents all share this exact ramp.
        "brand-gradient":
          "linear-gradient(135deg,#5B77F0 0%,#3E63DD 55%,#2F4FC4 100%)",
        // Profile banner: deep ink → cobalt blueprint sweep; reads well in both themes.
        "banner-gradient":
          "linear-gradient(118deg,#101736 0%,#24357F 55%,#3E63DD 100%)",
        // Barely-there cool sheen for accent cards (surface → pale cobalt), theme-aware via vars.
        "card-sheen":
          "linear-gradient(165deg, rgb(var(--color-surface)) 50%, rgb(var(--sheen-tint)) 100%)",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },
  plugins: [animate],
};
export default config;
