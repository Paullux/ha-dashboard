import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import "./SceneButtons.css";
export function SceneButtons() {
    const call = useServiceCall();
    return (_jsxs("section", { className: "scenes-section", children: [_jsx("h2", { className: "section-title", children: "Sc\u00E8nes" }), _jsx("div", { className: "scenes-grid", children: ENTITIES.scenes.map((scene) => (_jsxs("button", { className: "scene-btn", onClick: () => call("scene", "turn_on", { entity_id: scene.entity }), children: [_jsx("span", { className: "scene-btn__icon", children: scene.icon }), _jsx("span", { className: "scene-btn__label", children: scene.label })] }, scene.entity))) })] }));
}
