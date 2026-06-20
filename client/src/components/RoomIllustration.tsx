import { useRoomSvg } from "../hooks/useRoomSvg";
import type { Theme } from "../hooks/useTheme";
import "./RoomIllustration.css";

interface Props {
  roomId: string;
  theme: Theme;
}

export function RoomIllustration({ roomId, theme }: Props) {
  const svg = useRoomSvg(`/rooms/${roomId}.svg`, theme);

  if (!svg) {
    return <div className="room-illustration room-illustration--placeholder" />;
  }

  return (
    <div
      className="room-illustration"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
