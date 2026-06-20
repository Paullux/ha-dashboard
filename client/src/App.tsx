import { useState } from "react";
import { useHaStates } from "./hooks/useHaStates";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import { Sidebar, type Section } from "./components/Sidebar";
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
  const [section, setSection] = useState<Section>("home");

  if (authState === "loading") return null;
  if (authState === "unauthenticated") return <LoginPage onLogin={login} />;

  return (
    <div className="app">
      <Sidebar
        active={section}
        connected={connected}
        theme={theme}
        onSelect={setSection}
        onToggleTheme={toggle}
        onLogout={logout}
      />

      <main className="main">
        {section === "home" && (
          <HomePage
            states={states}
            theme={theme}
            onRoomClick={(roomId) => {
              // Pour l'instant, les clics pièce naviguent vers lumières/chauffage
              // On pourra ajouter une vue par pièce plus tard
              console.log("room clicked:", roomId);
            }}
          />
        )}
        {section === "ambient" && (
          <div className="section-wrap">
            <AmbientSection states={states} />
          </div>
        )}
        {section === "climate" && (
          <div className="section-wrap">
            <ClimateSection states={states} />
          </div>
        )}
        {section === "heating" && (
          <div className="section-wrap">
            <HeatingSection states={states} />
          </div>
        )}
        {section === "lights" && (
          <div className="section-wrap">
            <LightsSection states={states} />
          </div>
        )}
      </main>

      <RightPanel states={states} />
    </div>
  );
}
