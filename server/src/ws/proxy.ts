import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { parse as parseCookie } from "cookie";
import { config } from "../config";
import { verifyToken } from "../auth/auth";

export function createWsProxy(server: http.Server): void {
  const wss = new WebSocketServer({ noServer: true });

  // Authenticate the WebSocket upgrade request via cookie
  server.on("upgrade", (req, socket, head) => {
    if (req.url !== "/ws") {
      socket.destroy();
      return;
    }
    const cookies = parseCookie(req.headers.cookie ?? "");
    const token = cookies["ha_session"];
    if (!token || !verifyToken(token)) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
  });

  wss.on("connection", (clientWs) => {
    const haWs = new WebSocket(
      `${config.haUrl.replace(/^http/, "ws")}/api/websocket`
    );

    haWs.on("message", (data) => {
      const msg = JSON.parse(data.toString()) as { type: string };
      if (msg.type === "auth_required") {
        haWs.send(JSON.stringify({ type: "auth", access_token: config.haToken }));
        return;
      }
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(data.toString());
      }
    });

    clientWs.on("message", (data) => {
      if (haWs.readyState === WebSocket.OPEN) haWs.send(data.toString());
    });

    clientWs.on("close", () => haWs.close());
    haWs.on("close", () => clientWs.close());
    haWs.on("error", (err) => {
      console.error("HA WebSocket error:", err.message);
      clientWs.close();
    });
  });
}
