import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import "./SmartSummary.css";

interface Props {
  states: Record<string, HaState>;
}

function buildSentences(states: Record<string, HaState>): string[] {
  const sentences: string[] = [];

  // Température intérieure
  const tempIn = states[ENTITIES.ambient.tempIndoor];
  const tempOut = states[ENTITIES.ambient.tempOutdoor];
  if (tempIn) {
    const t = parseFloat(tempIn.state);
    if (!isNaN(t)) {
      let s = `${t.toFixed(1)} °C à l'intérieur`;
      if (tempOut) {
        const o = parseFloat(tempOut.state);
        if (!isNaN(o)) s += `, ${o.toFixed(1)} °C dehors`;
      }
      sentences.push(s + ".");
    }
  }

  // Météo
  const weather = states[ENTITIES.weather.entity];
  const weatherLabel: Record<string, string> = {
    sunny: "Temps ensoleillé", partlycloudy: "Ciel partiellement nuageux",
    cloudy: "Ciel couvert", rainy: "Pluie prévue", pouring: "Fortes pluies",
    snowy: "Neige", windy: "Vent fort", fog: "Brouillard", clear_night: "Nuit claire",
  };
  if (weather && weatherLabel[weather.state]) {
    sentences.push(`${weatherLabel[weather.state]}.`);
  }

  // Lumières allumées
  const allLights = ENTITIES.lights.favorites;
  const lightsOn = allLights.filter((l) => states[l.entity]?.state === "on");
  if (lightsOn.length === 0) {
    sentences.push("Toutes les lumières sont éteintes.");
  } else if (lightsOn.length === 1) {
    sentences.push(`${lightsOn[0]!.label} allumée.`);
  } else {
    sentences.push(`${lightsOn.length} lumières allumées : ${lightsOn.map((l) => l.label).join(", ")}.`);
  }

  // Climatisation
  const clim = states[ENTITIES.climate.entity];
  if (clim) {
    const mode = clim.state;
    const attrs = clim.attributes as Record<string, unknown>;
    const setpoint = attrs["temperature"] as number | undefined;
    const modeLabel: Record<string, string> = {
      cool: "en mode froid", heat: "en mode chaud", dry: "en mode sec", auto: "en mode auto",
    };
    if (mode === "off") {
      sentences.push("Climatisation éteinte.");
    } else if (modeLabel[mode]) {
      sentences.push(`Climatisation ${modeLabel[mode]}${setpoint !== undefined ? ` · consigne ${setpoint} °C` : ""}.`);
    }
  }

  // Radiateurs actifs
  const radiateurActifs = ENTITIES.heating.rooms.filter((r) => {
    const s = states[r.entity]?.state;
    return s && s !== "off" && s !== "unavailable";
  });
  if (radiateurActifs.length > 0) {
    sentences.push(`${radiateurActifs.length} radiateur${radiateurActifs.length > 1 ? "s" : ""} actif${radiateurActifs.length > 1 ? "s" : ""}.`);
  }

  // Consommation hier
  const energy = states[ENTITIES.energy.yesterdayKwh];
  if (energy) {
    const kwh = parseFloat(energy.state);
    if (!isNaN(kwh)) {
      sentences.push(`Consommation hier : ${kwh.toFixed(1)} kWh.`);
    }
  }

  return sentences;
}

export function SmartSummary({ states }: Props) {
  const sentences = buildSentences(states);
  if (sentences.length === 0) return null;

  return (
    <div className="smart-summary">
      {sentences.map((s, i) => (
        <span key={i} className="smart-summary__item">{s}</span>
      ))}
    </div>
  );
}
