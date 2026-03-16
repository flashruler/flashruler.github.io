import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Resume", href: "/resume" },
    { name: "Field Switcher", href: "/field-switcher" },
    // { name: "Docs", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        <Link to="/" className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/assets/pfp.png" alt="Jay Buensuceso" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <span className="text-xl font-medium tracking-tight">Jay Buensuceso</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <React.Fragment key={link.name}>
              {link.href.startsWith("/") ? (
                <Link
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </a>
              )}
            </React.Fragment>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-4 pt-10">
              {navLinks.map((link) => (
                <React.Fragment key={link.name}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}