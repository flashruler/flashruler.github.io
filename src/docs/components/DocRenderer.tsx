// src/docs/components/DocRenderer.tsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface DocRendererProps {
  content: string;
  title: string;
}

const calloutStyles: Record<string, string> = {
  note: "border-l-blue-500 bg-blue-500/10",
  tip: "border-l-emerald-500 bg-emerald-500/10",
  warning: "border-l-amber-500 bg-amber-500/10",
  danger: "border-l-rose-500 bg-rose-500/10",
  info: "border-l-indigo-500 bg-indigo-500/10",
};

export function DocRenderer({ content, title }: DocRendererProps) {
  return (
    <article>
      <h1 className="mb-2 text-[2rem] font-bold leading-tight tracking-[-0.02em]">{title}</h1>
      <div className="prose max-w-none prose-headings:tracking-[-0.01em] prose-strong:text-docs-text prose-p:text-docs-textSecondary prose-li:text-docs-textSecondary prose-code:rounded prose-code:border prose-code:border-docs-codeBorder prose-code:bg-docs-codeBg prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-transparent prose-pre:p-0 prose-th:text-docs-text prose-td:text-docs-textSecondary prose-a:text-docs-accent prose-a:underline prose-a:underline-offset-2 [&_h2]:mt-12 [&_h2]:border-b [&_h2]:border-docs-border [&_h2]:pb-2 [&_h3]:mt-8 [&_h4]:mt-6 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-docs-border [&_blockquote]:bg-docs-secondary [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-docs-textSecondary [&_hr]:border-docs-border [&_img]:rounded-lg [&_img]:border [&_img]:border-docs-border [&_table]:w-full [&_table]:text-sm [&_tbody_tr:hover_td]:bg-docs-secondary">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            rehypeHighlight,
          ]}
          components={{
            // Custom callout blocks: > [!NOTE] / > [!WARNING] etc.
            blockquote({ children }) {
              const text =
                children?.toString() || "";
              const noteMatch = text.match(
                /\[!(NOTE|TIP|WARNING|DANGER|INFO)\]/
              );
              if (noteMatch) {
                const type = noteMatch[1].toLowerCase();
                return (
                  <div
                    className={`mb-5 rounded-xl border-l-4 px-5 py-4 ${calloutStyles[type] ?? calloutStyles.info}`}
                  >
                    <div className="mb-1 text-[13px] font-bold uppercase tracking-[0.04em] text-docs-text">
                      {noteMatch[1]}
                    </div>
                    <div>{children}</div>
                  </div>
                );
              }
              return <blockquote>{children}</blockquote>;
            },
            // Copy button on code blocks
            pre({ children }) {
              return (
                <div className="group relative mb-5">
                  <button
                    className="absolute right-2 top-2 rounded-md border border-docs-border bg-docs-bg px-2.5 py-1 text-xs text-docs-textMuted opacity-0 transition hover:border-docs-accent hover:text-docs-text group-hover:opacity-100"
                    onClick={(e) => {
                      const code =
                        (e.currentTarget.parentElement
                          ?.querySelector("code")
                          ?.textContent) || "";
                      navigator.clipboard.writeText(code);
                      e.currentTarget.textContent = "Copied!";
                      setTimeout(() => {
                        e.currentTarget.textContent = "Copy";
                      }, 2000);
                    }}
                  >
                    Copy
                  </button>
                  <pre className="overflow-x-auto rounded-xl border border-docs-codeBorder bg-docs-codeBg px-5 py-4 leading-7">
                    {children}
                  </pre>
                </div>
              );
            },
            // Open external links in new tab
            a({ href, children, ...props }) {
              const isExternal = href?.startsWith("http");
              return (
                <a
                  href={href}
                  className="text-docs-accent underline underline-offset-2 hover:decoration-2"
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}