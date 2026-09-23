import typography from '@tailwindcss/typography';

/**
 * "One Bit Forest" — see DESIGN.md. Tokens live in src/styles/global.css as
 * plain custom properties per rendition; this file only maps them for the
 * utility classes that post bodies use in their raw HTML (aspect-video, my-8,
 * rounded-lg, shadow-lg …). Keep the content glob scanning .md for that reason.
 * Radius is 0 everywhere; elevation does not exist.
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["variant", [".night &", ".night-hc &"]],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Big Shoulders Display"', '"Arial Narrow"', 'Arial', 'sans-serif'],
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans JP"', 'system-ui', '-apple-system', '"Segoe UI"', 'Arial', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', '"Times New Roman"', '"IBM Plex Sans JP"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        background: "var(--bg)",
        foreground: "var(--fg)",
        surface: "var(--surface)",
        muted: { DEFAULT: "var(--surface)", foreground: "var(--fg-2)" },
        border: "var(--rule)",
        signal: "var(--signal)",
      },
      boxShadow: {
        none: "none",
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
      },
      // The .prose rules proper live in global.css (section 7); this only
      // points the plugin's own colour hooks at the rendition tokens.
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            '--tw-prose-body': 'var(--fg)',
            '--tw-prose-headings': 'var(--fg)',
            '--tw-prose-lead': 'var(--fg-soft)',
            '--tw-prose-links': 'var(--fg)',
            '--tw-prose-bold': 'var(--fg)',
            '--tw-prose-counters': 'var(--fg-2)',
            '--tw-prose-bullets': 'var(--signal)',
            '--tw-prose-hr': 'var(--rule)',
            '--tw-prose-quotes': 'var(--fg-soft)',
            '--tw-prose-quote-borders': 'var(--signal)',
            '--tw-prose-captions': 'var(--fg-2)',
            '--tw-prose-code': 'var(--signal)',
            '--tw-prose-pre-code': 'var(--fg)',
            '--tw-prose-pre-bg': 'var(--surface)',
            '--tw-prose-th-borders': 'var(--fg-2)',
            '--tw-prose-td-borders': 'var(--rule-2)',
          },
        },
      },
    },
  },
  plugins: [typography],
};
