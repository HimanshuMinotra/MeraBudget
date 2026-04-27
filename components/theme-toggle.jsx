"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Auto mode logic: Day (6am - 6pm) = Light, Night = Dark
    const handleAutoTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      if (!storedTheme || storedTheme === "system") {
        const hour = new Date().getHours();
        const isDaytime = hour >= 6 && hour < 18;
        setTheme(isDaytime ? "light" : "dark");
      }
    };

    handleAutoTheme();
    // Re-check every hour
    const interval = setInterval(handleAutoTheme, 3600000);
    return () => clearInterval(interval);
  }, [setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10 text-primary">
        <Sun size={20} className="opacity-0" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className={`h-8 w-8 rounded-full transition-all ${theme === "light" ? "shadow-sm" : ""}`}
      >
        <Sun size={18} />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className={`h-8 w-8 rounded-full transition-all ${theme === "dark" ? "shadow-sm" : ""}`}
      >
        <Moon size={18} />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className={`h-8 w-8 rounded-full transition-all ${theme === "system" ? "shadow-sm" : ""}`}
        title="Auto Mode"
      >
        <Monitor size={18} />
      </Button>
    </div>
  );
}
