import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function useIsDark(): boolean {
  const { theme } = useTheme();
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  if (theme === "dark") return true;
  if (theme === "light") return false;
  return systemDark;
}
