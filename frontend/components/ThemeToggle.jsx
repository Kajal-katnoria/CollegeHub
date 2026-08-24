"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() =>
        setTheme(
          resolvedTheme === "dark" ? "light" : "dark"
        )
      }
    >
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}