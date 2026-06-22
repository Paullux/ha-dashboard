import { useState } from "react";
import { useHaStates } from "./hooks/useHaStates";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import { Sidebar, type Section } from "./components/Sidebar";
import { RightPanel } from "./components/RightPanel";
import { LoginPage } from "./components/LoginPage";
import { RoomDetail } from "./components/RoomDetail";
import { HomePage } from "./components/home/HomePage";
import { AmbientSection } from "./components/sections/AmbientSection";
import { ClimateSection } from "./components/sections/ClimateSection";
import { HeatingSection } from "./components/sections/HeatingSection";
import { LightsSection } from "./components/sections/LightsSection";
import { ENTITIES } from "./config/dashboard";
import "./App.css";

export default function App() {
  const { state: authState, login, logout } = useAuth();
  const { states, connected } = useHaStates();
  const { theme, toggle } = useTheme();
  const [section, setSection] = useState<Section>("home");
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

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
        {section === "home" && !activeRoom && (
          <HomePage
            states={states}
            theme={theme}
            onRoomClick={(roomId) => setActiveRoom(roomId)}
          />
        )}
        {section === "home" && activeRoom && (() => {
          const room = ENTITIES.rooms.find((r) => r.id === activeRoom);
          if (!room) return null;
          return (
            <RoomDetail
              roomLabel={room.label}
              devices={[...room.devices]}
              states={states}
              onBack={() => setActiveRoom(null)}
            />
          );
        })()}
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
