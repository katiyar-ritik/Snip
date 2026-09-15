# Snip — Full-Stack URL Shortener

A URL shortener with custom aliases, click analytics, and on-the-fly QR codes. React (Vite) frontend, Express REST API, SQLite storage.

## Stack

- **Frontend:** React + Vite (SPA)
- **Backend:** Node.js + Express
- **Database:** SQLite via `better-sqlite3` (two normalised tables: `links`, `clicks`, with a foreign key + index)
- **Extras:** `nanoid` short codes, `qrcode` PNG generation, `express-rate-limit` on link creation, Docker multi-stage build, GitHub Actions CI/CD

## Project layout

```
backend/    Express REST API + SQLite database
frontend/   React (Vite) single-page app
Dockerfile  Multi-stage build: frontend build -> backend deps -> runtime image
```

## Running locally (dev)

Two terminals:

```bash
# Terminal 1 — API on :3000
cd backend
npm install
npm run dev

# Terminal 2 — frontend on :5173 (proxies /api to :3000)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Running with Docker

```bash
docker compose up --build
```

Open http://localhost:3000 — the Express server serves the built frontend and the API from the same origin, backed by a named volume (`snip-data`) so the SQLite file persists across restarts.

## API

| Method | Path                       | Description                              |
|--------|----------------------------|-------------------------------------------|
| POST   | `/api/links`                | Create a short link (`{ url, alias? }`)  |
| GET    | `/:code`                    | Redirect to the original URL, logs a click |
| GET    | `/api/links/:code/stats`    | Total clicks + recent click history       |
| GET    | `/api/links/:code/qrcode`   | QR code PNG pointing at the short link    |
| GET    | `/health`                   | Health check                              |

Validation: URLs must be valid `http(s)`, custom aliases must be 3–32 chars (letters/numbers/`-`/`_`), collisions and reserved words (`api`, `admin`, `health`, ...) are rejected. Link creation is rate-limited to 30 requests per 15 minutes per IP.

## CI/CD

`.github/workflows/docker-publish.yml` builds the Docker image and pushes it to Docker Hub on every push to `main`. Set these repo secrets first:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (a Docker Hub access token, not your password)

## Notes

- Created links are remembered client-side in `localStorage` — no accounts needed.
- `DATA_DIR` (default `./data` in dev, `/app/data` in the Docker image) controls where the SQLite file is written.
