import type { DocsProject, DocsRegistry } from "../config";
import {
  buildProjectDocPath,
  getProjectFirstPage,
  getProjectPageBySlug,
} from "../config";
import { NavLink } from "react-router-dom";

interface ProjectTabsProps {
  registry: DocsRegistry;
  projects: DocsProject[];
  currentSlug: string;
}

export function ProjectTabs({
  registry,
  projects,
  currentSlug,
}: ProjectTabsProps) {
  return (
    <div className="mt-2 flex w-full gap-2 overflow-x-auto pb-1">
      {projects.map((project) => {
        const matchingPage = getProjectPageBySlug(project, currentSlug);
        const firstPage = getProjectFirstPage(project);
        const targetSlug = matchingPage?.slug || firstPage?.slug;

        if (!targetSlug) return null;

        return (
          <NavLink
            key={project.id}
            to={buildProjectDocPath(registry, project.id, targetSlug)}
            className={({ isActive }) =>
              `rounded-lg border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-docs-accent bg-docs-accentLight text-docs-accent"
                  : "border-docs-border text-docs-textSecondary hover:bg-docs-hover hover:text-docs-text"
              }`
            }
          >
            {project.tabLabel}
          </NavLink>
        );
      })}
    </div>
  );
}
