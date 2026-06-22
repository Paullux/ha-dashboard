import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ENTITIES } from "../config/dashboard";
import { useServiceCall } from "../hooks/useServiceCall";
import "./RightPanel.css";
function QuickActions(_) {
    const call = useServiceCall();
    return (_jsxs("div", { className: "rp-section", children: [_jsx("h3", { className: "rp-title", children: "Actions rapides" }), _jsx("div", { className: "quick-actions", children: ENTITIES.quickActions.map((a) => (_jsxs("button", { className: "quick-btn", style: { "--qa-color": a.color }, onClick: () => {
                        const domain = a.entity.split(".")[0];
                        call(domain, "turn_on", { entity_id: a.entity });
                    }, children: [_jsx("span", { className: "quick-btn__icon", children: a.icon }), _jsx("span", { children: a.label })] }, a.entity))) })] }));
}
function FavoriteLights({ states }) {
    const call = useServiceCall();
    return (_jsxs("div", { className: "rp-section", children: [_jsx("h3", { className: "rp-title", children: "Lumi\u00E8res favorites" }), _jsx("div", { className: "fav-lights", children: ENTITIES.lights.favorites.map((light) => {
                    const isOn = states[light.entity]?.state === "on";
                    return (_jsxs("div", { className: "fav-light-row", children: [_jsx("span", { className: "fav-light-icon", children: "\uD83D\uDCA1" }), _jsx("span", { className: "fav-light-label", children: light.label }), _jsx("button", { className: `toggle ${isOn ? "toggle--on" : ""}`, "aria-label": isOn ? "Éteindre" : "Allumer", onClick: () => call("light", isOn ? "turn_off" : "turn_on", { entity_id: light.entity }), children: _jsx("span", { className: "toggle__thumb" }) })] }, light.entity));
                }) })] }));
}
function ClimateSummary({ states }) {
    const climateRooms = ENTITIES.heating.rooms.slice(0, 3);
    return (_jsxs("div", { className: "rp-section", children: [_jsx("h3", { className: "rp-title", children: "Climatiseur" }), _jsx("div", { className: "climate-summary", children: climateRooms.map((room) => {
                    const s = states[room.entity];
                    const temp = s
                        ? s.attributes["temperature"]
                        : null;
                    const pct = temp !== null && temp !== undefined
                        ? ((temp - ENTITIES.heating.minTemp) / (ENTITIES.heating.maxTemp - ENTITIES.heating.minTemp)) * 100
                        : 0;
                    return (_jsxs("div", { className: "climate-row", children: [_jsxs("div", { className: "climate-row__top", children: [_jsx("span", { className: "climate-row__label", children: room.label }), _jsxs("span", { className: "climate-row__temp", children: [temp ?? "—", " \u00B0C"] })] }), _jsx("div", { className: "climate-row__track", children: _jsx("div", { className: "climate-row__fill", style: { width: `${pct}%` } }) })] }, room.entity));
                }) })] }));
}
function RecentActivity({ states }) {
    const entries = ENTITIES.automations.slice(0, 3).map((a) => ({
        label: a.label,
        desc: a.description,
        on: states[a.entity]?.state === "on",
    }));
    return (_jsxs("div", { className: "rp-section", children: [_jsx("h3", { className: "rp-title", children: "Activit\u00E9 r\u00E9cente" }), _jsx("div", { className: "activity-list", children: entries.map((e, i) => (_jsxs("div", { className: "activity-row", children: [_jsx("span", { className: `activity-dot ${e.on ? "activity-dot--on" : ""}` }), _jsxs("div", { className: "activity-info", children: [_jsx("span", { className: "activity-label", children: e.label }), _jsx("span", { className: "activity-desc", children: e.desc })] })] }, i))) })] }));
}
export function RightPanel({ states }) {
    return (_jsxs("aside", { className: "right-panel", children: [_jsx(QuickActions, { states: states }), _jsx(FavoriteLights, { states: states }), _jsx(ClimateSummary, { states: states }), _jsx(RecentActivity, { states: states })] }));
}
