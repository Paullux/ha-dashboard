import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import { DrillDown, DrillItem } from "../DrillDown";
import { ModeButtons } from "../controls/ModeButtons";
import { TempSlider } from "../controls/TempSlider";
import "./ClimateSection.css";
export function ClimateSection({ states }) {
    const [view, setView] = useState(null);
    const call = useServiceCall();
    const cfg = ENTITIES.climate;
    const entity = states[cfg.entity];
    const attrs = entity?.attributes ?? {};
    const currentMode = entity?.state ?? "off";
    const currentTemp = attrs["temperature"] ?? 20;
    const currentFan = attrs["fan_mode"] ?? "low";
    const currentSwing = attrs["swing_mode"] ?? "off";
    const currentIndoor = attrs["current_temperature"];
    const fanModes = cfg.fanModes.map((v, i) => ({
        value: v,
        label: cfg.fanLabels[i] ?? v,
    }));
    if (view === "consigne") {
        return (_jsxs(DrillDown, { title: "Consigne", back: () => setView(null), children: [currentIndoor !== undefined && (_jsxs("div", { className: "climate-current", children: ["Temp\u00E9rature actuelle : ", _jsxs("strong", { children: [currentIndoor, " \u00B0C"] })] })), _jsx(TempSlider, { value: currentTemp, min: 16, max: 30, onChange: (t) => call("climate", "set_temperature", {
                        entity_id: cfg.entity,
                        temperature: t,
                    }) })] }));
    }
    if (view === "mode") {
        return (_jsx(DrillDown, { title: "Mode", back: () => setView(null), children: _jsx(ModeButtons, { modes: cfg.modes, current: currentMode, onSelect: (v) => call("climate", v === "off" ? "turn_off" : "set_hvac_mode", {
                    entity_id: cfg.entity,
                    ...(v !== "off" ? { hvac_mode: v } : {}),
                }) }) }));
    }
    if (view === "ventilateur") {
        return (_jsx(DrillDown, { title: "Ventilateur", back: () => setView(null), children: _jsx(ModeButtons, { modes: fanModes, current: currentFan, onSelect: (v) => call("climate", "set_fan_mode", {
                    entity_id: cfg.entity,
                    fan_mode: v,
                }) }) }));
    }
    if (view === "swing") {
        const swingModes = [
            { label: "Balancement OFF", value: "off" },
            { label: "Balancement ON", value: "on" },
        ];
        return (_jsx(DrillDown, { title: "Sleep / Swing", back: () => setView(null), children: _jsx(ModeButtons, { modes: swingModes, current: currentSwing, onSelect: (v) => call("climate", "set_swing_mode", {
                    entity_id: cfg.entity,
                    swing_mode: v,
                }) }) }));
    }
    // Root view
    const activeMode = cfg.modes.find((m) => m.value === currentMode);
    return (_jsxs(DrillDown, { title: "Climatiseur", children: [_jsxs("div", { className: "climate-status", children: [_jsx("span", { className: "climate-status__mode", style: { color: activeMode?.color ?? "var(--text-muted)" }, children: activeMode?.label ?? currentMode }), _jsxs("span", { className: "climate-status__temp", children: [currentTemp, " \u00B0C"] })] }), _jsx(DrillItem, { label: "Consigne", sub: `${currentTemp} °C`, onClick: () => setView("consigne") }), _jsx(DrillItem, { label: "Mode", sub: activeMode?.label ?? currentMode, accent: activeMode?.color, onClick: () => setView("mode") }), _jsx(DrillItem, { label: "Ventilateur", sub: fanModes.find((f) => f.value === currentFan)?.label ?? currentFan, onClick: () => setView("ventilateur") }), _jsx(DrillItem, { label: "Sleep / Swing", sub: currentSwing === "on" ? "Activé" : "Désactivé", onClick: () => setView("swing") })] }));
}
