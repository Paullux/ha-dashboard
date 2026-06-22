import type { HaState } from "../../types/ha";
import type { Theme } from "../../hooks/useTheme";
import { SummaryCards } from "./SummaryCards";
import { SmartSummary } from "./SmartSummary";
import { RoomGrid } from "./RoomGrid";
import { SceneButtons } from "./SceneButtons";
import { AutomationList } from "./AutomationList";
import "./HomePage.css";

interface Props {
  states: Record<string, HaState>;
  theme: Theme;
  userName?: string;
  onRoomClick: (roomId: string) => void;
}

export function HomePage({ states, theme, userName = "Paul", onRoomClick }: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 6  ? "Bonne nuit" :
    hour < 12 ? "Bonjour" :
    hour < 18 ? "Bon après-midi" :
                "Bonsoir";

  return (
    <div className="home">
      <header className="home__header">
        <div>
          <h1 className="home__title">Accueil</h1>
          <p className="home__sub">{greeting}, {userName} 👋</p>
        </div>
      </header>

      <div className="home__content">
        <SummaryCards states={states} />
        <SmartSummary states={states} />
        <RoomGrid states={states} theme={theme} onRoomClick={onRoomClick} />
        <SceneButtons />
        <AutomationList states={states} />
      </div>
    </div>
  );
}
