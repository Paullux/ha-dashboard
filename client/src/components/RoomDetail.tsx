import { useEffect } from "react";
import type { HaState } from "../types/ha";
import { useServiceCall } from "../hooks/useServiceCall";
import "./RoomDetail.css";

interface Device {
  label: string;
  entity: string;
  type: "light" | "climate";
}

interface Props {
  roomLabel: string;
  devices: Device[];
  states: Record<string, HaState>;
  onBack: () => void;
}

function LightRow({ device, states }: { device: Device; states: Record<string, HaState> }) {
  const call = useServiceCall();
  const state = states[device.entity];
  const isOn = state?.state === "on";
  const brightness = state ? Math.round(((state.attributes as Record<string, unknown>)["brightness"] as number ?? 0) / 2.55) : 0;

  return (
    <div className="rd-device">
      <div className="rd-device__info">
        <span className="rd-device__icon">💡</span>
        <div>
          <span className="rd-device__label">{device.label}</span>
          {isOn && brightness > 0 && (
            <span className="rd-device__sub">{brightness}%</span>
          )}
        </div>
      </div>
      <div className="rd-device__controls">
        <span className={`rd-device__state ${isOn ? "rd-device__state--on" : ""}`}>
          {state ? (isOn ? "Allumée" : "Éteinte") : "—"}
        </span>
        <button
          className={`toggle ${isOn ? "toggle--on" : ""}`}
          onClick={() => call("light", isOn ? "turn_off" : "turn_on", { entity_id: device.entity })}
        >
          <span className="toggle__thumb" />
        </button>
      </div>
    </div>
  );
}

function ClimateRow({ device, states }: { device: Device; states: Record<string, HaState> }) {
  const call = useServiceCall();
  const state = states[device.entity];
  const attrs = state?.attributes as Record<string, unknown> ?? {};
  const hvacMode = state?.state ?? "off";
  const isOn = hvacMode !== "off";
  const temp = attrs["temperature"] as number | undefined;
  const currentTemp = attrs["current_temperature"] as number | undefined;

  const modeLabel: Record<string, string> = {
    off: "Éteint", cool: "Froid", heat: "Chaud", dry: "Sec", auto: "Auto", heat_cool: "Auto",
  };

  return (
    <div className="rd-device">
      <div className="rd-device__info">
        <span className="rd-device__icon">🌡️</span>
        <div>
          <span className="rd-device__label">{device.label}</span>
          {currentTemp !== undefined && (
            <span className="rd-device__sub">Actuel : {currentTemp} °C</span>
          )}
        </div>
      </div>
      <div className="rd-device__controls">
        <span className={`rd-device__state ${isOn ? "rd-device__state--on" : ""}`}>
          {state ? `${modeLabel[hvacMode] ?? hvacMode}${temp !== undefined ? ` · ${temp} °C` : ""}` : "—"}
        </span>
        <button
          className={`toggle ${isOn ? "toggle--on" : ""}`}
          onClick={() => call("climate", isOn ? "turn_off" : "turn_on", { entity_id: device.entity })}
        >
          <span className="toggle__thumb" />
        </button>
      </div>
    </div>
  );
}

export function RoomDetail({ roomLabel, devices, states, onBack }: Props) {
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (e.button === 3) { e.preventDefault(); onBack(); } };
    window.addEventListener("mouseup", handler);
    return () => window.removeEventListener("mouseup", handler);
  }, [onBack]);

  return (
    <div className="room-detail">
      <div className="rd-header">
        <button className="rd-back" onClick={onBack}>‹ Retour</button>
        <h2 className="rd-title">{roomLabel}</h2>
      </div>
      <div className="rd-devices">
        {devices.map((device) =>
          device.type === "light"
            ? <LightRow key={device.entity} device={device} states={states} />
            : <ClimateRow key={device.entity} device={device} states={states} />
        )}
      </div>
    </div>
  );
}
