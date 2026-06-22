import { useEffect, useState, useRef } from "react";
import type { HaState } from "../types/ha";
import { ENTITIES } from "../config/dashboard";
import "./PhotoFrame.css";

const BASE = import.meta.env["VITE_API_URL"] ?? "";
const SLIDE_INTERVAL = 8000;

interface Props {
  states: Record<string, HaState>;
  onDismiss: () => void;
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

export function PhotoFrame({ states, onDismiss }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch photo list
  useEffect(() => {
    fetch(`${BASE}/api/photos/list`, { credentials: "include" })
      .then((r) => r.json())
      .then((list: string[]) => {
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setPhotos(shuffled);
      })
      .catch(() => setPhotos([]));
  }, []);

  // Slideshow timer
  useEffect(() => {
    if (photos.length <= 1) return;
    timerRef.current = setInterval(() => {
      setLoaded(false);
      setIndex((i) => (i + 1) % photos.length);
    }, SLIDE_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos]);

  const tempIn = states[ENTITIES.ambient.tempIndoor];
  const tempOut = states[ENTITIES.ambient.tempOutdoor];
  const weather = states[ENTITIES.weather.entity];
  const weatherLabel: Record<string, string> = {
    sunny: "Ensoleillé", partlycloudy: "Partiellement nuageux", cloudy: "Nuageux",
    rainy: "Pluvieux", snowy: "Neigeux", windy: "Venteux", fog: "Brouillard", clear_night: "Nuit claire",
  };

  const photoUrl = photos.length > 0
    ? `${BASE}/api/photos/${encodeURIComponent(photos[index] ?? "")}`
    : null;

  return (
    <div className="photo-frame" onClick={onDismiss}>
      {photoUrl ? (
        <img
          key={photoUrl}
          src={photoUrl}
          alt=""
          className={`pf-img ${loaded ? "pf-img--loaded" : ""}`}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="pf-no-photos">Aucune photo dans /config/www/photos/</div>
      )}

      <div className="pf-overlay" />

      <div className="pf-info">
        <Clock />
        <div className="pf-sensors">
          {tempIn && (
            <span className="pf-sensor">🏠 {parseFloat(tempIn.state).toFixed(1)} °C</span>
          )}
          {tempOut && (
            <span className="pf-sensor">🌡️ {parseFloat(tempOut.state).toFixed(1)} °C</span>
          )}
          {weather && (
            <span className="pf-sensor">
              {weatherLabel[weather.state] ?? weather.state}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
