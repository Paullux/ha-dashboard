import { useState } from "react";
import type { HaState } from "../../types/ha";
import { ENTITIES, type RoomLight } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import { DrillDown, DrillItem } from "../DrillDown";
import { BrightnessSlider } from "../controls/BrightnessSlider";
import { ColorPresets } from "../controls/ColorPresets";
import "./LightsSection.css";

type View =
  | { type: "list" }
  | { type: "room"; index: number };

interface Props {
  states: Record<string, HaState>;
}

function RoomLightControl({
  room,
  entity,
  onBack,
}: {
  room: RoomLight;
  entity: HaState | undefined;
  onBack: () => void;
}) {
  const call = useServiceCall();
  const isOn = entity?.state === "on";
  const attrs = entity?.attributes as Record<string, unknown> ?? {};
  const brightness = (attrs["brightness"] as number | undefined) ?? 0;

  return (
    <DrillDown title={room.label} back={onBack}>
      {/* On / Off toggle */}
      <div className="light-toggle">
        <span className="light-toggle__label">{isOn ? "Allumée" : "Éteinte"}</span>
        <button
          className={`light-toggle__btn ${isOn ? "light-toggle__btn--on" : ""}`}
          onClick={() =>
            call("light", isOn ? "turn_off" : "turn_on", { entity_id: room.entity })
          }
        >
          {isOn ? "ON" : "OFF"}
        </button>
      </div>

      {/* Brightness — only when on */}
      {isOn && (
        <BrightnessSlider
          value={brightness}
          onChange={(v) =>
            call("light", "turn_on", { entity_id: room.entity, brightness: v })
          }
        />
      )}

      {/* Color presets */}
      {isOn && (
        <ColorPresets
          presets={room.colorPresets}
          onSelect={(p) => {
            const data: Record<string, unknown> = { entity_id: room.entity };
            if (p.kelvin)      data["color_temp_kelvin"] = p.kelvin;
            else if (p.rgb)    data["rgb_color"] = p.rgb;
            call("light", "turn_on", data);
          }}
        />
      )}
    </DrillDown>
  );
}

export function LightsSection({ states }: Props) {
  const [view, setView] = useState<View>({ type: "list" });
  const cfg = ENTITIES.lights;

  if (view.type === "room") {
    const room = cfg.rooms[view.index]!;
    return (
      <RoomLightControl
        room={room}
        entity={states[room.entity]}
        onBack={() => setView({ type: "list" })}
      />
    );
  }

  return (
    <DrillDown title="Lumières">
      {cfg.rooms.map((room, i) => {
        const entity = states[room.entity];
        const isOn = entity?.state === "on";
        const attrs = entity?.attributes as Record<string, unknown> ?? {};
        const brightness = (attrs["brightness"] as number | undefined);
        const pct = brightness !== undefined ? Math.round((brightness / 255) * 100) : undefined;
        return (
          <DrillItem
            key={room.entity}
            label={room.label}
            sub={isOn ? `Allumée${pct !== undefined ? ` · ${pct}%` : ""}` : "Éteinte"}
            accent={isOn ? "var(--on)" : undefined}
            onClick={() => setView({ type: "room", index: i })}
          />
        );
      })}
    </DrillDown>
  );
}
