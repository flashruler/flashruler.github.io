// src/docs/components/Pagination.tsx

import { Link } from "react-router-dom";
import type { DocPage } from "../config";
import { buildProjectDocPath } from "../config";

interface PaginationProps {
  basePath: string;
  projectId: string;
  prev: DocPage | null;
  next: DocPage | null;
}

export function Pagination({ basePath, projectId, prev, next }: PaginationProps) {
  return (
    <nav className="mt-16 flex flex-col justify-between gap-4 border-t border-docs-border pt-8 md:flex-row">
      {prev ? (
        <Link
          to={buildProjectDocPath(basePath, projectId, prev.slug)}
          className="flex max-w-full flex-col gap-1 rounded-xl border border-docs-border px-5 py-4 no-underline transition hover:border-docs-accent hover:shadow-docs md:max-w-[50%]"
        >
          <span className="text-xs font-medium uppercase tracking-[0.04em] text-docs-textMuted">Previous</span>
          <span className="text-[15px] font-medium text-docs-accent">← {prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={buildProjectDocPath(basePath, projectId, next.slug)}
          className="ml-auto flex max-w-full flex-col gap-1 rounded-xl border border-docs-border px-5 py-4 text-right no-underline transition hover:border-docs-accent hover:shadow-docs md:max-w-[50%]"
        >
          <span className="text-xs font-medium uppercase tracking-[0.04em] text-docs-textMuted">Next</span>
          <span className="text-[15px] font-medium text-docs-accent">{next.title} →</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}