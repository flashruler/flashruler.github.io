import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        docs: {
          bg: "var(--docs-bg)",
          secondary: "var(--docs-bg-secondary)",
          sidebar: "var(--docs-sidebar-bg)",
          text: "var(--docs-text)",
          textSecondary: "var(--docs-text-secondary)",
          textMuted: "var(--docs-text-muted)",
          border: "var(--docs-border)",
          accent: "var(--docs-accent)",
          accentLight: "var(--docs-accent-light)",
          codeBg: "var(--docs-code-bg)",
          codeBorder: "var(--docs-code-border)",
          hover: "var(--docs-hover)",
        },
      },
      boxShadow: {
        docs: "var(--docs-shadow)",
        docsLg: "var(--docs-shadow-lg)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
