import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SummaryCards } from "./SummaryCards";
import { RoomGrid } from "./RoomGrid";
import { SceneButtons } from "./SceneButtons";
import { AutomationList } from "./AutomationList";
import "./HomePage.css";
export function HomePage({ states, theme, userName = "Paul", onRoomClick }) {
    const hour = new Date().getHours();
    const greeting = hour < 6 ? "Bonne nuit" :
        hour < 12 ? "Bonjour" :
            hour < 18 ? "Bon après-midi" :
                "Bonsoir";
    return (_jsxs("div", { className: "home", children: [_jsx("header", { className: "home__header", children: _jsxs("div", { children: [_jsx("h1", { className: "home__title", children: "Accueil" }), _jsxs("p", { className: "home__sub", children: [greeting, ", ", userName, " \uD83D\uDC4B"] })] }) }), _jsxs("div", { className: "home__content", children: [_jsx(SummaryCards, { states: states }), _jsx(RoomGrid, { states: states, theme: theme, onRoomClick: onRoomClick }), _jsx(SceneButtons, {}), _jsx(AutomationList, { states: states })] })] }));
}
