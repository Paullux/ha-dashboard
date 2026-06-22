import type { HaState } from "../../types/ha";
import type { Theme } from "../../hooks/useTheme";
import { ENTITIES, type RoomConfig } from "../../config/dashboard";
import { RoomIllustration } from "../RoomIllustration";
import { useSunTimes } from "../../hooks/useSunTimes";
import "./RoomGrid.css";

const RADIATOR_MODE: Record<string, string> = {
  off:       "Éteint",
  heat_cool: "Hors-Gel",
  cool:      "Éco",
  heat:      "Confort",
  auto:      "Boost",
};

const CLIM_MODE: Record<string, string> = {
  off:  "Éteint",
  cool: "Froid",
  heat: "Chaud",
  dry:  "Sec",
  auto: "Auto",
};

function climateTag(entity: string, states: Record<string, HaState>, isAC: boolean) {
  const s = states[entity];
  if (!s) return null;
  const mode = s.state;
  const attrs = s.attributes as Record<string, unknown>;
  const setpoint = attrs["temperature"] as number | undefined;
  const label = isAC ? (CLIM_MODE[mode] ?? mode) : (RADIATOR_MODE[mode] ?? mode);
  const off = mode === "off";
  const icon = isAC ? "❄️" : "🔥";
  const setpointStr = !off && setpoint !== undefined ? ` · ${setpoint} °C` : "";
  return { icon, label: `${label}${setpointStr}`, off, isAC };
}

interface RoomCardProps {
  room: RoomConfig;
  states: Record<string, HaState>;
  theme: Theme;
  isNight: boolean;
  onClick: () => void;
}

function RoomCard({ room, states, theme, isNight, onClick }: RoomCardProps) {
  const tempState  = room.tempEntity  ? states[room.tempEntity]  : null;
  const lightState = room.lightEntity ? states[room.lightEntity] : null;

  const rawTemp = tempState
    ? parseFloat((tempState.attributes as Record<string, unknown>)["current_temperature"] as string ?? tempState.state)
    : NaN;
  const temp = isNaN(rawTemp) ? null : `${rawTemp.toFixed(0)} °C`;

  const lightOn    = lightState?.state === "on";
  const lightLabel = lightState ? (lightOn ? "Allumée" : "Éteinte") : null;

  // Build climate tags for each device in the room
  const climateTags = room.devices
    .filter((d) => d.type === "climate")
    .map((d) => {
      const isAC = d.entity === ENTITIES.climate.entity;
      return climateTag(d.entity, states, isAC);
    })
    .filter(Boolean) as NonNullable<ReturnType<typeof climateTag>>[];

  const anyClimActive = climateTags.some((t) => t.isAC && !t.off);
  const anyHeatActive = climateTags.some((t) => !t.isAC && !t.off);

  return (
    <button
      className={`room-card ${lightOn ? "room-card--light-on" : ""}`}
      onClick={onClick}
    >
      <div className="room-card__header">
        <span className="room-card__name">{room.label}</span>
        <div className="room-card__badges">
          {anyClimActive && (
            <span className="room-card__badge room-card__badge--fan" title="Climatisation active">❄️</span>
          )}
          {anyHeatActive && (
            <span className="room-card__badge room-card__badge--flicker" title="Radiateur actif">🔥</span>
          )}
        </div>
      </div>

      <RoomIllustration
        roomId={room.id}
        theme={theme}
        lightOn={lightOn}
        climActive={anyClimActive}
        heatActive={anyHeatActive}
        isNight={isNight}
      />

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
        {climateTags.map((tag, i) => (
          <span
            key={i}
            className={`room-card__meta ${!tag.off && tag.isAC ? "room-card__meta--clim" : ""} ${!tag.off && !tag.isAC ? "room-card__meta--heat" : ""}`}
          >
            <span className="room-card__meta-icon">{tag.icon}</span>
            {tag.label}
          </span>
        ))}
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
  const { isNight } = useSunTimes(states);

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
            isNight={isNight}
            onClick={() => onRoomClick(room.id)}
          />
        ))}
      </div>
    </section>
  );
}
