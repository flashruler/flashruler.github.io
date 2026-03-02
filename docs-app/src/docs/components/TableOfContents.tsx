// src/docs/components/TableOfContents.tsx

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState("");

  // Parse headings from markdown
  const headings: TocItem[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[`*_\[\]]/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ id, text, level });
    }
  }

  // Intersection observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <aside className="sticky top-20 hidden max-h-[calc(100vh-80px)] w-[220px] shrink-0 overflow-y-auto py-10 pr-4 xl:block">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-docs-textMuted">On this page</div>
      <ul className="border-l border-docs-border">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
          >
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 text-[13px] transition ${
                activeId === h.id
                  ? "border-l-docs-accent text-docs-accent"
                  : "border-l-transparent text-docs-textMuted hover:text-docs-text"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(h.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}