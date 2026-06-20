import { ENTITIES } from "../../config/dashboard";
import { useServiceCall } from "../../hooks/useServiceCall";
import "./SceneButtons.css";

export function SceneButtons() {
  const call = useServiceCall();

  return (
    <section className="scenes-section">
      <h2 className="section-title">Scènes</h2>
      <div className="scenes-grid">
        {ENTITIES.scenes.map((scene) => (
          <button
            key={scene.entity}
            className="scene-btn"
            onClick={() => call("scene", "turn_on", { entity_id: scene.entity })}
          >
            <span className="scene-btn__icon">{scene.icon}</span>
            <span className="scene-btn__label">{scene.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
