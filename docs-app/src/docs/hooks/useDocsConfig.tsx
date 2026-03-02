import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  cloneDocsRegistry,
  docsRegistry,
  getAvailableProjectContentPaths,
  normalizeDocsRegistry,
  type DocsConfigValidationIssue,
  type DocsRegistry,
  validateDocsRegistry,
} from "../config";
import { contentMap } from "../content";

interface ImportResult {
  ok: boolean;
  issues: DocsConfigValidationIssue[];
  message?: string;
}

interface DocsConfigContextValue {
  registry: DocsRegistry;
  baseRegistry: DocsRegistry;
  availablePathsByProject: Record<string, string[]>;
  issues: DocsConfigValidationIssue[];
  dirty: boolean;
  updateRegistry: (updater: (current: DocsRegistry) => DocsRegistry) => void;
  replaceRegistry: (nextRegistry: DocsRegistry) => void;
  resetRegistry: () => void;
  importRegistryFromJson: (jsonText: string) => ImportResult;
  exportRegistryToJson: () => string;
}

const DocsConfigContext = createContext<DocsConfigContextValue | null>(null);

function sortPathsMap(pathsByProject: Record<string, string[]>) {
  return Object.fromEntries(
    Object.entries(pathsByProject).map(([projectId, paths]) => [
      projectId,
      [...paths].sort((a, b) => a.localeCompare(b)),
    ])
  );
}

export function DocsConfigProvider({ children }: { children: ReactNode }) {
  const baseRegistry = useMemo(
    () => normalizeDocsRegistry(docsRegistry),
    []
  );
  const [registry, setRegistry] = useState<DocsRegistry>(() =>
    cloneDocsRegistry(baseRegistry)
  );

  const availablePathsByProject = useMemo(
    () => sortPathsMap(getAvailableProjectContentPaths(contentMap)),
    []
  );

  const issues = useMemo(
    () => validateDocsRegistry(registry, contentMap),
    [registry]
  );

  const dirty = useMemo(
    () => JSON.stringify(baseRegistry) !== JSON.stringify(registry),
    [baseRegistry, registry]
  );

  const replaceRegistry = useCallback((nextRegistry: DocsRegistry) => {
    setRegistry(normalizeDocsRegistry(nextRegistry));
  }, []);

  const updateRegistry = useCallback(
    (updater: (current: DocsRegistry) => DocsRegistry) => {
      setRegistry((current) => normalizeDocsRegistry(updater(cloneDocsRegistry(current))));
    },
    []
  );

  const resetRegistry = useCallback(() => {
    setRegistry(cloneDocsRegistry(baseRegistry));
  }, [baseRegistry]);

  const importRegistryFromJson = useCallback((jsonText: string): ImportResult => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<DocsRegistry>;
      const nextRegistry = normalizeDocsRegistry(parsed);
      const validation = validateDocsRegistry(nextRegistry, contentMap);
      const hasError = validation.some((issue) => issue.level === "error");
      if (hasError) {
        return {
          ok: false,
          issues: validation,
          message: "Import failed due to validation errors.",
        };
      }

      setRegistry(nextRegistry);
      return {
        ok: true,
        issues: validation,
      };
    } catch {
      return {
        ok: false,
        issues: [{ level: "error", message: "Invalid JSON file." }],
        message: "Import failed due to invalid JSON.",
      };
    }
  }, []);

  const exportRegistryToJson = useCallback(() => {
    return JSON.stringify(registry, null, 2);
  }, [registry]);

  const value = useMemo(
    () => ({
      registry,
      baseRegistry,
      availablePathsByProject,
      issues,
      dirty,
      updateRegistry,
      replaceRegistry,
      resetRegistry,
      importRegistryFromJson,
      exportRegistryToJson,
    }),
    [
      registry,
      baseRegistry,
      availablePathsByProject,
      issues,
      dirty,
      updateRegistry,
      replaceRegistry,
      resetRegistry,
      importRegistryFromJson,
      exportRegistryToJson,
    ]
  );

  return (
    <DocsConfigContext.Provider value={value}>{children}</DocsConfigContext.Provider>
  );
}

export function useDocsConfig() {
  const context = useContext(DocsConfigContext);
  if (!context) {
    throw new Error("useDocsConfig must be used within DocsConfigProvider");
  }
  return context;
}
