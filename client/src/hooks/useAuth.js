import { useState, useEffect } from "react";
export function useAuth() {
    const [state, setState] = useState("loading");
    useEffect(() => {
        fetch("/auth/me", { credentials: "include" })
            .then((r) => setState(r.ok ? "authenticated" : "unauthenticated"))
            .catch(() => setState("unauthenticated"));
    }, []);
    const login = async (password) => {
        const r = await fetch("/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (r.ok) {
            setState("authenticated");
            return null;
        }
        const data = await r.json();
        return data.error ?? "Erreur de connexion";
    };
    const logout = async () => {
        await fetch("/auth/logout", { method: "POST", credentials: "include" });
        setState("unauthenticated");
    };
    return { state, login, logout };
}
