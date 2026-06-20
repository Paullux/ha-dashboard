import "./ModeButtons.css";

interface Mode {
  label: string;
  value: string;
  color?: string;
}

interface Props {
  modes: readonly Mode[];
  current: string;
  onSelect: (value: string) => void;
}

export function ModeButtons({ modes, current, onSelect }: Props) {
  return (
    <div className="mode-buttons">
      {modes.map((m) => (
        <button
          key={m.value}
          className={`mode-btn ${current === m.value ? "mode-btn--active" : ""}`}
          style={current === m.value && m.color ? { borderColor: m.color, color: m.color } : undefined}
          onClick={() => onSelect(m.value)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
