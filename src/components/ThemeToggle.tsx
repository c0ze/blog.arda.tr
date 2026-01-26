import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const themes = ["dark", "light", "dracula"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as typeof themes[number]);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary border border-border text-muted-foreground"
        aria-label="Toggle theme"
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
      title={`Current: ${theme}`}
    >
      {theme === "dark" && <Moon className="w-4 h-4" />}
      {theme === "light" && <Sun className="w-4 h-4" />}
      {theme === "dracula" && (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 14l2-4 2 4" />
          <path d="M12 14l2-4 2 4" />
        </svg>
      )}
    </button>
  );
}
