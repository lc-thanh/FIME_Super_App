"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ThemeLogoProps {
  lightLogo: string; // Path to logo for light mode
  darkLogo: string; // Path to logo for dark mode
  width?: number;
  height?: number;
  alt?: string;
}

export default function ThemeLogo({
  lightLogo,
  darkLogo,
  width = 32,
  height = 32,
  alt = "Logo",
}: ThemeLogoProps) {
  const { theme } = useTheme();
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );

  useEffect(() => {
    // If theme is explicitly set to light or dark, use that
    if (theme === "light" || theme === "dark") {
      setEffectiveTheme(theme);
      return;
    }

    // If theme is "system", check system preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setEffectiveTheme(systemTheme);

      // Listen for changes in system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // When theme is dark, use light logo and vice versa
  const logoSrc = effectiveTheme === "dark" ? lightLogo : darkLogo;

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      width={width}
      height={height}
      alt={alt}
    />
  );
}
