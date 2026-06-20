import { useEffect, useRef, useCallback } from "react";
import type { HaWsMessage } from "../types/ha";

type MessageHandler = (msg: HaWsMessage) => void;

export function useWebSocket(onMessage: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  const send = useCallback((msg: HaWsMessage) => {
    wsRef.current?.send(JSON.stringify(msg));
  }, []);

  useEffect(() => {
    const wsUrl = (import.meta.env["VITE_API_URL"] ?? "")
      .replace(/^http/, "ws")
      .concat("/ws");

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as HaWsMessage;
        handlerRef.current(msg);
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = (e) => console.error("WS error", e);

    return () => ws.close();
  }, []);

  return { send };
}
