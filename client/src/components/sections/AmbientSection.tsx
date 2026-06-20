import type { HaState } from "../../types/ha";
import { ENTITIES } from "../../config/dashboard";
import { DrillDown } from "../DrillDown";
import "./AmbientSection.css";

interface Props {
  states: Record<string, HaState>;
}

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">
        {value}
        {unit && <span className="stat-card__unit">{unit}</span>}
      </span>
    </div>
  );
}

export function AmbientSection({ states }: Props) {
  const e = ENTITIES.ambient;
  const tempIn  = states[e.tempIndoor]?.state  ?? "—";
  const tempOut = states[e.tempOutdoor]?.state ?? "—";
  const season  = states[e.season]?.state      ?? "—";
  const mode    = states[e.modeApt]?.state     ?? "—";

  return (
    <DrillDown title="Données ambiantes">
      <StatCard label="Intérieur"        value={tempIn}  unit=" °C" />
      <StatCard label="Extérieur"        value={tempOut} unit=" °C" />
      <StatCard label="Saison"           value={season} />
      <StatCard label="Mode appartement" value={mode} />
    </DrillDown>
  );
}
