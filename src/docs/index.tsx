// src/docs/index.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { DocsLayout } from "./components/DocsLayout";
import {
  type DocsRegistry,
  getPreferredVisibleProject,
  getProjectFirstPage,
  getVisibleProjects,
  buildProjectDocPath,
} from "./config";
import { contentMap } from "./content";
import { DocsConfigProvider, useDocsConfig } from "./hooks/useDocsConfig";

function ProjectIndexRedirect({ registry }: { registry: DocsRegistry }) {
  const { project: routeProjectId } = useParams<{ project: string }>();
  const visibleProjects = useMemo(
    () => getVisibleProjects(registry, contentMap),
    [registry]
  );
  const defaultProject = useMemo(
    () => getPreferredVisibleProject(registry, visibleProjects),
    [registry, visibleProjects]
  );
  const project =
    visibleProjects.find((p) => p.id === routeProjectId) || defaultProject;

  if (!project) {
    return <Navigate to={registry.basePath} replace />;
  }

  const firstPage = getProjectFirstPage(project);

  if (!firstPage) {
    return <Navigate to={registry.basePath} replace />;
  }

  return (
    <Navigate
      to={buildProjectDocPath(registry, project.id, firstPage.slug)}
      replace
    />
  );
}

function DocsRoutesContent() {
  const { registry } = useDocsConfig();
  const visibleProjects = getVisibleProjects(registry, contentMap);
  const defaultProject = getPreferredVisibleProject(registry, visibleProjects);
  if (!defaultProject) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center px-6 text-center text-docs-textMuted">
              No documentation pages are available yet.
            </div>
          }
        />
      </Routes>
    );
  }
  const firstPage = getProjectFirstPage(defaultProject);
  const defaultPath = firstPage
    ? buildProjectDocPath(registry, defaultProject.id, firstPage.slug)
    : registry.basePath;

  return (
    <Routes>
      <Route index element={<Navigate to={defaultPath} replace />} />
      <Route path=":project" element={<ProjectIndexRedirect registry={registry} />} />
      <Route path=":project/:slug" element={<DocsLayout />} />
      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

export function DocsRouter() {
  return (
    <DocsConfigProvider>
      <DocsRoutesContent />
    </DocsConfigProvider>
  );
}