// src/docs/components/Sidebar.tsx

import { useState } from "react";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { DocsProject, DocsRegistry, DocSection } from "../config";
import { buildProjectDocPath, getProjectFirstPage } from "../config";

function SidebarSection({
  section,
  basePath,
  projectId,
}: {
  section: DocSection;
  basePath: string;
  projectId: string;
}) {
  const [open, setOpen] = useState(section.defaultOpen ?? false);

  return (
    <div className="mb-0.5">
      <button
        className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-[0.03em] text-docs-text transition hover:bg-docs-hover"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <ChevronRight
          size={14}
          strokeWidth={2}
          className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span>{section.title}</span>
      </button>
      {open && (
        <ul className="list-none py-0.5 pl-3">
          {section.pages.map((page) => (
            <li key={page.id}>
              <NavLink
                to={buildProjectDocPath(basePath, projectId, page.slug)}
                className={({ isActive }) =>
                  `block rounded-md border-l-2 px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-l-docs-accent bg-docs-accentLight font-medium text-docs-accent"
                      : "border-l-transparent text-docs-textSecondary hover:bg-docs-hover hover:text-docs-text"
                  }`
                }
              >
                {page.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface SidebarProps {
  registry: DocsRegistry;
  project: DocsProject;
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

export function Sidebar({
  registry,
  project,
  isOpen,
  onClose,
  onSearchOpen,
}: SidebarProps) {
  const firstPage = getProjectFirstPage(project);
  const logoPath = firstPage
    ? buildProjectDocPath(registry, project.id, firstPage.slug)
    : registry.basePath;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[35] bg-black/40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex w-[280px] flex-col overflow-y-auto border-r border-docs-border bg-docs-sidebar px-3 pb-6 transition-transform duration-200 md:z-30 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-1 px-1 pb-4 pt-4">
          <NavLink
            to={logoPath}
            className="flex items-center gap-2.5 text-[15px] font-semibold text-docs-text no-underline"
          >
            {project.logo ? (
              <img src={project.logo} alt="" width="24" height="24" />
            ) : (
              <BookOpen size={24} strokeWidth={2} />
            )}
            <span>{project.title}</span>
          </NavLink>
        </div>

        <button
          className="mb-4 flex w-full items-center gap-2 rounded-lg border border-docs-border bg-docs-bg px-3 py-2 text-sm text-docs-textMuted transition hover:border-docs-accent"
          onClick={onSearchOpen}
        >
          <Search size={15} strokeWidth={2} />
          <span>Search docs...</span>
          <kbd className="rounded border border-docs-border bg-docs-secondary px-1.5 py-0.5 text-[11px] text-docs-textMuted">
            ⌘K
          </kbd>
        </button>

        <nav className="flex flex-col gap-1">
          {project.sections.map((section) => (
            <SidebarSection
              key={section.id}
              section={section}
              basePath={registry.basePath}
              projectId={project.id}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}