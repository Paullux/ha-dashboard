# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web dashboard for Home Assistant (HA) — a dynamic, real-time UI that replaces the default HA frontend. Two Docker containers communicate with each other: the server proxies all HA API calls, and the client renders the UI.

## Architecture

```
webUI HA/
├── client/          # Vite + React + TypeScript SPA
├── server/          # Node.js + Express + TypeScript (HA proxy)
├── docker-compose.yml
└── CLAUDE.md
```

### Client (`client/`)
- **Vite + React + TypeScript** SPA
- Connects to the server via REST and WebSocket (never directly to HA)
- Real-time updates via WebSocket (entity state changes streamed from server)
- No SSR — fully client-side

### Server (`server/`)
- **Node.js + Express + TypeScript**
- Proxies HA REST API (`/api/*` → `http://homeassistant:8123/api/*`)
- Proxies HA WebSocket (`ws://homeassistant:8123/api/websocket`) for live state
- Holds the HA long-lived access token (never exposed to the client)
- Exposes its own REST and WebSocket endpoints to the client

### Data flow
```
HA instance  ←→  server container  ←→  client container (browser)
              (token auth, proxy)    (no direct HA access)
```

## Docker

```bash
# Start both containers
docker compose up --build

# Rebuild a single service
docker compose up --build client
docker compose up --build server

# Logs
docker compose logs -f server
docker compose logs -f client
```

Environment variables (`.env` at root, loaded by Docker Compose):
- `HA_URL` — Home Assistant base URL (e.g. `http://192.168.1.x:8123`)
- `HA_TOKEN` — Long-lived access token from HA
- `VITE_API_URL` — URL the browser uses to reach the server (e.g. `http://localhost:3001`)

## Development (without Docker)

```bash
# Server
cd server
npm install
npm run dev        # ts-node-dev with hot reload, port 3001

# Client (separate terminal)
cd client
npm install
npm run dev        # Vite dev server, port 5173

# Type checking
npm run typecheck  # in either client/ or server/

# Lint
npm run lint       # ESLint in either package
```

## Key Conventions

- **Server never trusts the client** — HA token stays server-side only
- **WebSocket events** from HA are forwarded as-is to subscribed clients; no transformation unless necessary
- **Entity state** is the source of truth from HA; the UI subscribes to state changes, never polls
- **TypeScript strict mode** is enabled in both packages
- Shared types between client and server live in `server/src/types/` and are imported by the client via path alias or a shared `types/` package at root level
