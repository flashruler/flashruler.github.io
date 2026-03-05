import { useState } from "react";
import { Menu, SlidersHorizontal } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DocRenderer } from "./DocRenderer";
import { TableOfContents } from "./TableOfContents";
import { Pagination } from "./Pagination";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "./ThemeToggle";
import { ProjectTabs } from "./ProjectTabs";
import { ConfigEditorModal } from "./ConfigEditorModal";
import { useDocs } from "../hooks/useDocs";
import { useSearch } from "../hooks/useSearch";

export function DocsLayout() {
  const { registry, projects, project, currentSlug, page, content, neighbors, redirectTo } = useDocs();

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-docs-bg px-6 text-center text-docs-textMuted">
        No documentation content found.
      </div>
    );
  }

  const search = useSearch(project);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configEditorOpen, setConfigEditorOpen] = useState(false);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen bg-docs-bg text-docs-text leading-relaxed">
      <Sidebar
        registry={registry}
        project={project}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={search.open}
      />

      <div className="ml-0 min-w-0 flex-1 md:ml-[280px]">
        <header className="sticky top-0 z-20 border-b border-docs-border bg-docs-bg/85 px-6 py-2 backdrop-blur">
          <div className="flex h-10 items-center">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-docs-text transition hover:bg-docs-hover md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <div className="flex-1" />
          <button
            className="mr-2 flex h-9 items-center gap-1.5 rounded-lg border border-docs-border bg-docs-bg px-2.5 text-xs font-medium text-docs-textSecondary transition hover:border-docs-accent hover:text-docs-text"
            onClick={() => setConfigEditorOpen(true)}
            aria-label="Open docs config editor"
          >
            <SlidersHorizontal size={14} strokeWidth={2} />
            Config
          </button>
          <ThemeToggle />
          </div>
          <ProjectTabs
            registry={registry}
            projects={projects}
            currentSlug={currentSlug}
          />
        </header>

        <div className="mx-auto flex w-full max-w-[1200px]">
          <div className="min-w-0 flex-1 px-5 pb-16 pt-6 md:max-w-[768px] md:px-12 md:pb-20 md:pt-10">
            {page && content ? (
              <>
                <DocRenderer content={content} title={page.title} />
                <Pagination
                  basePath={registry.basePath}
                  projectId={project.id}
                  prev={neighbors?.prev ?? null}
                  next={neighbors?.next ?? null}
                />
              </>
            ) : (
              <div className="px-5 py-20 text-center">
                <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
                <p className="text-docs-textMuted">The doc you're looking for doesn't exist.</p>
              </div>
            )}
          </div>
          {content && <TableOfContents content={content} />}
        </div>
      </div>

      <SearchModal
        basePath={registry.basePath}
        projectId={project.id}
        isOpen={search.isOpen}
        query={search.query}
        setQuery={search.setQuery}
        results={search.results}
        onClose={search.close}
      />

      <ConfigEditorModal
        isOpen={configEditorOpen}
        onClose={() => setConfigEditorOpen(false)}
        initialProjectId={project.id}
      />
    </div>
  );
}