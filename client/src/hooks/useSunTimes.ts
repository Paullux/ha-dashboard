import type { HaState } from "../types/ha";

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  isNight: boolean;
  isEvening: boolean; // après coucher du soleil
  isMorning: boolean; // dans l'heure qui suit le lever
}

export function useSunTimes(states: Record<string, HaState>): SunTimes {
  const weather = states["weather.forecast_maison"];
  const attrs = weather?.attributes as Record<string, unknown> | undefined;

  const parse = (key: string): Date | null => {
    const val = attrs?.[key];
    if (!val || typeof val !== "string") return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const now = new Date();

  // HA fournit next_rising / next_setting — si le soleil est déjà levé
  // next_rising est demain, next_setting est aujourd'hui (et vice-versa)
  const nextRising  = parse("next_rising");
  const nextSetting = parse("next_setting");

  // On reconstruit sunrise/sunset du jour courant
  let sunrise: Date | null = null;
  let sunset:  Date | null = null;

  if (nextRising && nextSetting) {
    if (nextRising < nextSetting) {
      // Soleil pas encore levé → sunrise = nextRising aujourd'hui
      sunrise = nextRising;
      // sunset = nextSetting après sunrise (même jour ou demain)
      sunset = nextSetting;
    } else {
      // Soleil déjà levé → sunrise était avant maintenant
      // nextRising = demain, nextSetting = ce soir
      sunset = nextSetting;
      // Approximer sunrise d'aujourd'hui : nextRising - 24h
      sunrise = new Date(nextRising.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  // Fallback si HA ne fournit pas les attributs
  const fallbackSunrise = new Date(now); fallbackSunrise.setHours(7, 0, 0, 0);
  const fallbackSunset  = new Date(now); fallbackSunset.setHours(21, 0, 0, 0);

  const sr = sunrise ?? fallbackSunrise;
  const ss = sunset  ?? fallbackSunset;

  const isNight    = now < sr || now > ss;
  const isEvening  = now > ss;
  const isMorning  = now >= sr && now < new Date(sr.getTime() + 60 * 60 * 1000);

  return { sunrise: sr, sunset: ss, isNight, isEvening, isMorning };
}
