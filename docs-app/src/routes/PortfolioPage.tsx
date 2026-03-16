import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects, type Project, type ProjectCategory } from "../data/projects";
import { useSiteTheme } from "../theme/useSiteTheme";

const categoryOptions: Array<{ label: string; value: "all" | ProjectCategory }> = [
  { label: "All Projects", value: "all" },
  { label: "Web Development", value: "web-dev" },
  { label: "Machine Learning", value: "ml" },
];

function ThemeButton() {
  const { dark, toggleTheme } = useSiteTheme();

  return (
    <button
      id="theme-toggle"
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {dark ? "☀️" : "🌙"}
      </span>
      <span className="theme-toggle-text">{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 id="dialogTitle" className="text-2xl font-bold text-gray-800">
            {project.title}
          </h3>
          <button
            className="close-dialog rounded px-2 py-1 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close project details"
          >
            ✕
          </button>
        </div>

        <div id="dialogContent" className="space-y-4 text-gray-700">
          {project.image && (
            <img src={project.image} alt={project.title} className="w-full rounded-md" />
          )}

          {project.details.map((line) => (
            <p key={line}>{line}</p>
          ))}

          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PortfolioPage() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.categories.includes(filter));
  }, [filter]);

  return (
    <div className="page min-h-screen bg-gray-100 text-gray-800">
      <div className="bgLines" aria-hidden="true" />
      <div className="content">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/pfp.png"
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h1 className="text-xl font-normal text-gray-800">Jay Buensuceso</h1>
            </div>

            <nav className="flex flex-wrap items-center gap-4 text-gray-800">
              <a href="https://www.linkedin.com/in/jaybuens/" className="hover:text-gray-600">
                linkedin
              </a>
              <a href="https://github.com/flashruler" className="hover:text-gray-600">
                github
              </a>
              <Link to="/resume" className="hover:text-gray-600">
                resume
              </Link>
              <a href="mailto:jbuens001@gmail.com" className="hover:text-gray-600">
                email
              </a>
              <Link to="/docs" className="hover:text-gray-600">
                docs
              </Link>
              <ThemeButton />
            </nav>
          </div>
        </header>

        <main className="container mx-auto mt-8 px-4">
          <section id="about" className="mb-12 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold">
              Hello - I&apos;m Jay, a software engineer interested in full-stack development and machine
              learning!
            </h2>
            <p className="text-lg">
              I graduated from UC San Diego and I enjoy crafting efficient, scalable, and
              user-friendly web applications. Check out some of my projects below!
            </p>
          </section>

          <section id="projects" className="mb-12">
            <h2 className="mb-4 text-3xl font-bold">My Projects</h2>

            <div className="mb-8 flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const active = filter === option.value;
                return (
                  <button
                    key={option.value}
                    className={`rounded-lg px-4 py-2 transition-colors ${
                      active
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <button
                  key={project.title}
                  className="project-card transform rounded-lg bg-white p-6 text-left shadow-md transition-all duration-300 hover:scale-105"
                  onClick={() => setActiveProject(project)}
                >
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">{project.title}</h3>
                  <p className="mb-4 text-gray-600">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={`${project.title}-${tech}`}
                        className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section id="contact" className="mb-12 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold">Let&apos;s Connect!</h2>
            </section>
        </main>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}
