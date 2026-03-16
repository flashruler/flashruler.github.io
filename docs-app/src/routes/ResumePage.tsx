import { Link } from "react-router-dom";
import { useSiteTheme } from "../theme/useSiteTheme";

function ThemeButton() {
  const { dark, toggleTheme } = useSiteTheme();

  return (
    <button
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

export function ResumePage() {
  return (
    <div className="page min-h-screen bg-gray-100 text-gray-800">
      <div className="content">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/assets/pfp.png"
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <h1 className="text-xl font-normal text-gray-800">Jay Buensuceso</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-800 hover:text-gray-600">
                ← Back to Home
              </Link>
              <ThemeButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto mt-8 px-4 pb-8">
          <div className="min-h-full w-full rounded-lg bg-white p-4 shadow-lg">
            <object
              data="/assets/Jay_Buensuceso_Resume_2025.pdf"
              type="application/pdf"
              className="min-h-[calc(100vh-12rem)] w-full"
            >
              <div className="py-8 text-center">
                <p className="mb-4">Your browser does not support inline PDFs.</p>
                <a
                  href="/assets/Jay_Buensuceso_Resume_2025.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-md bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  Download PDF
                </a>
              </div>
            </object>
          </div>
        </main>
      </div>
    </div>
  );
}
