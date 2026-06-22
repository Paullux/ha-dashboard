import { useState, useEffect } from "react";
export function useTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("ha-theme");
        if (saved === "light" || saved === "dark")
            return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("ha-theme", theme);
    }, [theme]);
    const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
    return { theme, toggle };
}
