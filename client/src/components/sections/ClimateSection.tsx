import { useState } from "react";
import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import { DrillDown, DrillItem } from "../DrillDown";
import { ModeButtons } from "../controls/ModeButtons";
import { TempSlider } from "../controls/TempSlider";
import "./ClimateSection.css";

type View = null | "consigne" | "mode" | "ventilateur" | "swing";

interface Props {
  states: Record<string, HaState>;
}

export function ClimateSection({ states }: Props) {
  const [view, setView] = useState<View>(null);
  const call = useServiceCall();
  const cfg = ENTITIES.climate;
  const entity = states[cfg.entity];
  const attrs = entity?.attributes as Record<string, unknown> ?? {};

  const currentMode   = entity?.state ?? "off";
  const currentTemp   = (attrs["temperature"] as number | undefined) ?? 20;
  const currentFan    = (attrs["fan_mode"] as string | undefined) ?? "low";
  const currentIndoor = (attrs["current_temperature"] as number | undefined);

  const swingOn = states[cfg.swingSensor]?.state === "on";
  const sleepOn = states[cfg.sleepSensor]?.state === "on";

  const fanModes = cfg.fanModes.map((v, i) => ({
    value: v,
    label: cfg.fanLabels[i] ?? v,
  }));

  if (view === "consigne") {
    return (
      <DrillDown title="Consigne" back={() => setView(null)}>
        {currentIndoor !== undefined && (
          <div className="climate-current">
            Température actuelle : <strong>{currentIndoor} °C</strong>
          </div>
        )}
        <TempSlider
          value={currentTemp}
          min={16}
          max={30}
          onChange={(t) =>
            call("climate", "set_temperature", {
              entity_id: cfg.entity,
              temperature: t,
            })
          }
        />
      </DrillDown>
    );
  }

  if (view === "mode") {
    return (
      <DrillDown title="Mode" back={() => setView(null)}>
        <ModeButtons
          modes={cfg.modes}
          current={currentMode}
          onSelect={(v) =>
            call("climate", v === "off" ? "turn_off" : "set_hvac_mode", {
              entity_id: cfg.entity,
              ...(v !== "off" ? { hvac_mode: v } : {}),
            })
          }
        />
      </DrillDown>
    );
  }

  if (view === "ventilateur") {
    return (
      <DrillDown title="Ventilateur" back={() => setView(null)}>
        <ModeButtons
          modes={fanModes}
          current={currentFan}
          onSelect={(v) =>
            call("climate", "set_fan_mode", {
              entity_id: cfg.entity,
              fan_mode: v,
            })
          }
        />
      </DrillDown>
    );
  }

  if (view === "swing") {
    return (
      <DrillDown title="Sleep / Swing" back={() => setView(null)}>
        <div className="swing-sleep-row">
          <span>Oscillation</span>
          <button
            className={`toggle ${swingOn ? "toggle--on" : ""}`}
            onClick={() =>
              call("switch", swingOn ? "turn_off" : "turn_on", {
                entity_id: cfg.swingSwitch,
              })
            }
          >
            <span className="toggle__thumb" />
          </button>
        </div>
        <div className="swing-sleep-row">
          <span>Mode Sleep</span>
          <button
            className={`toggle ${sleepOn ? "toggle--on" : ""}`}
            onClick={() =>
              call("switch", sleepOn ? "turn_off" : "turn_on", {
                entity_id: cfg.sleepSwitch,
              })
            }
          >
            <span className="toggle__thumb" />
          </button>
        </div>
      </DrillDown>
    );
  }

  // Root view
  const activeMode = cfg.modes.find((m) => m.value === currentMode);
  const swingSleepSub = [swingOn ? "Oscillation" : null, sleepOn ? "Sleep" : null]
    .filter(Boolean).join(" · ") || "Désactivé";

  return (
    <DrillDown title="Climatiseur">
      <div className="climate-status">
        <span className="climate-status__mode" style={{ color: activeMode?.color ?? "var(--text-muted)" }}>
          {activeMode?.label ?? currentMode}
        </span>
        <span className="climate-status__temp">{currentTemp} °C</span>
      </div>
      <DrillItem
        label="Consigne"
        sub={`${currentTemp} °C`}
        onClick={() => setView("consigne")}
      />
      <DrillItem
        label="Mode"
        sub={activeMode?.label ?? currentMode}
        accent={activeMode?.color}
        onClick={() => setView("mode")}
      />
      <DrillItem
        label="Ventilateur"
        sub={fanModes.find((f) => f.value === currentFan)?.label ?? currentFan}
        onClick={() => setView("ventilateur")}
      />
      <DrillItem
        label="Sleep / Swing"
        sub={swingSleepSub}
        onClick={() => setView("swing")}
      />
    </DrillDown>
  );
}
