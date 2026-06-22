import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import "./SummaryCards.css";

interface CardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  sub: string;
  subColor?: string;
}

function Card({ icon, label, value, unit, sub, subColor }: CardProps) {
  return (
    <div className="sum-card">
      <span className="sum-card__icon">{icon}</span>
      <div className="sum-card__body">
        <span className="sum-card__label">{label}</span>
        <span className="sum-card__value">
          {value}
          {unit && <span className="sum-card__unit">{unit}</span>}
        </span>
        <span className="sum-card__sub" style={subColor ? { color: subColor } : undefined}>
          {sub}
        </span>
      </div>
    </div>
  );
}

function weatherLabel(state: string) {
  const map: Record<string, string> = {
    sunny: "Ensoleillé", partlycloudy: "Nuageux", cloudy: "Couvert",
    rainy: "Pluvieux", snowy: "Neigeux", windy: "Venteux", fog: "Brumeux",
    clear: "Dégagé", lightning: "Orageux",
  };
  return map[state] ?? state;
}

interface Props {
  states: Record<string, HaState>;
}

export function SummaryCards({ states }: Props) {
  const e = ENTITIES;

  const tempState  = states[e.ambient.tempIndoor];
  const humState   = states[e.ambient.humidity];
  const yesterdayState = states[e.energy.yesterdayKwh];
  const wxState    = states[e.weather.entity];

  const temp    = tempState  ? parseFloat(tempState.state).toFixed(1)  : "—";
  const hum     = humState   ? Math.round(parseFloat(humState.state))   : "—";
  const yesterday = yesterdayState ? parseFloat(yesterdayState.state).toFixed(1) : "—";
  const wxTemp  = wxState    ? (wxState.attributes as Record<string,unknown>)["temperature"] as number : null;

  const humNum = typeof hum === "number" ? hum : null;
  const humColor = humNum !== null
    ? humNum < 30 ? "var(--warn)" : humNum > 70 ? "var(--warn)" : "var(--on)"
    : undefined;
  const humSub = humNum !== null
    ? humNum < 30 ? "Trop sec" : humNum > 70 ? "Trop humide" : "Bon"
    : "—";

  return (
    <div className="sum-cards">
      <Card icon="🌡️" label="Température" value={temp} unit=" °C" sub="Intérieur" />
      <Card icon="💧" label="Humidité" value={String(hum)} unit=" %" sub={humSub} subColor={humColor} />
      <Card icon="⚡" label="Énergie" value={yesterday} unit=" kWh" sub="Hier (Linky)" />
      <Card
        icon="🌤️"
        label="Météo"
        value={wxTemp !== null ? String(wxTemp) : "—"}
        unit=" °C"
        sub={wxState ? weatherLabel(wxState.state) : "—"}
      />
    </div>
  );
}
