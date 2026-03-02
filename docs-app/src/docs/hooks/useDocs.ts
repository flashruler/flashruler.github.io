// src/docs/hooks/useDocs.ts

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  getPreferredVisibleProject,
  getProjectPageBySlug,
  getProjectPageNeighbors,
  getProjectFirstPage,
  getVisibleProjects,
  buildProjectDocPath,
  getDocPageContentPath,
} from "../config";
import { contentMap } from "../content";
import { useDocsConfig } from "./useDocsConfig";

export function useDocs() {
  const { project: routeProjectId, slug } = useParams<{
    project: string;
    slug: string;
  }>();
  const { registry } = useDocsConfig();

  const visibleProjects = useMemo(
    () => getVisibleProjects(registry, contentMap),
    [registry]
  );
  const defaultProject = useMemo(
    () => getPreferredVisibleProject(registry, visibleProjects),
    [registry, visibleProjects]
  );
  const routeProject = useMemo(
    () => visibleProjects.find((project) => project.id === routeProjectId) ?? null,
    [visibleProjects, routeProjectId]
  );
  const project = routeProject ?? defaultProject;

  if (!project) {
    return {
      registry,
      projects: [] as typeof visibleProjects,
      project: null,
      currentSlug: "",
      page: null,
      content: "",
      neighbors: null,
      redirectTo: null,
    };
  }

  const firstPage = useMemo(() => getProjectFirstPage(project), [project]);

  const currentSlug = slug || firstPage?.slug || "";

  const page = useMemo(
    () => (currentSlug ? getProjectPageBySlug(project, currentSlug) : null),
    [project, currentSlug]
  );

  const content = useMemo(
    () => (page ? contentMap[`${project.id}/${getDocPageContentPath(page)}`] || "" : ""),
    [project, page]
  );

  const neighbors = useMemo(
    () => (currentSlug ? getProjectPageNeighbors(project, currentSlug) : null),
    [project, currentSlug]
  );

  const defaultSlug = defaultProject ? getProjectFirstPage(defaultProject)?.slug : null;

  const redirectTo =
    routeProjectId && !routeProject && defaultProject && defaultSlug
      ? buildProjectDocPath(registry, defaultProject.id, defaultSlug)
      : slug && !page && firstPage
        ? buildProjectDocPath(registry, project.id, firstPage.slug)
        : null;

  return {
    registry,
    projects: visibleProjects,
    project,
    currentSlug,
    page,
    content,
    neighbors,
    redirectTo,
  };
}