import type { ReactNode } from "react";
import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import "./SmartSummary.css";

interface Props {
  states: Record<string, HaState>;
}

interface Item {
  icon: ReactNode;
  text: string;
}

function buildItems(states: Record<string, HaState>): Item[] {
  const items: Item[] = [];

  // Température intérieure / extérieure
  const tempIn  = states[ENTITIES.ambient.tempIndoor];
  const tempOut = states[ENTITIES.ambient.tempOutdoor];
  if (tempIn) {
    const t = parseFloat(tempIn.state);
    if (!isNaN(t)) {
      let text = `${t.toFixed(1)} °C intérieur`;
      if (tempOut) {
        const o = parseFloat(tempOut.state);
        if (!isNaN(o)) text += `, ${o.toFixed(1)} °C dehors`;
      }
      items.push({ icon: "🌡️", text });
    }
  }

  // Météo
  const weather = states[ENTITIES.weather.entity];
  const weatherLabel: Record<string, string> = {
    sunny: "Ensoleillé", partlycloudy: "Partiellement nuageux",
    cloudy: "Couvert", rainy: "Pluie", pouring: "Fortes pluies",
    snowy: "Neige", windy: "Vent fort", fog: "Brouillard", clear_night: "Nuit claire",
  };
  if (weather && weatherLabel[weather.state]) {
    items.push({ icon: "🌤️", text: weatherLabel[weather.state]! });
  }

  // Lumières
  const allLights = ENTITIES.lights.favorites;
  const lightsOn = allLights.filter((l) => states[l.entity]?.state === "on");
  const lightIcon = lightsOn.length > 0
    ? <span className="ss-icon ss-icon--glow">💡</span>
    : <span className="ss-icon ss-icon--dim">💡</span>;
  const lightText = lightsOn.length === 0
    ? "Lumières éteintes"
    : lightsOn.length === 1
      ? `${lightsOn[0]!.label} allumée`
      : `${lightsOn.length} lumières allumées`;
  items.push({ icon: lightIcon, text: lightText });

  // Climatisation
  const clim = states[ENTITIES.climate.entity];
  if (clim) {
    const mode  = clim.state;
    const attrs = clim.attributes as Record<string, unknown>;
    const setpoint = attrs["temperature"] as number | undefined;
    const modeLabel: Record<string, string> = {
      off: "Éteinte", cool: "Froid", heat: "Chaud", dry: "Sec", auto: "Auto",
    };
    const isOn = mode !== "off";
    const climIcon = isOn
      ? <span className="ss-icon ss-icon--spin">❄️</span>
      : <span className="ss-icon ss-icon--dim">❄️</span>;
    const climText = isOn
      ? `Climatisation ${modeLabel[mode] ?? mode}${setpoint !== undefined ? ` · ${setpoint} °C` : ""}`
      : "Climatisation éteinte";
    items.push({ icon: climIcon, text: climText });
  }

  // Radiateurs
  const tempOutVal = tempOut ? parseFloat(tempOut.state) : NaN;
  const coldOutside = !isNaN(tempOutVal) && tempOutVal < 10;
  const radiateurActifs = ENTITIES.heating.rooms.filter((r) => {
    const entity = states[r.entity];
    const s = entity?.state;
    const preset = (entity?.attributes as Record<string, unknown> | undefined)?.["preset_mode"] as string | undefined;
    return s && s !== "off" && s !== "unavailable" && preset !== "none";
  });
  if (radiateurActifs.length > 0) {
    const heatIcon = coldOutside
      ? <span className="ss-icon ss-icon--flicker">🔥</span>
      : <span className="ss-icon">🔥</span>;
    items.push({
      icon: heatIcon,
      text: `${radiateurActifs.length} radiateur${radiateurActifs.length > 1 ? "s" : ""} actif${radiateurActifs.length > 1 ? "s" : ""}`,
    });
  }

  // Consommation hier
  const energy = states[ENTITIES.energy.yesterdayKwh];
  if (energy) {
    const kwh = parseFloat(energy.state);
    if (!isNaN(kwh)) {
      items.push({ icon: "⚡", text: `Hier : ${kwh.toFixed(1)} kWh` });
    }
  }

  return items;
}

export function SmartSummary({ states }: Props) {
  const items = buildItems(states);
  if (items.length === 0) return null;

  return (
    <div className="smart-summary">
      {items.map((item, i) => (
        <span key={i} className="smart-summary__item">
          <span className="smart-summary__icon">{item.icon}</span>
          <span className="smart-summary__text">{item.text}</span>
        </span>
      ))}
    </div>
  );
}
