"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Toggle variant="outline" size="sm" onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-8 w-8" />
      ) : (
        <Sun className="h-8 w-8" />
      )}
    </Toggle>
  );
}
