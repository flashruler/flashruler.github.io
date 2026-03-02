// src/docs/components/ThemeToggle.tsx

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("docs-theme") === "dark" ||
      (!localStorage.getItem("docs-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-docs-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("docs-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-docs-border bg-docs-bg text-docs-textSecondary transition hover:border-docs-accent hover:text-docs-text"
      onClick={toggle}
      aria-label="Toggle theme"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <Sun size={18} strokeWidth={2} />
      ) : (
        <Moon size={18} strokeWidth={2} />
      )}
    </button>
  );
}