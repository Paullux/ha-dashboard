# Naive Home Dashboard

A clean, real-time replacement dashboard for Home Assistant — built with React, running in Docker.

![Dashboard screenshot](docs/screenshot-home.png)

## Features

- **Real-time** — WebSocket connection to HA, no polling
- **Room cards** with SVG illustrations that react to state (light on/off, heating, AC, day/night)
- **Screensaver** — photo frame with clock, indoor/outdoor temps, and ambient room photo after 30s idle
- **Smart summary bar** — animated icons (spinning fan, flickering flame, glowing bulb) reflecting actual state
- **Climate detail** — radiator modes (Hors-Gel / Éco / Confort / Boost) and AC modes with setpoint
- **Ambiance background** — real room photos with CSS weather filters and lamp halos
- **Dark/light theme** auto-detected from system preference
- **PWA** — installable on mobile and desktop
- **Secure** — HA token stays server-side, never exposed to the browser

## Architecture

```
HA instance  ←→  server (Node.js proxy)  ←→  client (React SPA)
              HA token auth, REST+WS          No direct HA access
```

Two Docker containers:
- **server** — proxies HA REST API and WebSocket, holds the HA token
- **client** — Vite + React SPA served by nginx

## Quick Start

### 1. Clone

```bash
git clone https://github.com/Paullux/ha-dashboard.git
cd ha-dashboard
```

### 2. Configure

Create a `.env` file at the root (never committed):

```env
HA_URL=http://192.168.1.x:8123
HA_TOKEN=your_long_lived_access_token
VITE_API_URL=http://your-server-ip:3001
AUTH_PASSWORD_HASH=your_bcrypt_hash
```

Generate a bcrypt hash for your dashboard password:
```bash
node -e "const b=require('bcryptjs');b.hash('yourpassword',10).then(console.log)"
```

### 3. Start

```bash
docker compose up --build
```

Open `http://your-server-ip:5173` in your browser.

## Configuration

Edit [`client/src/config/dashboard.ts`](client/src/config/dashboard.ts) to map your HA entities to rooms and devices.

```ts
export const ROOMS: RoomConfig[] = [
  {
    id: "sejour",
    label: "Séjour",
    tempEntity: "climate.climatisation",
    lightEntity: "light.lumieres_sejour",
    devices: [
      { label: "Lumières", entity: "light.lumieres_sejour", type: "light" },
      { label: "Climatisation", entity: "climate.climatisation", type: "climate" },
    ],
  },
  // ...
];
```

## Custom Repository (HACS)

In HACS → ⋯ → Custom repositories, add:

```
https://github.com/Paullux/ha-dashboard
```

Category: **Integration**

Note: HACS won't auto-install this project (it's a Docker app, not a Python integration). Adding it as a custom repo gives you update notifications when new versions are released.

## Requirements

- Docker + Docker Compose
- Home Assistant 2024.1+
- A long-lived access token from HA (Profile → Security → Long-lived access tokens)

## Tech Stack

- **Client**: Vite, React, TypeScript
- **Server**: Node.js, Express, TypeScript
- **Realtime**: WebSocket (HA native protocol)
- **Auth**: JWT in HttpOnly cookie
- **Deploy**: Docker Compose, GitHub Actions → ghcr.io

## License

MIT
