import { jsx as _jsx } from "react/jsx-runtime";
import { useRoomSvg } from "../hooks/useRoomSvg";
import "./RoomIllustration.css";
export function RoomIllustration({ roomId, theme }) {
    const svg = useRoomSvg(`/rooms/${roomId}.svg`, theme);
    if (!svg) {
        return _jsx("div", { className: "room-illustration room-illustration--placeholder" });
    }
    return (_jsx("div", { className: "room-illustration", dangerouslySetInnerHTML: { __html: svg } }));
}
