import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyPassword, signToken, verifyToken } from "../auth/auth";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many login attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const COOKIE = "ha_session";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "strict" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/",
};

authRouter.post("/login", loginLimiter, async (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }
  const ok = await verifyPassword(password);
  if (!ok) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = signToken();
  res.cookie(COOKIE, token, COOKIE_OPTS).json({ ok: true });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE, { path: "/" }).json({ ok: true });
});

authRouter.get("/me", (req, res) => {
  const token = req.cookies?.[COOKIE];
  if (token && verifyToken(token)) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});
