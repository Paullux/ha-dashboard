import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./ColorPresets.css";
export function ColorPresets({ presets, onSelect }) {
    return (_jsxs("div", { className: "color-presets", children: [_jsx("span", { className: "color-presets__label", children: "Couleur" }), _jsx("div", { className: "color-presets__list", children: presets.map((p) => (_jsx("button", { className: "color-preset", style: { background: p.color }, title: p.label, onClick: () => onSelect(p) }, p.label))) })] }));
}
