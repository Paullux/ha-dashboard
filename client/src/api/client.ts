const BASE = import.meta.env["VITE_API_URL"] ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/ha/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`HA API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const haApi = {
  getStates: <T>() => request<T>("states"),
  getState: <T>(entityId: string) => request<T>(`states/${entityId}`),
  callService: (domain: string, service: string, data: Record<string, unknown>) =>
    request(`services/${domain}/${service}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
