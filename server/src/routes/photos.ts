import { Router, Request, Response } from "express";
import { config } from "../config";

export const photosRouter = Router();

// List photos from HA /local/photos/index.json
photosRouter.get("/list", async (_req: Request, res: Response) => {
  try {
    const { default: fetch } = await import("node-fetch");
    const url = `${config.haUrl}/local/photos/index.json`;
    const haRes = await fetch(url, {
      headers: { Authorization: `Bearer ${config.haToken}` },
    });
    if (!haRes.ok) { res.status(404).json({ error: "index.json not found" }); return; }
    const data = await haRes.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "Could not reach Home Assistant" });
  }
});

// Proxy an ambiance image from HA /local/photos/ambiance/:filename
photosRouter.get("/ambiance/:filename", async (req: Request, res: Response) => {
  try {
    const { default: fetch } = await import("node-fetch");
    const filename = req.params["filename"] ?? "";
    const url = `${config.haUrl}/local/photos/ambiance/${encodeURIComponent(filename)}`;
    const haRes = await fetch(url, { headers: { Authorization: `Bearer ${config.haToken}` } });
    if (!haRes.ok) { res.status(404).send("Not found"); return; }
    res.setHeader("Content-Type", haRes.headers.get("content-type") ?? "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    haRes.body?.pipe(res);
  } catch (err) {
    res.status(502).send("Could not reach Home Assistant");
  }
});

// Proxy a photo file from HA /local/photos/:filename
photosRouter.get("/:filename", async (req: Request, res: Response) => {
  try {
    const { default: fetch } = await import("node-fetch");
    const filename = req.params["filename"] ?? "";
    const url = `${config.haUrl}/local/photos/${encodeURIComponent(filename)}`;
    const haRes = await fetch(url, {
      headers: { Authorization: `Bearer ${config.haToken}` },
    });
    if (!haRes.ok) { res.status(404).send("Not found"); return; }
    const contentType = haRes.headers.get("content-type") ?? "image/jpeg";
    res.setHeader("Content-Type", contentType);
    haRes.body?.pipe(res);
  } catch (err) {
    res.status(502).send("Could not reach Home Assistant");
  }
});
