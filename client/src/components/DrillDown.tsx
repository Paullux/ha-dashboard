import "./DrillDown.css";

interface Props {
  title: string;
  back?: () => void;
  children: React.ReactNode;
}

export function DrillDown({ title, back, children }: Props) {
  return (
    <div className="drilldown">
      <div className="drilldown__header">
        {back && (
          <button className="drilldown__back" onClick={back} aria-label="Retour">
            ←
          </button>
        )}
        <h2 className="drilldown__title">{title}</h2>
      </div>
      <div className="drilldown__body">{children}</div>
    </div>
  );
}

interface ItemProps {
  label: string;
  sub?: string;
  accent?: string;
  onClick: () => void;
}

export function DrillItem({ label, sub, accent, onClick }: ItemProps) {
  return (
    <button
      className="drill-item"
      style={accent ? { borderLeftColor: accent } : undefined}
      onClick={onClick}
    >
      <span className="drill-item__label">{label}</span>
      {sub && <span className="drill-item__sub">{sub}</span>}
      <span className="drill-item__arrow">›</span>
    </button>
  );
}
