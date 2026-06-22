import { useState, useEffect, useRef } from "react";
import { haApi } from "../api/client";
import { useWebSocket } from "./useWebSocket";
export function useHaStates() {
    const [states, setStates] = useState({});
    const [connected, setConnected] = useState(false);
    const subId = useRef(1);
    const { send } = useWebSocket((msg) => {
        if (msg.type === "auth_ok") {
            setConnected(true);
            // Subscribe to all state_changed events
            send({ id: subId.current++, type: "subscribe_events", event_type: "state_changed" });
        }
        if (msg.type === "event") {
            const event = msg["event"];
            const newState = event?.data?.new_state;
            if (newState) {
                setStates((prev) => ({ ...prev, [newState.entity_id]: newState }));
            }
        }
    });
    // Load initial snapshot via REST
    useEffect(() => {
        haApi.getStates().then((list) => {
            const map = {};
            for (const s of list)
                map[s.entity_id] = s;
            setStates(map);
        }).catch(console.error);
    }, []);
    return { states, connected };
}
