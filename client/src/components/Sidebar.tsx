import type { Theme } from "../hooks/useTheme";
import "./Sidebar.css";

export type Section = "home" | "ambient" | "climate" | "heating" | "lights";

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "home",    label: "Accueil",      icon: "🏠" },
  { id: "ambient", label: "Ambiance",     icon: "🌡️" },
  { id: "climate", label: "Climatiseur",  icon: "❄️" },
  { id: "heating", label: "Chauffage",    icon: "🔥" },
  { id: "lights",  label: "Lumières",     icon: "💡" },
];

interface Props {
  active: Section;
  connected: boolean;
  theme: Theme;
  onSelect: (s: Section) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function Sidebar({ active, connected, theme, onSelect, onToggleTheme, onLogout }: Props) {
  return (
    <nav className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">🏡</span>
        <span className="sidebar__brand-name">Home</span>
        <span className={`sidebar__dot ${connected ? "sidebar__dot--on" : ""}`} />
      </div>

      <ul className="sidebar__nav">
        {NAV.map((item) => (
          <li key={item.id}>
            <button
              className={`sidebar__item ${active === item.id ? "sidebar__item--active" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar__footer">
        <button
          className="sidebar__theme-toggle"
          onClick={onToggleTheme}
          aria-label="Changer le thème"
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
        >
          <span className="sidebar__theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span className="sidebar__label">{theme === "dark" ? "Mode clair" : "Mode sombre"}</span>
        </button>
        <button
          className="sidebar__theme-toggle"
          onClick={onLogout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
        >
          <span className="sidebar__theme-icon">🔓</span>
          <span className="sidebar__label">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
