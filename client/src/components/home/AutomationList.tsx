import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import "./AutomationList.css";

interface Props {
  states: Record<string, HaState>;
}

export function AutomationList({ states }: Props) {
  const call = useServiceCall();

  return (
    <section className="automations-section">
      <h2 className="section-title">Automatisations actives</h2>
      <div className="automations-list">
        {ENTITIES.automations.map((auto) => {
          const state = states[auto.entity];
          const isOn  = state?.state === "on";
          return (
            <div key={auto.entity} className="auto-row">
              <div className="auto-row__info">
                <span className="auto-row__label">{auto.label}</span>
                <span className="auto-row__desc">→ {auto.description}</span>
              </div>
              <button
                className={`toggle ${isOn ? "toggle--on" : ""}`}
                aria-label={isOn ? "Désactiver" : "Activer"}
                onClick={() =>
                  call("automation", isOn ? "turn_off" : "turn_on", {
                    entity_id: auto.entity,
                  })
                }
              >
                <span className="toggle__thumb" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
