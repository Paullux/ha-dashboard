import { useRoomSvg } from "../hooks/useRoomSvg";
import type { Theme } from "../hooks/useTheme";
import "./RoomIllustration.css";

interface Props {
  roomId: string;
  theme: Theme;
  lightOn?: boolean;
  climActive?: boolean;
  heatActive?: boolean;
  isNight?: boolean;
}

export function RoomIllustration({ roomId, theme, lightOn, climActive, heatActive, isNight = false }: Props) {
  const svg = useRoomSvg(`/rooms/${roomId}.svg`, theme);

  const classes = [
    "room-illustration",
    isNight    ? "room-illustration--night" : "room-illustration--day",
    lightOn    ? "room-illustration--light-on" : "",
    climActive ? "room-illustration--clim" : "",
    heatActive ? "room-illustration--heat" : "",
  ].filter(Boolean).join(" ");

  if (!svg) {
    return <div className="room-illustration room-illustration--placeholder" />;
  }

  return (
    <div className={classes}>
      <div className="room-illustration__svg" dangerouslySetInnerHTML={{ __html: svg }} />
      {lightOn    && <div className="room-illustration__overlay room-illustration__overlay--light" />}
      {climActive && <div className="room-illustration__overlay room-illustration__overlay--clim" />}
      {heatActive && <div className="room-illustration__overlay room-illustration__overlay--heat" />}
      {isNight    && <div className="room-illustration__overlay room-illustration__overlay--night" />}
      {climActive && <div className="room-illustration__particles room-illustration__particles--cold" />}
      {heatActive && <div className="room-illustration__particles room-illustration__particles--warm" />}
    </div>
  );
}
