import { jsx as _jsx } from "react/jsx-runtime";
import "./ModeButtons.css";
export function ModeButtons({ modes, current, onSelect }) {
    return (_jsx("div", { className: "mode-buttons", children: modes.map((m) => (_jsx("button", { className: `mode-btn ${current === m.value ? "mode-btn--active" : ""}`, style: current === m.value && m.color ? { borderColor: m.color, color: m.color } : undefined, onClick: () => onSelect(m.value), children: m.label }, m.value))) }));
}
