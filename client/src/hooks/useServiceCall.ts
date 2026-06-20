import { useCallback } from "react";
import { haApi } from "../api/client";

export function useServiceCall() {
  const call = useCallback(
    (domain: string, service: string, data: Record<string, unknown>) =>
      haApi.callService(domain, service, data).catch(console.error),
    []
  );
  return call;
}
