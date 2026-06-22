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

  const rawTemp = tempState
    ? parseFloat((tempState.attributes as Record<string, unknown>)["current_temperature"] as string ?? tempState.state)
    : NaN;
  const temp = isNaN(rawTemp) ? null : `${rawTemp.toFixed(0)} °C`;

  const lightOn = lightState?.state === "on";
  const lightLabel = lightState ? (lightOn ? "Allumée" : "Éteinte") : null;

  // Climate/heating devices in this room
  const climateDevices = room.devices.filter((d) => d.type === "climate");
  const climateActive = climateDevices.some((d) => {
    const s = states[d.entity]?.state;
    return s && s !== "off" && s !== "unavailable";
  });
  const heatingMode = climateActive
    ? climateDevices.find((d) => {
        const s = states[d.entity]?.state;
        return s && s !== "off" && s !== "unavailable";
      })?.label ?? null
    : null;

  // Is main climate entity (AC) active in this room?
  const isClimActive = room.tempEntity === ENTITIES.climate.entity &&
    states[ENTITIES.climate.entity]?.state !== "off" &&
    states[ENTITIES.climate.entity]?.state !== undefined;

  return (
    <button
      className={`room-card ${lightOn ? "room-card--light-on" : ""}`}
      onClick={onClick}
    >
      <div className="room-card__header">
        <span className="room-card__name">{room.label}</span>
        <div className="room-card__badges">
          {isClimActive && <span className="room-card__badge room-card__badge--fan" title="Climatisation active">❄️</span>}
        </div>
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
            <span className={`room-card__meta-icon ${lightOn ? "room-card__meta-icon--glow" : ""}`}>💡</span>
            {lightLabel}
          </span>
        )}
        {heatingMode && (
          <span className="room-card__meta room-card__meta--heat">
            <span className="room-card__meta-icon">🔥</span> {heatingMode}
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
