export interface DocPage {
  id: string;
  title: string;
  slug: string;
  path: string;
  contentPath?: string;
  visible?: boolean;
}

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  pages: DocPage[];
  defaultOpen?: boolean;
  visible?: boolean;
}

export interface DocsProject {
  id: string;
  title: string;
  tabLabel: string;
  description?: string;
  logo?: string;
  visible?: boolean;
  sections: DocSection[];
}

export interface DocsRegistry {
  schemaVersion?: number;
  title: string;
  basePath: string;
  defaultProjectId: string;
  projects: DocsProject[];
}

export interface DocsConfigValidationIssue {
  level: "error" | "warning";
  message: string;
}

export const DOCS_CONFIG_SCHEMA_VERSION = 1;

const makePage = (id: string, title: string, slug: string, path: string): DocPage => ({
  id,
  title,
  slug,
  path,
  contentPath: path,
  visible: true,
});

function buildSections(): DocSection[] {
  return [
    {
      id: "getting-started",
      title: "Getting Started",
      defaultOpen: true,
      visible: true,
      pages: [
        makePage("introduction", "Introduction", "introduction", "getting-started"),
        makePage("installation", "Installation", "installation", "installation"),
        makePage("quick-start", "Quick Start", "quick-start", "quick-start"),
        makePage("usage", "Usage", "usage", "usage"),
      ],
    },
    {
      id: "api-reference",
      title: "API Reference",
      visible: true,
      pages: [
        makePage("configuration", "Configuration", "configuration", "api-configuration"),
        makePage("components", "Components", "components", "api-components"),
        makePage("hooks", "Hooks", "hooks", "api-hooks"),
      ],
    },
    {
      id: "guides",
      title: "Guides",
      visible: true,
      pages: [
        makePage("theming", "Theming", "theming", "guide-theming"),
        makePage("deployment", "Deployment", "deployment", "guide-deployment"),
      ],
    },
  ];
}

export const docsRegistry: DocsRegistry = {
  schemaVersion: DOCS_CONFIG_SCHEMA_VERSION,
  title: "Project Docs",
  basePath: "/docs",
  defaultProjectId: "example",
  projects: [
    {
      id: "example",
      title: "Example",
      tabLabel: "Example",
      sections: buildSections(),
    },
    {
      id: "flashruler",
      title: "Flashruler",
      tabLabel: "Flashruler",
      sections: buildSections(),
    },
    {
      id: "iris",
      title: "Iris",
      tabLabel: "Iris",
      sections: buildSections(),
    },
  ],
};

export function getProjectById(registry: DocsRegistry, projectId: string) {
  return registry.projects.find((project) => project.id === projectId);
}

function uniqueId(prefix: string, fallback: string, index: number) {
  const value = fallback.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${prefix}-${value || index + 1}`;
}

function normalizePage(page: Partial<DocPage>, pageIndex: number): DocPage {
  const contentPath = (page.contentPath || page.path || "").trim();
  const slug = (page.slug || "").trim();
  const title = (page.title || "Untitled Page").trim() || "Untitled Page";
  return {
    id: (page.id || uniqueId("page", slug || title, pageIndex)).trim(),
    title,
    slug: slug || `page-${pageIndex + 1}`,
    path: contentPath,
    contentPath,
    visible: page.visible ?? true,
  };
}

function normalizeSection(section: Partial<DocSection>, sectionIndex: number): DocSection {
  const title = (section.title || "Untitled Section").trim() || "Untitled Section";
  const pages = Array.isArray(section.pages)
    ? section.pages.map((page, pageIndex) => normalizePage(page, pageIndex))
    : [];

  return {
    id: (section.id || uniqueId("section", title, sectionIndex)).trim(),
    title,
    description: (section.description || "").trim(),
    defaultOpen: section.defaultOpen ?? sectionIndex === 0,
    visible: section.visible ?? true,
    pages,
  };
}

function normalizeProject(project: Partial<DocsProject>, projectIndex: number): DocsProject {
  const title = (project.title || "Untitled Project").trim() || "Untitled Project";
  const id = (project.id || uniqueId("project", title, projectIndex)).trim();
  const sections = Array.isArray(project.sections)
    ? project.sections.map((section, sectionIndex) => normalizeSection(section, sectionIndex))
    : [];

  return {
    id,
    title,
    tabLabel: (project.tabLabel || project.title || id).trim(),
    description: (project.description || "").trim(),
    logo: project.logo,
    visible: project.visible ?? true,
    sections,
  };
}

export function normalizeDocsRegistry(input?: Partial<DocsRegistry> | null): DocsRegistry {
  const projects = Array.isArray(input?.projects)
    ? input.projects.map((project, projectIndex) => normalizeProject(project, projectIndex))
    : [];

  const defaultProjectId =
    (input?.defaultProjectId || "").trim() || projects[0]?.id || "";

  return {
    schemaVersion: DOCS_CONFIG_SCHEMA_VERSION,
    title: (input?.title || "Project Docs").trim() || "Project Docs",
    basePath: (input?.basePath || "/docs").trim() || "/docs",
    defaultProjectId,
    projects,
  };
}

export function cloneDocsRegistry(registry: DocsRegistry): DocsRegistry {
  return JSON.parse(JSON.stringify(registry)) as DocsRegistry;
}

export function getDocPageContentPath(page: DocPage): string {
  return (page.contentPath || page.path || "").trim();
}

export function getProjectPages(project: DocsProject): DocPage[] {
  return project.sections
    .filter((section) => section.visible !== false)
    .flatMap((section) => section.pages.filter((page) => page.visible !== false));
}

export function getProjectFirstPage(project: DocsProject): DocPage | null {
  return getProjectPages(project)[0] ?? null;
}

export function getProjectPageBySlug(
  project: DocsProject,
  slug: string
): DocPage | undefined {
  return getProjectPages(project).find((page) => page.slug === slug);
}

export function getProjectPageNeighbors(project: DocsProject, slug: string) {
  const pages = getProjectPages(project);
  const index = pages.findIndex((page) => page.slug === slug);

  return {
    prev: index > 0 ? pages[index - 1] : null,
    next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : null,
  };
}

export function getDefaultProject(registry: DocsRegistry): DocsProject {
  return (
    getProjectById(registry, registry.defaultProjectId) ?? registry.projects[0]
  );
}

export function getVisibleProjects(
  registry: DocsRegistry,
  content: Record<string, string>
): DocsProject[] {
  return registry.projects
    .filter((project) => project.visible !== false)
    .map((project) => {
      const keyPrefix = `${project.id}/`;
      const availablePaths = new Set(
        Object.keys(content)
          .filter((key) => key.startsWith(keyPrefix))
          .map((key) => key.slice(keyPrefix.length))
      );

      return {
        ...project,
        sections: project.sections
          .filter((section) => section.visible !== false)
          .map((section) => ({
            ...section,
            pages: section.pages.filter(
              (page) =>
                page.visible !== false &&
                availablePaths.has(getDocPageContentPath(page))
            ),
          }))
          .filter((section) => section.pages.length > 0),
      };
    })
    .filter((project) => getProjectPages(project).length > 0);
}

export function getPreferredVisibleProject(
  registry: DocsRegistry,
  visibleProjects: DocsProject[]
): DocsProject | null {
  if (visibleProjects.length === 0) return null;
  return (
    visibleProjects.find((project) => project.id === registry.defaultProjectId) ??
    visibleProjects[0]
  );
}

export function buildProjectDocPath(
  basePathOrRegistry: string | Pick<DocsRegistry, "basePath">,
  projectId: string,
  slug: string
) {
  const basePath =
    typeof basePathOrRegistry === "string"
      ? basePathOrRegistry
      : basePathOrRegistry.basePath;
  return `${basePath}/${projectId}/${slug}`;
}

export function getAvailableProjectContentPaths(content: Record<string, string>) {
  return Object.keys(content).reduce<Record<string, string[]>>((acc, key) => {
    const split = key.split("/");
    const [projectId, ...rest] = split;
    const path = rest.join("/");
    if (!projectId || !path) return acc;
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(path);
    return acc;
  }, {});
}

export function validateDocsRegistry(
  registry: DocsRegistry,
  content: Record<string, string>
): DocsConfigValidationIssue[] {
  const issues: DocsConfigValidationIssue[] = [];

  if (registry.projects.length === 0) {
    issues.push({ level: "error", message: "Config must include at least one project." });
    return issues;
  }

  const projectIds = new Set<string>();
  registry.projects.forEach((project) => {
    if (projectIds.has(project.id)) {
      issues.push({ level: "error", message: `Duplicate project id: ${project.id}` });
    }
    projectIds.add(project.id);

    const sectionIds = new Set<string>();
    const pageIds = new Set<string>();
    const pageSlugs = new Set<string>();

    project.sections.forEach((section) => {
      if (sectionIds.has(section.id)) {
        issues.push({ level: "error", message: `Duplicate section id in ${project.id}: ${section.id}` });
      }
      sectionIds.add(section.id);

      section.pages.forEach((page) => {
        if (pageIds.has(page.id)) {
          issues.push({ level: "error", message: `Duplicate page id in ${project.id}: ${page.id}` });
        }
        pageIds.add(page.id);

        if (pageSlugs.has(page.slug)) {
          issues.push({ level: "error", message: `Duplicate page slug in ${project.id}: ${page.slug}` });
        }
        pageSlugs.add(page.slug);

        const contentKey = `${project.id}/${getDocPageContentPath(page)}`;
        if (page.visible !== false && !content[contentKey]) {
          issues.push({
            level: "error",
            message: `Missing markdown for ${project.id}/${page.slug}: ${getDocPageContentPath(page)}`,
          });
        }
      });
    });
  });

  if (!projectIds.has(registry.defaultProjectId)) {
    issues.push({
      level: "warning",
      message: `Default project ${registry.defaultProjectId} is not present. First visible project will be used.`,
    });
  }

  const visibleProjects = getVisibleProjects(registry, content);
  if (visibleProjects.length === 0) {
    issues.push({ level: "error", message: "No visible projects with valid pages remain after applying this config." });
  }

  return issues;
}
