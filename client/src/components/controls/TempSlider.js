import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import "./TempSlider.css";
export function TempSlider({ value, min, max, step = 0.5, onChange }) {
    const [local, setLocal] = useState(value);
    const pct = ((local - min) / (max - min)) * 100;
    return (_jsxs("div", { className: "temp-slider", children: [_jsxs("div", { className: "temp-slider__value", children: [local.toFixed(1), " \u00B0C"] }), _jsx("div", { className: "temp-slider__track-wrap", children: _jsx("input", { type: "range", min: min, max: max, step: step, value: local, className: "temp-slider__input", style: { "--pct": `${pct}%` }, onChange: (e) => setLocal(parseFloat(e.target.value)), onMouseUp: () => onChange(local), onTouchEnd: () => onChange(local) }) }), _jsxs("div", { className: "temp-slider__bounds", children: [_jsxs("span", { children: [min, " \u00B0C"] }), _jsxs("span", { children: [max, " \u00B0C"] })] })] }));
}
