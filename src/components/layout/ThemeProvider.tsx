"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <>{children}</>;
}
