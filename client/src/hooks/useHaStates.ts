import { useState, useEffect, useRef } from "react";
import type { HaState, HaWsMessage, HaStateChangedEvent } from "../types/ha";
import { haApi } from "../api/client";
import { useWebSocket } from "./useWebSocket";

export function useHaStates() {
  const [states, setStates] = useState<Record<string, HaState>>({});
  const [connected, setConnected] = useState(false);
  const subId = useRef(1);

  const { send } = useWebSocket((msg: HaWsMessage) => {
    if (msg.type === "auth_ok") {
      setConnected(true);
      // Subscribe to all state_changed events
      send({ id: subId.current++, type: "subscribe_events", event_type: "state_changed" });
    }

    if (msg.type === "event") {
      const event = msg["event"] as { data: HaStateChangedEvent } | undefined;
      const newState = event?.data?.new_state;
      if (newState) {
        setStates((prev) => ({ ...prev, [newState.entity_id]: newState }));
      }
    }
  });

  // Load initial snapshot via REST
  useEffect(() => {
    haApi.getStates<HaState[]>().then((list) => {
      const map: Record<string, HaState> = {};
      for (const s of list) map[s.entity_id] = s;
      setStates(map);
    }).catch(console.error);
  }, []);

  return { states, connected };
}
