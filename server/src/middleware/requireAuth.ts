import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.["ha_session"];
  if (token && verifyToken(token)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}
