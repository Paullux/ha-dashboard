import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import { DrillDown, DrillItem } from "../DrillDown";
import { ModeButtons } from "../controls/ModeButtons";
import { TempSlider } from "../controls/TempSlider";
export function HeatingSection({ states }) {
    const [view, setView] = useState({ type: "list" });
    const call = useServiceCall();
    const cfg = ENTITIES.heating;
    if (view.type === "list") {
        return (_jsx(DrillDown, { title: "Chauffage", children: cfg.rooms.map((room, i) => {
                const entity = states[room.entity];
                const temp = entity?.attributes?.["temperature"];
                const mode = entity?.state ?? "—";
                const modeLabel = cfg.modes.find((m) => m.value === mode)?.label ?? mode;
                const modeColor = cfg.modes.find((m) => m.value === mode)?.color;
                return (_jsx(DrillItem, { label: room.label, sub: `${modeLabel}${temp !== undefined ? ` · ${temp} °C` : ""}`, accent: modeColor, onClick: () => setView({ type: "room", index: i }) }, room.entity));
            }) }));
    }
    const room = cfg.rooms[view.index];
    const entity = states[room.entity];
    const attrs = entity?.attributes ?? {};
    const currentMode = entity?.state ?? "off";
    const currentTemp = attrs["temperature"] ?? 16;
    const currentIndoor = attrs["current_temperature"];
    const modeLabel = cfg.modes.find((m) => m.value === currentMode)?.label ?? currentMode;
    const modeColor = cfg.modes.find((m) => m.value === currentMode)?.color;
    if (view.type === "consigne") {
        return (_jsxs(DrillDown, { title: `Consigne — ${room.label}`, back: () => setView({ type: "room", index: view.index }), children: [currentIndoor !== undefined && (_jsxs("div", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }, children: ["Temp\u00E9rature actuelle : ", _jsxs("strong", { style: { color: "var(--text)" }, children: [currentIndoor, " \u00B0C"] })] })), _jsx(TempSlider, { value: currentTemp, min: cfg.minTemp, max: cfg.maxTemp, onChange: (t) => call("climate", "set_temperature", {
                        entity_id: room.entity,
                        temperature: t,
                    }) })] }));
    }
    if (view.type === "mode") {
        return (_jsx(DrillDown, { title: `Mode — ${room.label}`, back: () => setView({ type: "room", index: view.index }), children: _jsx(ModeButtons, { modes: cfg.modes, current: currentMode, onSelect: (v) => call("climate", v === "off" ? "turn_off" : "set_hvac_mode", {
                    entity_id: room.entity,
                    ...(v !== "off" ? { hvac_mode: v } : {}),
                }) }) }));
    }
    // Room detail
    return (_jsxs(DrillDown, { title: room.label, back: () => setView({ type: "list" }), children: [_jsxs("div", { style: {
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.75rem 1rem", background: "var(--surface)",
                    border: "1px solid var(--border)", borderRadius: "0.625rem",
                }, children: [_jsx("span", { style: { color: modeColor ?? "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem" }, children: modeLabel }), _jsxs("span", { style: { color: "var(--accent)", fontWeight: 700, fontSize: "1.5rem" }, children: [currentTemp, " \u00B0C"] })] }), _jsx(DrillItem, { label: "Consigne", sub: `${currentTemp} °C`, onClick: () => setView({ type: "consigne", index: view.index }) }), _jsx(DrillItem, { label: "Mode", sub: modeLabel, accent: modeColor, onClick: () => setView({ type: "mode", index: view.index }) })] }));
}
