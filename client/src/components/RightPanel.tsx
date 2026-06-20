import type { HaState } from "../types/ha";
import { ENTITIES } from "../config/dashboard";
import { useServiceCall } from "../hooks/useServiceCall";
import "./RightPanel.css";

const MIN_TEMP = 16;
const MAX_TEMP = 30;

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
  const call = useServiceCall();
  const cfg = ENTITIES.climate;
  const entity = states[cfg.entity];
  const attrs = entity?.attributes as Record<string, unknown> ?? {};
  const temp = (attrs["temperature"] as number | undefined) ?? 20;
  const currentIndoor = (attrs["current_temperature"] as number | undefined);
  const pct = ((temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTemp = Math.round(MIN_TEMP + ratio * (MAX_TEMP - MIN_TEMP));
    call("climate", "set_temperature", { entity_id: cfg.entity, temperature: newTemp });
  };

  return (
    <div className="rp-section">
      <h3 className="rp-title">Climatiseur</h3>
      <div className="climate-summary">
        <div className="climate-row">
          <div className="climate-row__top">
            <span className="climate-row__label">
              Consigne
              {currentIndoor !== undefined && (
                <span className="climate-row__indoor"> · actuel {currentIndoor} °C</span>
              )}
            </span>
            <span className="climate-row__temp">{entity ? `${temp} °C` : "—"}</span>
          </div>
          <div className="climate-row__track" onClick={handleClick} style={{ cursor: "pointer" }}>
            <div className="climate-row__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="climate-row__range">
            <span>{MIN_TEMP} °C</span>
            <span>{MAX_TEMP} °C</span>
          </div>
        </div>
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
