import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./DrillDown.css";
export function DrillDown({ title, back, children }) {
    return (_jsxs("div", { className: "drilldown", children: [_jsxs("div", { className: "drilldown__header", children: [back && (_jsx("button", { className: "drilldown__back", onClick: back, "aria-label": "Retour", children: "\u2190" })), _jsx("h2", { className: "drilldown__title", children: title })] }), _jsx("div", { className: "drilldown__body", children: children })] }));
}
export function DrillItem({ label, sub, accent, onClick }) {
    return (_jsxs("button", { className: "drill-item", style: accent ? { borderLeftColor: accent } : undefined, onClick: onClick, children: [_jsx("span", { className: "drill-item__label", children: label }), sub && _jsx("span", { className: "drill-item__sub", children: sub }), _jsx("span", { className: "drill-item__arrow", children: "\u203A" })] }));
}
