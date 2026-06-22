import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import "./AutomationList.css";
export function AutomationList({ states }) {
    const call = useServiceCall();
    return (_jsxs("section", { className: "automations-section", children: [_jsx("h2", { className: "section-title", children: "Automatisations actives" }), _jsx("div", { className: "automations-list", children: ENTITIES.automations.map((auto) => {
                    const state = states[auto.entity];
                    const isOn = state?.state === "on";
                    return (_jsxs("div", { className: "auto-row", children: [_jsxs("div", { className: "auto-row__info", children: [_jsx("span", { className: "auto-row__label", children: auto.label }), _jsxs("span", { className: "auto-row__desc", children: ["\u2192 ", auto.description] })] }), _jsx("button", { className: `toggle ${isOn ? "toggle--on" : ""}`, "aria-label": isOn ? "Désactiver" : "Activer", onClick: () => call("automation", isOn ? "turn_off" : "turn_on", {
                                    entity_id: auto.entity,
                                }), children: _jsx("span", { className: "toggle__thumb" }) })] }, auto.entity));
                }) })] }));
}
