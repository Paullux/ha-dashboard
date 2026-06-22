const BASE = import.meta.env["VITE_API_URL"] ?? "";
async function request(path, init) {
    const res = await fetch(`${BASE}/api/ha/${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok)
        throw new Error(`HA API error ${res.status}: ${path}`);
    return res.json();
}
export const haApi = {
    getStates: () => request("states"),
    getState: (entityId) => request(`states/${entityId}`),
    callService: (domain, service, data) => request(`services/${domain}/${service}`, {
        method: "POST",
        body: JSON.stringify(data),
    }),
};
