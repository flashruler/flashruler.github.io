import { useEffect, useMemo, useState } from "react";
import { Download, Upload, RotateCcw, X, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { DocPage, DocSection, DocsProject } from "../config";
import { useDocsConfig } from "../hooks/useDocsConfig";

interface ConfigEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function SectionEditor({
  section,
  sectionIndex,
  isFirst,
  isLast,
  availablePaths,
  onMove,
  onDelete,
  onChange,
  onAddPage,
  onPageMove,
  onPageDelete,
  onPageChange,
}: {
  section: DocSection;
  sectionIndex: number;
  isFirst: boolean;
  isLast: boolean;
  availablePaths: string[];
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
  onChange: (patch: Partial<DocSection>) => void;
  onAddPage: () => void;
  onPageMove: (pageIndex: number, direction: -1 | 1) => void;
  onPageDelete: (pageIndex: number) => void;
  onPageChange: (pageIndex: number, patch: Partial<DocPage>) => void;
}) {
  return (
    <div className="rounded-xl border border-docs-border bg-docs-secondary p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-docs-text">Section #{sectionIndex + 1}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md border border-docs-border p-1 text-docs-textSecondary transition hover:text-docs-text disabled:opacity-50"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            title="Move section up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            className="rounded-md border border-docs-border p-1 text-docs-textSecondary transition hover:text-docs-text disabled:opacity-50"
            onClick={() => onMove(1)}
            disabled={isLast}
            title="Move section down"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            className="rounded-md border border-docs-border p-1 text-rose-400 transition hover:text-rose-300"
            onClick={onDelete}
            title="Delete section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-docs-textMuted">
          Section title
          <input
            value={section.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="rounded-md border border-docs-border bg-docs-bg px-2.5 py-2 text-sm text-docs-text outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-docs-textMuted">
          Description
          <input
            value={section.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            className="rounded-md border border-docs-border bg-docs-bg px-2.5 py-2 text-sm text-docs-text outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-docs-textMuted">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.visible !== false}
            onChange={(e) => onChange({ visible: e.target.checked })}
          />
          Visible
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.defaultOpen ?? false}
            onChange={(e) => onChange({ defaultOpen: e.target.checked })}
          />
          Default open in sidebar
        </label>
      </div>

      <div className="mt-4 space-y-2 rounded-lg border border-docs-border bg-docs-bg p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.03em] text-docs-textMuted">Pages</div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-docs-border px-2 py-1 text-xs text-docs-textSecondary transition hover:text-docs-text"
            onClick={onAddPage}
          >
            <Plus size={12} /> Add page
          </button>
        </div>

        {section.pages.length === 0 && (
          <div className="rounded-md border border-dashed border-docs-border p-3 text-xs text-docs-textMuted">
            No pages yet.
          </div>
        )}

        {section.pages.map((page, pageIndex) => (
          <div key={page.id} className="rounded-md border border-docs-border bg-docs-secondary p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium text-docs-textSecondary">Page #{pageIndex + 1}</div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded border border-docs-border p-1 text-docs-textSecondary transition hover:text-docs-text disabled:opacity-50"
                  onClick={() => onPageMove(pageIndex, -1)}
                  disabled={pageIndex === 0}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  className="rounded border border-docs-border p-1 text-docs-textSecondary transition hover:text-docs-text disabled:opacity-50"
                  onClick={() => onPageMove(pageIndex, 1)}
                  disabled={pageIndex === section.pages.length - 1}
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  type="button"
                  className="rounded border border-docs-border p-1 text-rose-400 transition hover:text-rose-300"
                  onClick={() => onPageDelete(pageIndex)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex flex-col gap-1 text-[11px] text-docs-textMuted">
                Title
                <input
                  value={page.title}
                  onChange={(e) => onPageChange(pageIndex, { title: e.target.value })}
                  className="rounded border border-docs-border bg-docs-bg px-2 py-1.5 text-xs text-docs-text outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-docs-textMuted">
                Slug
                <input
                  value={page.slug}
                  onChange={(e) => onPageChange(pageIndex, { slug: e.target.value })}
                  className="rounded border border-docs-border bg-docs-bg px-2 py-1.5 text-xs text-docs-text outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-docs-textMuted">
                Markdown source
                <select
                  value={page.contentPath || page.path || ""}
                  onChange={(e) =>
                    onPageChange(pageIndex, { contentPath: e.target.value, path: e.target.value })
                  }
                  className="rounded border border-docs-border bg-docs-bg px-2 py-1.5 text-xs text-docs-text outline-none"
                >
                  <option value="">Select markdown file</option>
                  {availablePaths.map((path) => (
                    <option key={path} value={path}>
                      {path}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-2 inline-flex items-center gap-2 text-[11px] text-docs-textMuted">
              <input
                type="checkbox"
                checked={page.visible !== false}
                onChange={(e) => onPageChange(pageIndex, { visible: e.target.checked })}
              />
              Visible
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfigEditorModal({ isOpen, onClose, initialProjectId }: ConfigEditorModalProps) {
  const {
    registry,
    availablePathsByProject,
    issues,
    dirty,
    updateRegistry,
    resetRegistry,
    exportRegistryToJson,
    importRegistryFromJson,
  } = useDocsConfig();

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || registry.projects[0]?.id || "");
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
      return;
    }
    if (!registry.projects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(registry.projects[0]?.id || "");
    }
  }, [isOpen, initialProjectId, registry.projects, selectedProjectId]);

  const projectIndex = registry.projects.findIndex((project) => project.id === selectedProjectId);
  const selectedProject = projectIndex >= 0 ? registry.projects[projectIndex] : null;
  const availablePaths = selectedProject ? availablePathsByProject[selectedProject.id] || [] : [];

  const sortedIssues = useMemo(
    () => [...issues].sort((a, b) => (a.level === b.level ? 0 : a.level === "error" ? -1 : 1)),
    [issues]
  );

  if (!isOpen) return null;

  const updateProject = (updater: (project: DocsProject) => DocsProject) => {
    if (!selectedProject) return;
    updateRegistry((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === selectedProject.id ? updater(project) : project
      ),
    }));
  };

  const handleExport = () => {
    const json = exportRegistryToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "docs-config.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const result = importRegistryFromJson(text);
    if (result.ok) {
      setImportStatus({ type: "success", message: "Config imported successfully." });
      if (!registry.projects.some((project) => project.id === selectedProjectId)) {
        setSelectedProjectId(registry.projects[0]?.id || "");
      }
      return;
    }

    setImportStatus({
      type: "error",
      message: result.message || result.issues.map((issue) => issue.message).join(" "),
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex h-[90vh] w-full max-w-[1160px] flex-col overflow-hidden rounded-2xl border border-docs-border bg-docs-bg shadow-docsLg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-docs-border px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-docs-text">Docs Config Editor</h2>
            <p className="text-xs text-docs-textMuted">Project-dependent configuration via frontend with JSON export/import.</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-docs-border p-2 text-docs-textSecondary transition hover:text-docs-text"
            onClick={onClose}
            aria-label="Close config editor"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-b border-docs-border p-4 md:border-b-0 md:border-r">
            <div className="space-y-3">
              <label className="flex flex-col gap-1 text-xs text-docs-textMuted">
                Active project
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="rounded-md border border-docs-border bg-docs-secondary px-2.5 py-2 text-sm text-docs-text outline-none"
                >
                  {registry.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.id})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs text-docs-textMuted">
                Default project
                <select
                  value={registry.defaultProjectId}
                  onChange={(e) =>
                    updateRegistry((current) => ({
                      ...current,
                      defaultProjectId: e.target.value,
                    }))
                  }
                  className="rounded-md border border-docs-border bg-docs-secondary px-2.5 py-2 text-sm text-docs-text outline-none"
                >
                  {registry.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.id})
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-docs-border px-2.5 py-1.5 text-xs text-docs-textSecondary transition hover:text-docs-text"
                  onClick={handleExport}
                >
                  <Download size={13} /> Export JSON
                </button>

                <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-docs-border px-2.5 py-1.5 text-xs text-docs-textSecondary transition hover:text-docs-text">
                  <Upload size={13} /> Import JSON
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      void handleImportFile(e.target.files?.[0]);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-docs-border px-2.5 py-1.5 text-xs text-docs-textSecondary transition hover:text-docs-text"
                  onClick={resetRegistry}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              <div className="rounded-md border border-docs-border bg-docs-secondary p-2 text-[11px] text-docs-textMuted">
                Status: {dirty ? "Modified" : "Base"}
              </div>

              {importStatus && (
                <div
                  className={`rounded-md border p-2 text-xs ${
                    importStatus.type === "error"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {importStatus.message}
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.03em] text-docs-textMuted">Validation</div>
                {sortedIssues.length === 0 ? (
                  <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-2 text-xs text-emerald-300">
                    No validation issues.
                  </div>
                ) : (
                  sortedIssues.map((issue, index) => (
                    <div
                      key={`${issue.level}-${index}`}
                      className={`rounded-md border p-2 text-xs ${
                        issue.level === "error"
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      {issue.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <main className="overflow-y-auto p-4">
            {!selectedProject ? (
              <div className="rounded-lg border border-dashed border-docs-border p-5 text-sm text-docs-textMuted">
                No project selected.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-docs-border bg-docs-secondary p-4">
                  <div className="mb-3 text-sm font-semibold text-docs-text">Project Metadata</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs text-docs-textMuted">
                      Project title
                      <input
                        value={selectedProject.title}
                        onChange={(e) => updateProject((project) => ({ ...project, title: e.target.value }))}
                        className="rounded-md border border-docs-border bg-docs-bg px-2.5 py-2 text-sm text-docs-text outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-docs-textMuted">
                      Tab label
                      <input
                        value={selectedProject.tabLabel}
                        onChange={(e) => updateProject((project) => ({ ...project, tabLabel: e.target.value }))}
                        className="rounded-md border border-docs-border bg-docs-bg px-2.5 py-2 text-sm text-docs-text outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-docs-textMuted md:col-span-2">
                      Description
                      <textarea
                        value={selectedProject.description || ""}
                        onChange={(e) => updateProject((project) => ({ ...project, description: e.target.value }))}
                        className="min-h-[70px] rounded-md border border-docs-border bg-docs-bg px-2.5 py-2 text-sm text-docs-text outline-none"
                      />
                    </label>
                  </div>
                  <label className="mt-3 inline-flex items-center gap-2 text-xs text-docs-textMuted">
                    <input
                      type="checkbox"
                      checked={selectedProject.visible !== false}
                      onChange={(e) => updateProject((project) => ({ ...project, visible: e.target.checked }))}
                    />
                    Project visible
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-docs-text">Sections</div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-docs-border px-2.5 py-1.5 text-xs text-docs-textSecondary transition hover:text-docs-text"
                    onClick={() =>
                      updateProject((project) => ({
                        ...project,
                        sections: [
                          ...project.sections,
                          {
                            id: createId("section"),
                            title: "New Section",
                            description: "",
                            defaultOpen: false,
                            visible: true,
                            pages: [],
                          },
                        ],
                      }))
                    }
                  >
                    <Plus size={13} /> Add section
                  </button>
                </div>

                {selectedProject.sections.length === 0 && (
                  <div className="rounded-lg border border-dashed border-docs-border p-5 text-sm text-docs-textMuted">
                    No sections yet.
                  </div>
                )}

                {selectedProject.sections.map((section, sectionIndex) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    sectionIndex={sectionIndex}
                    isFirst={sectionIndex === 0}
                    isLast={sectionIndex === selectedProject.sections.length - 1}
                    availablePaths={availablePaths}
                    onMove={(direction) =>
                      updateProject((project) => ({
                        ...project,
                        sections: moveItem(project.sections, sectionIndex, sectionIndex + direction),
                      }))
                    }
                    onDelete={() =>
                      updateProject((project) => ({
                        ...project,
                        sections: project.sections.filter((_, index) => index !== sectionIndex),
                      }))
                    }
                    onChange={(patch) =>
                      updateProject((project) => ({
                        ...project,
                        sections: project.sections.map((currentSection, index) =>
                          index === sectionIndex
                            ? {
                                ...currentSection,
                                ...patch,
                              }
                            : currentSection
                        ),
                      }))
                    }
                    onAddPage={() =>
                      updateProject((project) => {
                        const fallbackPath = availablePaths[0] || "";
                        return {
                          ...project,
                          sections: project.sections.map((currentSection, index) => {
                            if (index !== sectionIndex) return currentSection;
                            return {
                              ...currentSection,
                              pages: [
                                ...currentSection.pages,
                                {
                                  id: createId("page"),
                                  title: "New Page",
                                  slug: `new-page-${currentSection.pages.length + 1}`,
                                  path: fallbackPath,
                                  contentPath: fallbackPath,
                                  visible: true,
                                },
                              ],
                            };
                          }),
                        };
                      })
                    }
                    onPageMove={(pageIndex, direction) =>
                      updateProject((project) => ({
                        ...project,
                        sections: project.sections.map((currentSection, index) => {
                          if (index !== sectionIndex) return currentSection;
                          return {
                            ...currentSection,
                            pages: moveItem(
                              currentSection.pages,
                              pageIndex,
                              pageIndex + direction
                            ),
                          };
                        }),
                      }))
                    }
                    onPageDelete={(pageIndex) =>
                      updateProject((project) => ({
                        ...project,
                        sections: project.sections.map((currentSection, index) => {
                          if (index !== sectionIndex) return currentSection;
                          return {
                            ...currentSection,
                            pages: currentSection.pages.filter((_, idx) => idx !== pageIndex),
                          };
                        }),
                      }))
                    }
                    onPageChange={(pageIndex, patch) =>
                      updateProject((project) => ({
                        ...project,
                        sections: project.sections.map((currentSection, index) => {
                          if (index !== sectionIndex) return currentSection;
                          return {
                            ...currentSection,
                            pages: currentSection.pages.map((page, idx) =>
                              idx === pageIndex
                                ? {
                                    ...page,
                                    ...patch,
                                  }
                                : page
                            ),
                          };
                        }),
                      }))
                    }
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
