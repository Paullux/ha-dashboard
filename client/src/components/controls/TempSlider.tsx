import { useState } from "react";
import "./TempSlider.css";

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function TempSlider({ value, min, max, step = 0.5, onChange }: Props) {
  const [local, setLocal] = useState(value);

  const pct = ((local - min) / (max - min)) * 100;

  return (
    <div className="temp-slider">
      <div className="temp-slider__value">{local.toFixed(1)} °C</div>
      <div className="temp-slider__track-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local}
          className="temp-slider__input"
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
          onChange={(e) => setLocal(parseFloat(e.target.value))}
          onMouseUp={() => onChange(local)}
          onTouchEnd={() => onChange(local)}
        />
      </div>
      <div className="temp-slider__bounds">
        <span>{min} °C</span>
        <span>{max} °C</span>
      </div>
    </div>
  );
}
