export interface HaState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HaWsMessage {
  type: string;
  id?: number;
  [key: string]: unknown;
}

export interface HaStateChangedEvent {
  entity_id: string;
  new_state: HaState | null;
  old_state: HaState | null;
}
