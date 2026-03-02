// src/docs/components/SearchModal.tsx

import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { buildProjectDocPath } from "../config";

interface SearchModalProps {
  basePath: string;
  projectId: string;
  isOpen: boolean;
  query: string;
  setQuery: (q: string) => void;
  results: {
    title: string;
    slug: string;
    section: string;
    excerpt: string;
  }[];
  onClose: () => void;
}

export function SearchModal({
  basePath,
  projectId,
  isOpen,
  query,
  setQuery,
  results,
  onClose,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Small delay so the modal renders first
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    navigate(buildProjectDocPath(basePath, projectId, slug));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 flex max-h-[480px] w-[560px] flex-col overflow-hidden rounded-2xl border border-docs-border bg-docs-bg shadow-docsLg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-docs-border px-4 py-3.5 text-docs-textMuted">
          <Search size={18} strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-base text-docs-text outline-none placeholder:text-docs-textMuted"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length > 0) {
                handleSelect(results[0].slug);
              }
            }}
          />
          <kbd className="rounded border border-docs-border px-1.5 py-0.5 text-[11px] text-docs-textMuted">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-2">
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-docs-textMuted">
              No results for "{query}"
            </div>
          )}
          {results.map((r) => (
            <button
              key={r.slug}
              className="block w-full rounded-lg px-3.5 py-3 text-left text-docs-text transition hover:bg-docs-hover"
              onClick={() => handleSelect(r.slug)}
            >
              <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-docs-accent">
                {r.section}
              </div>
              <div className="mb-0.5 text-sm font-medium">{r.title}</div>
              {r.excerpt && (
                <div className="truncate text-[13px] text-docs-textMuted">
                  {r.excerpt}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}