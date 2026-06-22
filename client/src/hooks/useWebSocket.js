import { useEffect, useRef, useCallback } from "react";
export function useWebSocket(onMessage) {
    const wsRef = useRef(null);
    const handlerRef = useRef(onMessage);
    handlerRef.current = onMessage;
    const send = useCallback((msg) => {
        wsRef.current?.send(JSON.stringify(msg));
    }, []);
    useEffect(() => {
        const wsUrl = (import.meta.env["VITE_API_URL"] ?? "")
            .replace(/^http/, "ws")
            .concat("/ws");
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                handlerRef.current(msg);
            }
            catch {
                // ignore malformed frames
            }
        };
        ws.onerror = (e) => console.error("WS error", e);
        return () => ws.close();
    }, []);
    return { send };
}
