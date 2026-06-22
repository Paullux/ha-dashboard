import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Sidebar.css";
const NAV = [
    { id: "home", label: "Accueil", icon: "🏠" },
    { id: "ambient", label: "Ambiance", icon: "🌡️" },
    { id: "climate", label: "Climatiseur", icon: "❄️" },
    { id: "heating", label: "Chauffage", icon: "🔥" },
    { id: "lights", label: "Lumières", icon: "💡" },
];
export function Sidebar({ active, connected, theme, onSelect, onToggleTheme, onLogout }) {
    return (_jsxs("nav", { className: "sidebar", children: [_jsxs("div", { className: "sidebar__brand", children: [_jsx("span", { className: "sidebar__brand-icon", children: "\uD83C\uDFE1" }), _jsx("span", { className: "sidebar__brand-name", children: "Home" }), _jsx("span", { className: `sidebar__dot ${connected ? "sidebar__dot--on" : ""}` })] }), _jsx("ul", { className: "sidebar__nav", children: NAV.map((item) => (_jsx("li", { children: _jsxs("button", { className: `sidebar__item ${active === item.id ? "sidebar__item--active" : ""}`, onClick: () => onSelect(item.id), children: [_jsx("span", { className: "sidebar__icon", children: item.icon }), _jsx("span", { className: "sidebar__label", children: item.label })] }) }, item.id))) }), _jsxs("div", { className: "sidebar__footer", children: [_jsxs("button", { className: "sidebar__theme-toggle", onClick: onToggleTheme, "aria-label": "Changer le th\u00E8me", title: theme === "dark" ? "Mode clair" : "Mode sombre", children: [_jsx("span", { className: "sidebar__theme-icon", children: theme === "dark" ? "☀️" : "🌙" }), _jsx("span", { className: "sidebar__label", children: theme === "dark" ? "Mode clair" : "Mode sombre" })] }), _jsxs("button", { className: "sidebar__theme-toggle", onClick: onLogout, "aria-label": "Se d\u00E9connecter", title: "Se d\u00E9connecter", children: [_jsx("span", { className: "sidebar__theme-icon", children: "\uD83D\uDD13" }), _jsx("span", { className: "sidebar__label", children: "D\u00E9connexion" })] })] })] }));
}
