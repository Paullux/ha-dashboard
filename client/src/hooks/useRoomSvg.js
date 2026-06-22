import { useState, useEffect } from "react";
import { DARK_COLOR_MAP } from "../config/roomColors";
function applyTheme(svg, theme) {
    if (theme === "light")
        return svg;
    return Object.entries(DARK_COLOR_MAP).reduce((s, [light, dark]) => s.replace(new RegExp(light, "gi"), dark), svg);
}
const cache = {};
export function useRoomSvg(path, theme) {
    const [svg, setSvg] = useState(null);
    useEffect(() => {
        const load = async () => {
            if (!cache[path]) {
                const res = await fetch(path);
                cache[path] = await res.text();
            }
            setSvg(applyTheme(cache[path], theme));
        };
        load().catch(console.error);
    }, [path, theme]);
    return svg;
}
