import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import { DrillDown, DrillItem } from "../DrillDown";
import { BrightnessSlider } from "../controls/BrightnessSlider";
import { ColorPresets } from "../controls/ColorPresets";
import "./LightsSection.css";
function RoomLightControl({ room, entity, onBack, }) {
    const call = useServiceCall();
    const isOn = entity?.state === "on";
    const attrs = entity?.attributes ?? {};
    const brightness = attrs["brightness"] ?? 0;
    return (_jsxs(DrillDown, { title: room.label, back: onBack, children: [_jsxs("div", { className: "light-toggle", children: [_jsx("span", { className: "light-toggle__label", children: isOn ? "Allumée" : "Éteinte" }), _jsx("button", { className: `light-toggle__btn ${isOn ? "light-toggle__btn--on" : ""}`, onClick: () => call("light", isOn ? "turn_off" : "turn_on", { entity_id: room.entity }), children: isOn ? "ON" : "OFF" })] }), isOn && (_jsx(BrightnessSlider, { value: brightness, onChange: (v) => call("light", "turn_on", { entity_id: room.entity, brightness: v }) })), isOn && (_jsx(ColorPresets, { presets: room.colorPresets, onSelect: (p) => {
                    const data = { entity_id: room.entity };
                    if (p.kelvin)
                        data["color_temp_kelvin"] = p.kelvin;
                    else if (p.rgb)
                        data["rgb_color"] = p.rgb;
                    call("light", "turn_on", data);
                } }))] }));
}
export function LightsSection({ states }) {
    const [view, setView] = useState({ type: "list" });
    const cfg = ENTITIES.lights;
    if (view.type === "room") {
        const room = cfg.rooms[view.index];
        return (_jsx(RoomLightControl, { room: room, entity: states[room.entity], onBack: () => setView({ type: "list" }) }));
    }
    return (_jsx(DrillDown, { title: "Lumi\u00E8res", children: cfg.rooms.map((room, i) => {
            const entity = states[room.entity];
            const isOn = entity?.state === "on";
            const attrs = entity?.attributes ?? {};
            const brightness = attrs["brightness"];
            const pct = brightness !== undefined ? Math.round((brightness / 255) * 100) : undefined;
            return (_jsx(DrillItem, { label: room.label, sub: isOn ? `Allumée${pct !== undefined ? ` · ${pct}%` : ""}` : "Éteinte", accent: isOn ? "var(--on)" : undefined, onClick: () => setView({ type: "room", index: i }) }, room.entity));
        }) }));
}
