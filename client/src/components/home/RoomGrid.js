import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ENTITIES } from "../../config/dashboard";
import { RoomIllustration } from "../RoomIllustration";
import "./RoomGrid.css";
function RoomCard({ room, states, theme, onClick }) {
    const tempState = room.tempEntity ? states[room.tempEntity] : null;
    const lightState = room.lightEntity ? states[room.lightEntity] : null;
    const temp = tempState
        ? `${parseFloat(tempState.attributes["current_temperature"] ?? tempState.state).toFixed(0)} °C`
        : null;
    const lightOn = lightState?.state === "on";
    const lightLabel = lightState ? (lightOn ? "Allumée" : "Éteinte") : null;
    return (_jsxs("button", { className: "room-card", onClick: onClick, children: [_jsxs("div", { className: "room-card__header", children: [_jsx("span", { className: "room-card__name", children: room.label }), _jsx("span", { className: "room-card__arrow", children: "\u203A" })] }), _jsx(RoomIllustration, { roomId: room.id, theme: theme }), _jsxs("div", { className: "room-card__footer", children: [temp && (_jsxs("span", { className: "room-card__meta", children: [_jsx("span", { className: "room-card__meta-icon", children: "\uD83C\uDF21\uFE0F" }), " ", temp] })), lightLabel && (_jsxs("span", { className: `room-card__meta ${lightOn ? "room-card__meta--on" : ""}`, children: [_jsx("span", { className: "room-card__meta-icon", children: "\uD83D\uDCA1" }), " ", lightLabel] }))] })] }));
}
export function RoomGrid({ states, theme, onRoomClick }) {
    return (_jsxs("section", { className: "room-section", children: [_jsx("h2", { className: "section-title", children: "Pi\u00E8ces" }), _jsx("div", { className: "room-grid", children: ENTITIES.rooms.map((room) => (_jsx(RoomCard, { room: room, states: states, theme: theme, onClick: () => onRoomClick(room.id) }, room.id))) })] }));
}
