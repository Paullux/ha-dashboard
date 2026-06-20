import { useState, useEffect } from "react";

type AuthState = "loading" | "authenticated" | "unauthenticated";

export function useAuth() {
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    fetch("/auth/me", { credentials: "include" })
      .then((r) => setState(r.ok ? "authenticated" : "unauthenticated"))
      .catch(() => setState("unauthenticated"));
  }, []);

  const login = async (password: string): Promise<string | null> => {
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
    const data = await r.json() as { error?: string };
    return data.error ?? "Erreur de connexion";
  };

  const logout = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    setState("unauthenticated");
  };

  return { state, login, logout };
}
