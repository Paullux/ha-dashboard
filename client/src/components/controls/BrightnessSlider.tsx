import { useState } from "react";
import "./BrightnessSlider.css";

interface Props {
  value: number; // 0-255 from HA
  onChange: (value: number) => void;
}

export function BrightnessSlider({ value, onChange }: Props) {
  const pct = Math.round((value / 255) * 100);
  const [local, setLocal] = useState(pct);

  return (
    <div className="brightness-slider">
      <div className="brightness-slider__label">
        <span>Luminosité</span>
        <span className="brightness-slider__pct">{local} %</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={local}
        className="brightness-slider__input"
        style={{ "--pct": `${local}%` } as React.CSSProperties}
        onChange={(e) => setLocal(parseInt(e.target.value))}
        onMouseUp={() => onChange(Math.round((local / 100) * 255))}
        onTouchEnd={() => onChange(Math.round((local / 100) * 255))}
      />
    </div>
  );
}
