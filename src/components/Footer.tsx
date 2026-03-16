import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jaybuens/",
    icon: Linkedin,
    openInNewTab: true,
  },
  {
    name: "GitHub",
    href: "https://github.com/flashruler",
    icon: Github,
    openInNewTab: true,
  },
  {
    name: "Email",
    href: "mailto:jbuens001@gmail.com",
    icon: Mail,
    openInNewTab: false,
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Jay Buensuceso</p>
        <nav aria-label="Social links" className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noreferrer" : undefined}
              aria-label={link.name}
              title={link.name}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <link.icon className="h-5 w-5" />
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}