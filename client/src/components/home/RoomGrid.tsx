import type { HaState } from "../../types/ha";
import type { Theme } from "../../hooks/useTheme";
import { ENTITIES, type RoomConfig } from "../../config/dashboard";
import { RoomIllustration } from "../RoomIllustration";
import "./RoomGrid.css";

interface RoomCardProps {
  room: RoomConfig;
  states: Record<string, HaState>;
  theme: Theme;
  onClick: () => void;
}

function RoomCard({ room, states, theme, onClick }: RoomCardProps) {
  const tempState  = room.tempEntity  ? states[room.tempEntity]  : null;
  const lightState = room.lightEntity ? states[room.lightEntity] : null;

  const temp = tempState
    ? `${parseFloat((tempState.attributes as Record<string, unknown>)["current_temperature"] as string ?? tempState.state).toFixed(0)} °C`
    : null;
  const lightOn    = lightState?.state === "on";
  const lightLabel = lightState ? (lightOn ? "Allumée" : "Éteinte") : null;

  return (
    <button className="room-card" onClick={onClick}>
      <div className="room-card__header">
        <span className="room-card__name">{room.label}</span>
        <span className="room-card__arrow">›</span>
      </div>

      <RoomIllustration roomId={room.id} theme={theme} />

      <div className="room-card__footer">
        {temp && (
          <span className="room-card__meta">
            <span className="room-card__meta-icon">🌡️</span> {temp}
          </span>
        )}
        {lightLabel && (
          <span className={`room-card__meta ${lightOn ? "room-card__meta--on" : ""}`}>
            <span className="room-card__meta-icon">💡</span> {lightLabel}
          </span>
        )}
      </div>
    </button>
  );
}

interface Props {
  states: Record<string, HaState>;
  theme: Theme;
  onRoomClick: (roomId: string) => void;
}

export function RoomGrid({ states, theme, onRoomClick }: Props) {
  return (
    <section className="room-section">
      <h2 className="section-title">Pièces</h2>
      <div className="room-grid">
        {ENTITIES.rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            states={states}
            theme={theme}
            onClick={() => onRoomClick(room.id)}
          />
        ))}
      </div>
    </section>
  );
}
