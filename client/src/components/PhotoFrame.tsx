import { useEffect, useState } from "react";
import type { HaState } from "../types/ha";
import { ENTITIES } from "../config/dashboard";
import "./PhotoFrame.css";

const BASE = import.meta.env["VITE_API_URL"] ?? "";
const DAY_IMG   = `${BASE}/api/photos/ambiance/sejour-lumieres-eteintes.jpg`;
const NIGHT_IMG = `${BASE}/api/photos/ambiance/sejour-soir.jpg`;

interface Ambiance {
  useNight: boolean;
  filter: string;
  overlay: string;
  rain: boolean;
  lampSejour: boolean;
  lampBureau: boolean;
}

function getAmbiance(states: Record<string, HaState>): Ambiance {
  const hour = new Date().getHours();
  const weatherState = states[ENTITIES.weather.entity]?.state ?? "";
  const isEvening = hour >= 19 || hour < 7;
  const rain = ["rainy", "pouring", "lightning", "lightning-rainy"].includes(weatherState);
  const lampSejour = states["light.lumieres_sejour"]?.state === "on";
  const lampBureau = states["light.bureau"]?.state === "on";

  if (isEvening) {
    const nightFilter = hour >= 23 || hour < 5
      ? "brightness(0.45) saturate(0.7)"
      : "brightness(0.85) saturate(1.0)";
    return { useNight: true, filter: nightFilter, overlay: "rgba(10,15,40,0.25)", rain, lampSejour, lampBureau };
  }

  const filterMap: Record<string, string> = {
    sunny:        "brightness(1.25) contrast(1.05) saturate(1.2)",
    partlycloudy: "brightness(1.05) saturate(1.0)",
    cloudy:       "brightness(0.88) saturate(0.75) contrast(0.95)",
    rainy:        "brightness(0.72) saturate(0.55) contrast(0.9)",
    pouring:      "brightness(0.65) saturate(0.45) contrast(0.88)",
    fog:          "brightness(0.82) saturate(0.5) contrast(0.85)",
    snowy:        "brightness(1.1) saturate(0.5) contrast(0.9)",
    windy:        "brightness(1.0) saturate(0.9)",
  };
  const overlayMap: Record<string, string> = {
    sunny:        "rgba(255,200,80,0.08)",
    partlycloudy: "rgba(200,220,255,0.05)",
    cloudy:       "rgba(150,170,200,0.12)",
    rainy:        "rgba(80,100,140,0.18)",
    pouring:      "rgba(60,80,120,0.22)",
    fog:          "rgba(200,210,220,0.2)",
  };

  if (hour >= 6 && hour < 10) {
    return {
      useNight: false,
      filter: "brightness(1.05) saturate(1.1) sepia(0.08)",
      overlay: "rgba(255,160,60,0.1)",
      rain, lampSejour, lampBureau,
    };
  }

  return {
    useNight: false,
    filter: filterMap[weatherState] ?? "brightness(1.0)",
    overlay: overlayMap[weatherState] ?? "transparent",
    rain, lampSejour, lampBureau,
  };
}

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="pf-clock">
      <div className="pf-clock__time">{time}</div>
      <div className="pf-clock__date">{date}</div>
    </div>
  );
}

interface Props {
  states: Record<string, HaState>;
  onDismiss: () => void;
}

export function PhotoFrame({ states, onDismiss }: Props) {
  const [ambiance, setAmbiance] = useState<Ambiance>(() => getAmbiance(states));
  const [showNight, setShowNight] = useState(() => getAmbiance(states).useNight);

  // Update ambiance every minute + when states change (for lamps)
  useEffect(() => {
    const a = getAmbiance(states);
    setAmbiance(a);
    setShowNight(a.useNight);
  }, [states]);

  useEffect(() => {
    const t = setInterval(() => {
      const a = getAmbiance(states);
      setAmbiance(a);
      setShowNight(a.useNight);
    }, 60_000);
    return () => clearInterval(t);
  }, [states]);

  // Build lamp halo gradient
  const lampGradients: string[] = [];
  if (ambiance.lampSejour) {
    lampGradients.push("radial-gradient(ellipse 28% 38% at 78% 18%, rgba(255,200,100,0.45) 0%, transparent 70%)");
  }
  if (ambiance.lampBureau) {
    lampGradients.push("radial-gradient(ellipse 22% 32% at 14% 22%, rgba(255,210,130,0.38) 0%, transparent 70%)");
  }
  const lampOverlay = lampGradients.length > 0 ? lampGradients.join(", ") : "none";

  const tempIn  = states[ENTITIES.ambient.tempIndoor];
  const tempOut = states[ENTITIES.ambient.tempOutdoor];
  const weather = states[ENTITIES.weather.entity];
  const weatherLabel: Record<string, string> = {
    sunny: "Ensoleillé", partlycloudy: "Partiellement nuageux", cloudy: "Nuageux",
    rainy: "Pluvieux", pouring: "Forte pluie", snowy: "Neigeux",
    windy: "Venteux", fog: "Brouillard", clear_night: "Nuit claire",
  };

  return (
    <div className="photo-frame" onClick={onDismiss}>

      {/* Ambiance background — day/night crossfade */}
      <img src={DAY_IMG}   className={`pf-bg ${!showNight ? "pf-bg--active" : ""}`} alt="" style={{ filter: ambiance.filter }} />
      <img src={NIGHT_IMG} className={`pf-bg ${showNight  ? "pf-bg--active" : ""}`} alt="" style={{ filter: ambiance.filter }} />

      {/* Weather color tint */}
      <div className="pf-tint" style={{ background: ambiance.overlay }} />

      {/* Lamp halos — independent per lamp */}
      <div className="pf-lamps" style={{ background: lampOverlay }} />

      {/* Rain effect */}
      {ambiance.rain && <div className="pf-rain"><div className="pf-rain__drops" /></div>}


      <div className="pf-overlay" />

      <div className="pf-info">
        <Clock />
        <div className="pf-sensors">
          {tempIn  && <span className="pf-sensor">🏠 {parseFloat(tempIn.state).toFixed(1)} °C</span>}
          {tempOut && <span className="pf-sensor">🌡️ {parseFloat(tempOut.state).toFixed(1)} °C</span>}
          {weather && <span className="pf-sensor">{weatherLabel[weather.state] ?? weather.state}</span>}
        </div>
      </div>
    </div>
  );
}
