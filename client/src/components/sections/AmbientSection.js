import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ENTITIES } from "../../config/dashboard";
import { DrillDown } from "../DrillDown";
import "./AmbientSection.css";
function StatCard({ label, value, unit }) {
    return (_jsxs("div", { className: "stat-card", children: [_jsx("span", { className: "stat-card__label", children: label }), _jsxs("span", { className: "stat-card__value", children: [value, unit && _jsx("span", { className: "stat-card__unit", children: unit })] })] }));
}
export function AmbientSection({ states }) {
    const e = ENTITIES.ambient;
    const tempIn = states[e.tempIndoor]?.state ?? "—";
    const tempOut = states[e.tempOutdoor]?.state ?? "—";
    const season = states[e.season]?.state ?? "—";
    const mode = states[e.modeApt]?.state ?? "—";
    return (_jsxs(DrillDown, { title: "Donn\u00E9es ambiantes", children: [_jsx(StatCard, { label: "Int\u00E9rieur", value: tempIn, unit: " \u00B0C" }), _jsx(StatCard, { label: "Ext\u00E9rieur", value: tempOut, unit: " \u00B0C" }), _jsx(StatCard, { label: "Saison", value: season }), _jsx(StatCard, { label: "Mode appartement", value: mode })] }));
}
