import { Router, Request, Response } from "express";
import { config } from "../config";

export const haRouter = Router();

// Forward any GET/POST to the HA REST API
// e.g. GET /api/ha/states  →  GET http://ha:8123/api/states
haRouter.all("/*", async (req: Request, res: Response) => {
  const path = req.params[0] ?? "";
  const url = `${config.haUrl}/api/${path}`;

  try {
    const { default: fetch } = await import("node-fetch");

    const haRes = await fetch(url, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${config.haToken}`,
        "Content-Type": "application/json",
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await haRes.json();
    res.status(haRes.status).json(data);
  } catch (err) {
    console.error("HA proxy error:", err);
    res.status(502).json({ error: "Could not reach Home Assistant" });
  }
});
