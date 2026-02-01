"use client";

// ----------------------------------------
// Imports
// ----------------------------------------

// 3rd party
import { useTheme } from "next-themes";
import { Computer, Sun, Moon } from "lucide-react";

// ----------------------------------------
// Theme switch component
// ----------------------------------------
export function ThemeSwitchMobile() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-y mt-4 w-full flex items-center justify-between">
      <button
        className={`${theme === "system" ? "bg-brand/10 text-brand" : ""} w-full flex items-center justify-center py-2`}
        onClick={() => setTheme("system")}
      >
        <Computer size={16} onClick={() => setTheme("system")} />
      </button>
      <button
        className={`${theme === "light" ? "bg-brand/10 text-brand" : ""} w-full flex items-center justify-center py-2 border-x`}
        onClick={() => setTheme("light")}
      >
        <Sun size={16} />
      </button>
      <button
        className={`${theme === "dark" ? "bg-brand/10 text-brand" : ""} w-full flex items-center justify-center py-2`}
        onClick={() => setTheme("dark")}
      >
        <Moon size={16} onClick={() => setTheme("dark")} />
      </button>
    </div>
  );
}
