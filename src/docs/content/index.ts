// src/docs/content/index.ts

// Vite: import all .md files as raw strings
const modules = (import.meta as any).glob("./projects/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Build a map: "flashruler/getting-started" -> markdown string
export const contentMap: Record<string, string> = {};

for (const [filePath, content] of Object.entries(modules)) {
  // "./projects/flashruler/getting-started.md" -> "flashruler/getting-started"
  const key = filePath
    .replace("./projects/", "")
    .replace(".md", "");
  contentMap[key] = content as string;
}