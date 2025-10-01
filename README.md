# NASA NEO Dashboard

A full-stack TypeScript app that shows **Near-Earth Objects (NEOs)** for a selected date, with sortable fields for size, closest approach distance, and relative velocity. The app exposes a small REST API (documented with OpenAPI/Swagger UI) and a React frontend.

---

## 🚀 Quick Start

## 1️⃣ Clone & install

```bash
git clone https://github.com/shorefb/NASA-NEO-Dashboard.git
cd NASA-NEO-Dashboard

# frontend deps
npm install

# backend deps
cd server && npm install
```

## 2️⃣ Configure environment (optional but recommended)

The backend reads NASA_API_KEY from the environment; if not set, it falls back to NASA’s DEMO_KEY.
You can create a .env in server/ like this:

```
# from repo root
echo NASA_API_KEY=YOUR_KEY > server/.env
```

## 3️⃣ Run the backend (dev)
From the repo root, start the server in dev mode (TypeScript):
```
npm run server:dev
```
* OpenAPI/Swagger UI: http://localhost:4000/docs

## 4️⃣ Run the frontend (dev)
In a new terminal, from the repo root:
```
npm start
```
* App: http://localhost:3000
* The frontend proxies API calls to http://localhost:4000 via CRA’s "proxy" field, so you can call /api/... without CORS/setup in dev.

## 📁 Project Structure
```
NASA-NEO-Dashboard/
├─ public/                 # static assets for the React app
├─ src/                    # React + TypeScript frontend
├─ server/                 # Node/TypeScript REST API (OpenAPI docs at /docs)
├─ package.json            # frontend scripts, CRA proxy setup
├─ tsconfig*.json          # TypeScript configs
└─ README.md               # this file
```
Languages: TypeScript (primary), plus Tailwind for the frontend.

## ✨ Features

* Date-based NEO search via NASA’s NeoWs feed (per-date list of objects near Earth)

* Sortable table by:

  * Size (meters)

  * Closest approach / miss distance (km)

  * Relative velocity (km/s)

* OpenAPI docs served at /docs for quick exploration and testing

## 🛰️ API

Base URL (dev): `http://localhost:4000`

### `GET /api/neo?date=YYYY-MM-DD`

Returns a normalized list of NEOs for a calendar date, including:

- `name`
- `sizeMeters`
- `missDistanceKm`
- `relativeVelocityKps`

**Docs:** Interactive OpenAPI/Swagger UI at **`/docs`**.

> Data source: NASA **NeoWs (Near Earth Object Web Service)** “Feed” endpoint, which lists asteroids by closest-approach date; an API key is required (or `DEMO_KEY` with rate limits).

## 💻 Frontend (React + TypeScript)

- Development server runs at **[http://localhost:3000](http://localhost:3000)**
- Uses `package.json -> "proxy"` to forward unknown requests to the API at `http://localhost:4000` in development, simplifying local CORS and relative URL usage (e.g., `fetch('/api/neo?date=...')`).

---

## ⚙️ Configuration

### Environment variables (backend)

- `NASA_API_KEY` — Your NASA API key (recommended). If not provided, backend uses NASA’s `DEMO_KEY`.

Create `server/.env` for local dev:

```ini
NASA_API_KEY=YOUR_KEY
```

## 🧩 Scripts
From the repo root:

- `npm run server:dev` — Start the backend in watch/dev mode (Swagger UI at `/docs`)

- `npm start` — Start the React dev server (App at `:3000`)

Remember to install dependencies both at the root and inside `server/` before running.

## 🧠 Development Notes

* The app is organized as a minimal full-stack project: React frontend + small Node/TS API with OpenAPI docs for easy manual testing.

* CRA dev proxy allows relative calls (`/api/...`) without hardcoding the API origin or wrestling with CORS during development.

## 🧰 Troubleshooting

* 401/403 or rate limiting: Ensure `NASA_API_KEY` is set; `DEMO_KEY` has strict per-IP limits.

* `/docs` not reachable: Confirm the backend is running (`npm run server:dev`) and that you’re visiting http://localhost:4000/docs.

* Frontend not hitting API: Make sure you started the backend first; CRA’s `"proxy"` only applies in development and only for “unknown” paths.

## 🔭 Roadmap Ideas

* Date range support (NeoWs feed allows up to 7-day windows)

* Pagination & filters (PHA, magnitude, etc.)

* Column persistence and multi-sort

* Deployments (Dockerfile + CI; preview environments)

* Unit tests for API shaping and table sorting

* A map or orbit chart to visualize positions in 2D/3D

* Alerts or thresholds so users get notified when objects cross a danger distance

## 🙌 Acknowledgements

* NASA Open APIs — Near-Earth Object Web Service (NeoWs)

* Create React App — For frontend bootstrapping and dev proxy
