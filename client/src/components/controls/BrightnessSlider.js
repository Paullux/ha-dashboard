import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import "./BrightnessSlider.css";
export function BrightnessSlider({ value, onChange }) {
    const pct = Math.round((value / 255) * 100);
    const [local, setLocal] = useState(pct);
    return (_jsxs("div", { className: "brightness-slider", children: [_jsxs("div", { className: "brightness-slider__label", children: [_jsx("span", { children: "Luminosit\u00E9" }), _jsxs("span", { className: "brightness-slider__pct", children: [local, " %"] })] }), _jsx("input", { type: "range", min: 0, max: 100, value: local, className: "brightness-slider__input", style: { "--pct": `${local}%` }, onChange: (e) => setLocal(parseInt(e.target.value)), onMouseUp: () => onChange(Math.round((local / 100) * 255)), onTouchEnd: () => onChange(Math.round((local / 100) * 255)) })] }));
}
