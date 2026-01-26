import { Link, useLocation } from "react-router-dom";
import { Code2, BookOpen, Archive, Guitar, User, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";

export const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        to="/blog"
        onClick={() => mobile && setIsOpen(false)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive("/blog") ? "text-primary" : "text-muted-foreground"
          }`}
      >
        <BookOpen className="w-4 h-4" />
        Blog
      </Link>
      <Link
        to="/archive"
        onClick={() => mobile && setIsOpen(false)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive("/archive") ? "text-primary" : "text-muted-foreground"
          }`}
      >
        <Archive className="w-4 h-4" />
        Archive
      </Link>
      <a
        href="https://arda.tr"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => mobile && setIsOpen(false)}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
      >
        <User className="w-4 h-4" />
        arda.tr
      </a>
      <a
        href="https://pagan.tr"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => mobile && setIsOpen(false)}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
      >
        <Guitar className="w-4 h-4" />
        pagan.tr
      </a>
    </>
  );

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          <Code2 className="w-8 h-8 text-primary" />
          Coze
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
