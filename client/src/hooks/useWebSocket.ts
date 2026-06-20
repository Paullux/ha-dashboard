import { useEffect, useRef, useCallback } from "react";
import type { HaWsMessage } from "../types/ha";

type MessageHandler = (msg: HaWsMessage) => void;

function getWsUrl(): string {
  const base = import.meta.env["VITE_API_URL"];
  if (base) {
    return base.replace(/^http/, "ws") + "/ws";
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

export function useWebSocket(onMessage: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  const send = useCallback((msg: HaWsMessage) => {
    wsRef.current?.send(JSON.stringify(msg));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(getWsUrl());
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
