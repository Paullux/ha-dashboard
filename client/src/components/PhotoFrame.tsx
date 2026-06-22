import { useEffect, useState, useRef } from "react";
import type { HaState } from "../types/ha";
import { ENTITIES } from "../config/dashboard";
import "./PhotoFrame.css";

const BASE = import.meta.env["VITE_API_URL"] ?? "";
const SLIDE_INTERVAL = 8000;
const DAY_IMG   = `${BASE}/api/photos/ambiance/sejour-lumieres-eteintes.jpg`;
const NIGHT_IMG = `${BASE}/api/photos/ambiance/sejour-soir.jpg`;

interface Ambiance {
  useNight: boolean;
  filter: string;
  overlay: string;
  rain: boolean;
}

function getAmbiance(states: Record<string, HaState>): Ambiance {
  const hour = new Date().getHours();
  const weatherState = states[ENTITIES.weather.entity]?.state ?? "";
  const isEvening = hour >= 19 || hour < 7;
  const rain = ["rainy", "pouring", "lightning", "lightning-rainy"].includes(weatherState);

  if (isEvening) {
    const nightFilter = hour >= 23 || hour < 5
      ? "brightness(0.45) saturate(0.7)"
      : "brightness(0.85) saturate(1.0)";
    return { useNight: true, filter: nightFilter, overlay: "rgba(10,15,40,0.25)", rain };
  }

  // Daytime
  const filterMap: Record<string, string> = {
    sunny:          "brightness(1.25) contrast(1.05) saturate(1.2)",
    partlycloudy:   "brightness(1.05) saturate(1.0)",
    cloudy:         "brightness(0.88) saturate(0.75) contrast(0.95)",
    rainy:          "brightness(0.72) saturate(0.55) contrast(0.9)",
    pouring:        "brightness(0.65) saturate(0.45) contrast(0.88)",
    fog:            "brightness(0.82) saturate(0.5) contrast(0.85)",
    snowy:          "brightness(1.1) saturate(0.5) contrast(0.9)",
    windy:          "brightness(1.0) saturate(0.9)",
  };
  const overlayMap: Record<string, string> = {
    sunny:        "rgba(255,200,80,0.08)",
    partlycloudy: "rgba(200,220,255,0.05)",
    cloudy:       "rgba(150,170,200,0.12)",
    rainy:        "rgba(80,100,140,0.18)",
    pouring:      "rgba(60,80,120,0.22)",
    fog:          "rgba(200,210,220,0.2)",
  };

  // Morning warm tint
  if (hour >= 6 && hour < 10) {
    return {
      useNight: false,
      filter: "brightness(1.05) saturate(1.1) sepia(0.08)",
      overlay: "rgba(255,160,60,0.1)",
      rain,
    };
  }

  return {
    useNight: false,
    filter: filterMap[weatherState] ?? "brightness(1.0)",
    overlay: overlayMap[weatherState] ?? "transparent",
    rain,
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [slideLoaded, setSlideLoaded] = useState(false);
  const [ambiance, setAmbiance] = useState<Ambiance>(() => getAmbiance(states));
  const [showNight, setShowNight] = useState(() => getAmbiance(states).useNight);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update ambiance every minute
  useEffect(() => {
    const t = setInterval(() => {
      const a = getAmbiance(states);
      setAmbiance(a);
      setShowNight(a.useNight);
    }, 60_000);
    return () => clearInterval(t);
  }, [states]);

  // Fetch slideshow photos
  useEffect(() => {
    fetch(`${BASE}/api/photos/list`, { credentials: "include" })
      .then((r) => r.json())
      .then((list: string[]) => setPhotos([...list].sort(() => Math.random() - 0.5)))
      .catch(() => setPhotos([]));
  }, []);

  // Slideshow timer
  useEffect(() => {
    if (photos.length <= 1) return;
    timerRef.current = setInterval(() => {
      setSlideLoaded(false);
      setIndex((i) => (i + 1) % photos.length);
    }, SLIDE_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos]);

  const tempIn  = states[ENTITIES.ambient.tempIndoor];
  const tempOut = states[ENTITIES.ambient.tempOutdoor];
  const weather = states[ENTITIES.weather.entity];
  const weatherLabel: Record<string, string> = {
    sunny: "Ensoleillé", partlycloudy: "Partiellement nuageux", cloudy: "Nuageux",
    rainy: "Pluvieux", pouring: "Forte pluie", snowy: "Neigeux",
    windy: "Venteux", fog: "Brouillard", clear_night: "Nuit claire",
  };

  const slideUrl = photos.length > 0
    ? `${BASE}/api/photos/${encodeURIComponent(photos[index] ?? "")}`
    : null;

  return (
    <div className="photo-frame" onClick={onDismiss}>

      {/* Ambiance background — day/night crossfade */}
      <img src={DAY_IMG}   className={`pf-bg pf-bg--day   ${!showNight ? "pf-bg--active" : ""}`} alt="" style={{ filter: ambiance.filter }} />
      <img src={NIGHT_IMG} className={`pf-bg pf-bg--night ${showNight  ? "pf-bg--active" : ""}`} alt="" style={{ filter: ambiance.filter }} />

      {/* Color overlay (weather tint) */}
      <div className="pf-tint" style={{ background: ambiance.overlay }} />

      {/* Rain effect */}
      {ambiance.rain && <div className="pf-rain"><div className="pf-rain__drops" /></div>}

      {/* Slideshow on top — shown at 30% opacity */}
      {slideUrl && (
        <img
          key={slideUrl}
          src={slideUrl}
          alt=""
          className={`pf-slide ${slideLoaded ? "pf-slide--loaded" : ""}`}
          onLoad={() => setSlideLoaded(true)}
        />
      )}

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
