# NASA Dashboard

## Quick start

1. Install deps

npm install
cd server && npm install

```

2. Backend

# from repo root
npm run server:dev
# Swagger UI: http://localhost:4000/docs
```

3. Frontend

npm start

# App: http://localhost:3000

```

The frontend proxies API calls to `http://localhost:4000` via CRA `proxy` field.

## Environment

Backend uses `NASA_API_KEY` from environment, falling back to `DEMO_KEY`.


# optional .env in server/
echo NASA_API_KEY=YOUR_KEY > server/.env
```

## API

- GET `/api/neo?date=YYYY-MM-DD` — returns name, sizeMeters, missDistanceKm, relativeVelocityKps
- OpenAPI docs at `/docs`

## Notes

- Sorting by Size, Closeness, and Relative Velocity in the UI.
