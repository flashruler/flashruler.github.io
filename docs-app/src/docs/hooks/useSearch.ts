// src/docs/hooks/useSearch.ts

import { useMemo, useState, useCallback, useEffect } from "react";
import type { DocsProject } from "../config";
import { getDocPageContentPath, getProjectPages } from "../config";
import { contentMap } from "../content";

interface SearchResult {
  title: string;
  slug: string;
  section: string;
  excerpt: string;
}

export function useSearch(project: DocsProject) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, close]);

  // Index: precompute lowercase content for each page
  const index = useMemo(() => {
    return getProjectPages(project).map((page) => {
      const section =
        project.sections.find((s) =>
          s.pages.some((p) => p.slug === page.slug)
        )?.title || "";
      return {
        ...page,
        section,
        lowerTitle: page.title.toLowerCase(),
        lowerContent: (contentMap[`${project.id}/${getDocPageContentPath(page)}`] || "").toLowerCase(),
        rawContent: contentMap[`${project.id}/${getDocPageContentPath(page)}`] || "",
      };
    }).filter((item) => item.rawContent.trim().length > 0);
  }, [project]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return index
      .filter((item) => item.lowerTitle.includes(q) || item.lowerContent.includes(q))
      .map((item) => {
        // Extract excerpt around match
        const pos = item.lowerContent.indexOf(q);
        let excerpt = "";
        if (pos !== -1) {
          const start = Math.max(0, pos - 40);
          const end = Math.min(item.rawContent.length, pos + q.length + 80);
          excerpt =
            (start > 0 ? "..." : "") +
            item.rawContent.slice(start, end).replace(/[#*_`\n]/g, " ") +
            (end < item.rawContent.length ? "..." : "");
        }
        return {
          title: item.title,
          slug: item.slug,
          section: item.section,
          excerpt,
        };
      })
      .slice(0, 10);
  }, [query, index]);

  return { query, setQuery, results, isOpen, open, close };
}