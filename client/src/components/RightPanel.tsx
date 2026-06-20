import type { HaState } from "../types/ha";
import { ENTITIES } from "../config/dashboard";
import { useServiceCall } from "../hooks/useServiceCall";
import "./RightPanel.css";

interface Props {
  states: Record<string, HaState>;
}

function QuickActions(_: Props) {
  const call = useServiceCall();
  return (
    <div className="rp-section">
      <h3 className="rp-title">Actions rapides</h3>
      <div className="quick-actions">
        {ENTITIES.quickActions.map((a) => (
          <button
            key={a.entity}
            className="quick-btn"
            style={{ "--qa-color": a.color } as React.CSSProperties}
            onClick={() => {
              const domain = a.entity.split(".")[0]!;
              call(domain, "turn_on", { entity_id: a.entity });
            }}
          >
            <span className="quick-btn__icon">{a.icon}</span>
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FavoriteLights({ states }: Props) {
  const call = useServiceCall();
  return (
    <div className="rp-section">
      <h3 className="rp-title">Lumières favorites</h3>
      <div className="fav-lights">
        {ENTITIES.lights.favorites.map((light) => {
          const isOn = states[light.entity]?.state === "on";
          return (
            <div key={light.entity} className="fav-light-row">
              <span className="fav-light-icon">💡</span>
              <span className="fav-light-label">{light.label}</span>
              <button
                className={`toggle ${isOn ? "toggle--on" : ""}`}
                aria-label={isOn ? "Éteindre" : "Allumer"}
                onClick={() =>
                  call("light", isOn ? "turn_off" : "turn_on", { entity_id: light.entity })
                }
              >
                <span className="toggle__thumb" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClimateSummary({ states }: Props) {
  const climateRooms = ENTITIES.heating.rooms.slice(0, 3);
  return (
    <div className="rp-section">
      <h3 className="rp-title">Climatiseur</h3>
      <div className="climate-summary">
        {climateRooms.map((room) => {
          const s = states[room.entity];
          const temp = s
            ? (s.attributes as Record<string,unknown>)["temperature"] as number
            : null;
          const pct = temp !== null && temp !== undefined
            ? ((temp - ENTITIES.heating.minTemp) / (ENTITIES.heating.maxTemp - ENTITIES.heating.minTemp)) * 100
            : 0;
          return (
            <div key={room.entity} className="climate-row">
              <div className="climate-row__top">
                <span className="climate-row__label">{room.label}</span>
                <span className="climate-row__temp">{temp ?? "—"} °C</span>
              </div>
              <div className="climate-row__track">
                <div className="climate-row__fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivity({ states }: Props) {
  const entries = ENTITIES.automations.slice(0, 3).map((a) => ({
    label: a.label,
    desc:  a.description,
    on:    states[a.entity]?.state === "on",
  }));

  return (
    <div className="rp-section">
      <h3 className="rp-title">Activité récente</h3>
      <div className="activity-list">
        {entries.map((e, i) => (
          <div key={i} className="activity-row">
            <span className={`activity-dot ${e.on ? "activity-dot--on" : ""}`} />
            <div className="activity-info">
              <span className="activity-label">{e.label}</span>
              <span className="activity-desc">{e.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RightPanel({ states }: Props) {
  return (
    <aside className="right-panel">
      <QuickActions states={states} />
      <FavoriteLights states={states} />
      <ClimateSummary states={states} />
      <RecentActivity states={states} />
    </aside>
  );
}
