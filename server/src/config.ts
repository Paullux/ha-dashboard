import path from "path";
import dotenv from "dotenv";
// In dev: .env is at repo root (one level up). In Docker: env vars are injected directly.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  haUrl: (process.env["HA_URL"] ?? process.env["HA_URL_EXTERNAL"] ?? "").replace(/\/$/, ""),
  haUrlExternal: (process.env["HA_URL_EXTERNAL"] ?? "").replace(/\/$/, ""),
  haToken:      required("HA_TOKEN"),
  jwtSecret:    required("JWT_SECRET"),
  passwordHash: required("AUTH_PASSWORD_HASH"),
  port: parseInt(process.env["SERVER_PORT"] ?? "3001", 10),
};

if (!config.haUrl) throw new Error("Missing required env var: HA_URL");
