import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-docs-border bg-docs-bg text-docs-textSecondary transition hover:border-docs-accent hover:text-docs-text"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={2} />
      ) : (
        <Moon size={18} strokeWidth={2} />
      )}
    </button>
  );
}
