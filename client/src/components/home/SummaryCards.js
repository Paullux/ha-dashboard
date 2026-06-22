import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ENTITIES } from "../../config/dashboard";
import "./SummaryCards.css";
function Card({ icon, label, value, unit, sub, subColor }) {
    return (_jsxs("div", { className: "sum-card", children: [_jsx("span", { className: "sum-card__icon", children: icon }), _jsxs("div", { className: "sum-card__body", children: [_jsx("span", { className: "sum-card__label", children: label }), _jsxs("span", { className: "sum-card__value", children: [value, unit && _jsx("span", { className: "sum-card__unit", children: unit })] }), _jsx("span", { className: "sum-card__sub", style: subColor ? { color: subColor } : undefined, children: sub })] })] }));
}
function weatherLabel(state) {
    const map = {
        sunny: "Ensoleillé", partlycloudy: "Nuageux", cloudy: "Couvert",
        rainy: "Pluvieux", snowy: "Neigeux", windy: "Venteux", fog: "Brumeux",
        clear: "Dégagé", lightning: "Orageux",
    };
    return map[state] ?? state;
}
export function SummaryCards({ states }) {
    const e = ENTITIES;
    const tempState = states[e.ambient.tempIndoor];
    const humState = states[e.ambient.humidity];
    const powerState = states[e.energy.currentPower];
    const wxState = states[e.weather.entity];
    const temp = tempState ? parseFloat(tempState.state).toFixed(1) : "—";
    const hum = humState ? Math.round(parseFloat(humState.state)) : "—";
    const power = powerState ? parseFloat(powerState.state).toFixed(2) : "—";
    const wxTemp = wxState ? wxState.attributes["temperature"] : null;
    const humNum = typeof hum === "number" ? hum : null;
    const humColor = humNum !== null
        ? humNum < 30 ? "var(--warn)" : humNum > 70 ? "var(--warn)" : "var(--on)"
        : undefined;
    const humSub = humNum !== null
        ? humNum < 30 ? "Trop sec" : humNum > 70 ? "Trop humide" : "Bon"
        : "—";
    return (_jsxs("div", { className: "sum-cards", children: [_jsx(Card, { icon: "\uD83C\uDF21\uFE0F", label: "Temp\u00E9rature", value: temp, unit: " \u00B0C", sub: "Int\u00E9rieur" }), _jsx(Card, { icon: "\uD83D\uDCA7", label: "Humidit\u00E9", value: String(hum), unit: " %", sub: humSub, subColor: humColor }), _jsx(Card, { icon: "\u26A1", label: "\u00C9nergie", value: power, unit: ` ${e.energy.unit}`, sub: "En cours" }), _jsx(Card, { icon: "\uD83C\uDF24\uFE0F", label: "M\u00E9t\u00E9o", value: wxTemp !== null ? String(wxTemp) : "—", unit: " \u00B0C", sub: wxState ? weatherLabel(wxState.state) : "—" })] }));
}
