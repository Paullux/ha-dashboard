import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useHaStates } from "./hooks/useHaStates";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import { Sidebar } from "./components/Sidebar";
import { RightPanel } from "./components/RightPanel";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/home/HomePage";
import { AmbientSection } from "./components/sections/AmbientSection";
import { ClimateSection } from "./components/sections/ClimateSection";
import { HeatingSection } from "./components/sections/HeatingSection";
import { LightsSection } from "./components/sections/LightsSection";
import "./App.css";
export default function App() {
    const { state: authState, login, logout } = useAuth();
    const { states, connected } = useHaStates();
    const { theme, toggle } = useTheme();
    const [section, setSection] = useState("home");
    if (authState === "loading")
        return null;
    if (authState === "unauthenticated")
        return _jsx(LoginPage, { onLogin: login });
    return (_jsxs("div", { className: "app", children: [_jsx(Sidebar, { active: section, connected: connected, theme: theme, onSelect: setSection, onToggleTheme: toggle, onLogout: logout }), _jsxs("main", { className: "main", children: [section === "home" && (_jsx(HomePage, { states: states, theme: theme, onRoomClick: (roomId) => {
                            // Pour l'instant, les clics pièce naviguent vers lumières/chauffage
                            // On pourra ajouter une vue par pièce plus tard
                            console.log("room clicked:", roomId);
                        } })), section === "ambient" && (_jsx("div", { className: "section-wrap", children: _jsx(AmbientSection, { states: states }) })), section === "climate" && (_jsx("div", { className: "section-wrap", children: _jsx(ClimateSection, { states: states }) })), section === "heating" && (_jsx("div", { className: "section-wrap", children: _jsx(HeatingSection, { states: states }) })), section === "lights" && (_jsx("div", { className: "section-wrap", children: _jsx(LightsSection, { states: states }) }))] }), _jsx(RightPanel, { states: states })] }));
}
