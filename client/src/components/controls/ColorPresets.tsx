import "./ColorPresets.css";

interface Preset {
  label: string;
  color: string;
  kelvin?: number;
  rgb?: [number, number, number];
}

interface Props {
  presets: readonly Preset[];
  onSelect: (preset: Preset) => void;
}

export function ColorPresets({ presets, onSelect }: Props) {
  return (
    <div className="color-presets">
      <span className="color-presets__label">Couleur</span>
      <div className="color-presets__list">
        {presets.map((p) => (
          <button
            key={p.label}
            className="color-preset"
            style={{ background: p.color }}
            title={p.label}
            onClick={() => onSelect(p)}
          />
        ))}
      </div>
    </div>
  );
}
