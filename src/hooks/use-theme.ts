import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") return "system";
        return (localStorage.getItem("monastery360-theme") as Theme) || "system";
    });

    const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            let isDark: boolean;
            if (theme === "system") {
                isDark = mediaQuery.matches;
            } else {
                isDark = theme === "dark";
            }

            if (isDark) {
                root.classList.add("dark");
                setResolvedTheme("dark");
            } else {
                root.classList.remove("dark");
                setResolvedTheme("light");
            }
        };

        applyTheme();
        mediaQuery.addEventListener("change", applyTheme);
        return () => mediaQuery.removeEventListener("change", applyTheme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("monastery360-theme", newTheme);
    };

    const toggleTheme = () => {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
    };

    return { theme, resolvedTheme, setTheme, toggleTheme };
}
