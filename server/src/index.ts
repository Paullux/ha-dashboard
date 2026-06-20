import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { haRouter } from "./routes/ha";
import { authRouter } from "./routes/auth";
import { requireAuth } from "./middleware/requireAuth";
import { createWsProxy } from "./ws/proxy";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use("/auth", authRouter);
app.get("/health", (_req, res) => res.json({ ok: true }));

// Protected routes
app.use("/api/ha", requireAuth, haRouter);

const server = http.createServer(app);
createWsProxy(server);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Proxying HA at ${config.haUrl}`);
});
