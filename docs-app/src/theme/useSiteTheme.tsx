import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type SiteTheme = "light" | "dark";

interface SiteThemeContextValue {
  theme: SiteTheme;
  dark: boolean;
  toggleTheme: () => void;
  setTheme: (nextTheme: SiteTheme) => void;
}

const STORAGE_KEY = "site-theme";

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

function getInitialTheme(): SiteTheme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(STORAGE_KEY);
  const legacyTheme = localStorage.getItem("theme");
  const legacyDocsTheme = localStorage.getItem("docs-theme");

  if (stored === "light" || stored === "dark") return stored;
  if (legacyTheme === "light" || legacyTheme === "dark") return legacyTheme;
  if (legacyDocsTheme === "light" || legacyDocsTheme === "dark") return legacyDocsTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDom(theme: SiteTheme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("theme-dark", isDark);
  document.documentElement.setAttribute("data-docs-theme", isDark ? "dark" : "light");
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(getInitialTheme);

  useEffect(() => {
    applyThemeToDom(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    localStorage.setItem("theme", theme);
    localStorage.setItem("docs-theme", theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: SiteTheme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      dark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>;
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error("useSiteTheme must be used within SiteThemeProvider");
  }
  return context;
}
