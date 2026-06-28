import { useState } from "react";
import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import { DrillDown, DrillItem } from "../DrillDown";
import { ModeButtons } from "../controls/ModeButtons";
import { TempSlider } from "../controls/TempSlider";

type View =
  | { type: "list" }
  | { type: "room"; index: number }
  | { type: "consigne"; index: number }
  | { type: "mode"; index: number };

interface Props {
  states: Record<string, HaState>;
}

export function HeatingSection({ states }: Props) {
  const [view, setView] = useState<View>({ type: "list" });
  const call = useServiceCall();
  const cfg = ENTITIES.heating;

  if (view.type === "list") {
    const allOff = cfg.rooms.every((r) => states[r.entity]?.state === "off");
    return (
      <DrillDown title="Chauffage">
        {cfg.rooms.map((room, i) => {
          const entity = states[room.entity];
          const temp = (entity?.attributes as Record<string, unknown> | undefined)?.["temperature"] as number | undefined;
          const mode = entity?.state ?? "—";
          const modeLabel = cfg.modes.find((m) => m.value === mode)?.label ?? mode;
          const modeColor = cfg.modes.find((m) => m.value === mode)?.color;
          const isOff = mode === "off";
          return (
            <div key={room.entity} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ flex: 1 }}>
                <DrillItem
                  label={room.label}
                  sub={`${modeLabel}${temp !== undefined ? ` · ${temp} °C` : ""}`}
                  accent={modeColor}
                  onClick={() => setView({ type: "room", index: i })}
                />
              </div>
              {!isOff && (
                <button
                  onClick={() => call("script", "turn_on", { entity_id: room.offScript })}
                  title="Éteindre"
                  style={{
                    flexShrink: 0, background: "none", border: "1px solid var(--border)",
                    borderRadius: "0.5rem", padding: "0.35rem 0.5rem",
                    cursor: "pointer", color: "#ef4444", fontSize: "0.85rem",
                    lineHeight: 1,
                  }}
                >⏻</button>
              )}
            </div>
          );
        })}
        {!allOff && (
          <button
            onClick={() => call("script", "turn_on", { entity_id: cfg.globalOffScript })}
            style={{
              marginTop: "0.5rem", width: "100%", padding: "0.6rem",
              background: "#ef444420", border: "1px solid #ef4444",
              borderRadius: "0.625rem", color: "#ef4444", fontWeight: 600,
              fontSize: "0.85rem", cursor: "pointer",
            }}
          >⏻ Tout éteindre</button>
        )}
      </DrillDown>
    );
  }

  const room = cfg.rooms[view.index]!;
  const entity = states[room.entity];
  const attrs = entity?.attributes as Record<string, unknown> ?? {};
  const currentMode = entity?.state ?? "off";
  const currentTemp = (attrs["temperature"] as number | undefined) ?? 16;
  const currentIndoor = (attrs["current_temperature"] as number | undefined);
  const modeLabel = cfg.modes.find((m) => m.value === currentMode)?.label ?? currentMode;
  const modeColor = cfg.modes.find((m) => m.value === currentMode)?.color;

  if (view.type === "consigne") {
    return (
      <DrillDown title={`Consigne — ${room.label}`} back={() => setView({ type: "room", index: view.index })}>
        {currentIndoor !== undefined && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            Température actuelle : <strong style={{ color: "var(--text)" }}>{currentIndoor} °C</strong>
          </div>
        )}
        <TempSlider
          value={currentTemp}
          min={cfg.minTemp}
          max={cfg.maxTemp}
          onChange={(t) =>
            call("climate", "set_temperature", {
              entity_id: room.entity,
              temperature: t,
            })
          }
        />
      </DrillDown>
    );
  }

  if (view.type === "mode") {
    return (
      <DrillDown title={`Mode — ${room.label}`} back={() => setView({ type: "room", index: view.index })}>
        <ModeButtons
          modes={cfg.modes}
          current={currentMode}
          onSelect={(v) =>
            call("climate", v === "off" ? "turn_off" : "set_hvac_mode", {
              entity_id: room.entity,
              ...(v !== "off" ? { hvac_mode: v } : {}),
            })
          }
        />
      </DrillDown>
    );
  }

  // Room detail
  return (
    <DrillDown title={room.label} back={() => setView({ type: "list" })}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.75rem 1rem", background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: "0.625rem",
      }}>
        <span style={{ color: modeColor ?? "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem" }}>
          {modeLabel}
        </span>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.5rem" }}>
          {currentTemp} °C
        </span>
      </div>
      <DrillItem
        label="Consigne"
        sub={`${currentTemp} °C`}
        onClick={() => setView({ type: "consigne", index: view.index })}
      />
      <DrillItem
        label="Mode"
        sub={modeLabel}
        accent={modeColor}
        onClick={() => setView({ type: "mode", index: view.index })}
      />
      {currentMode !== "off" && (
        <button
          onClick={() => {
            call("script", "turn_on", { entity_id: room.offScript });
            setView({ type: "list" });
          }}
          style={{
            marginTop: "0.25rem", width: "100%", padding: "0.6rem",
            background: "#ef444420", border: "1px solid #ef4444",
            borderRadius: "0.625rem", color: "#ef4444", fontWeight: 600,
            fontSize: "0.85rem", cursor: "pointer",
          }}
        >⏻ Éteindre {room.label}</button>
      )}
    </DrillDown>
  );
}
