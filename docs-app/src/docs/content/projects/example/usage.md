# Usage

This guide explains how to add and name docs so the tabs, sidebar, and routes show up correctly.

## How tabs work

- Each tab maps to a project ID in `src/docs/config.ts`.
- A tab only shows if that project has at least one markdown file under
  `src/docs/content/projects/<projectId>/`.
- The tab label comes from `tabLabel` in the registry.

## How pages map to files

Pages are configured in `src/docs/config.ts` and must match a markdown file name.

- `path` is the markdown filename (without `.md`).
- `slug` is the URL segment for that page.
- `title` is the sidebar label.

Example:

```ts
{ title: "Quick Start", slug: "quick-start", path: "quick-start" }
```

File required:

```
src/docs/content/projects/example/quick-start.md
```

URL generated:

```
/docs/example/quick-start
```

## Sections and sidebar order

- Sidebar sections are defined in `buildSections()` in `src/docs/config.ts`.
- Pages appear in the sidebar only when the markdown file exists.
- Order is taken from the `pages` array order in each section.

## Adding a new page

1. Add an entry under the correct section in `src/docs/config.ts`.
2. Create the matching markdown file in `src/docs/content/projects/example/`.

Example:

```ts
{ title: "API Tokens", slug: "api-tokens", path: "api-tokens" }
```

```text
src/docs/content/projects/example/api-tokens.md
```

## Removing a page

- Delete the markdown file to hide it from the sidebar.
- Optionally remove the entry from `src/docs/config.ts` to keep the registry tidy.

## Gotchas

- A `path` with no matching file will not render a page.
- A file with no matching entry in `src/docs/config.ts` will not show in the sidebar.
- Project visibility depends on having at least one matching page file.
