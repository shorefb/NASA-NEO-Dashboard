import type { FastifyInstance } from "fastify";

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function registerNeoRoutes(app: FastifyInstance) {
  app.get(
    "/api/neo",
    {
      schema: {
        tags: ["neo"],
        querystring: {
          type: "object",
          properties: {
            date: { type: "string", format: "date" },
          },
          required: ["date"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              date: { type: "string", format: "date" },
              objects: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    sizeMeters: { type: "number" },
                    missDistanceKm: { type: "number" },
                    relativeVelocityKps: { type: "number" },
                  },
                  required: [
                    "id",
                    "name",
                    "sizeMeters",
                    "missDistanceKm",
                    "relativeVelocityKps",
                  ],
                },
              },
            },
            required: ["date", "objects"],
          },
        },
      },
    },
    async (req) => {
      const { date } = req.query as { date: string };
      const apiKey = "DEMO_KEY"; // Use DEMO_KEY to avoid rate limiting

      // Check cache first
      const cacheKey = `${date}-${apiKey}`;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      // Make NASA API request
      const url = new URL("https://api.nasa.gov/neo/rest/v1/feed");
      url.searchParams.set("start_date", date);
      url.searchParams.set("end_date", date);
      url.searchParams.set("api_key", apiKey);

      const headers = {
        "User-Agent": "NASA-Dashboard/1.0",
        Accept: "application/json",
      };

      try {
        const res = await fetch(url.toString(), { headers });

        if (!res.ok) {
          if (res.status === 429) {
            // Return sample data as fallback
            const sampleData = {
              date,
              objects: [
                {
                  id: "sample-1",
                  name: "(Sample Asteroid 1) - Rate Limited",
                  sizeMeters: 150,
                  missDistanceKm: 5000000,
                  relativeVelocityKps: 15.2,
                },
                {
                  id: "sample-2",
                  name: "(Sample Asteroid 2) - Rate Limited",
                  sizeMeters: 75,
                  missDistanceKm: 12000000,
                  relativeVelocityKps: 8.7,
                },
              ],
            };
            cache.set(cacheKey, { data: sampleData, timestamp: Date.now() });
            return sampleData;
          }
          if (res.status === 403) {
            throw new Error(
              "NASA API access denied. Please check your API key."
            );
          }
          throw new Error(`NASA API error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        const list = (data.near_earth_objects?.[date] ?? []).map((obj: any) => {
          const est = obj.estimated_diameter?.meters;
          const size = est
            ? (est.estimated_diameter_max + est.estimated_diameter_min) / 2
            : undefined;
          const approach = obj.close_approach_data?.[0];
          const missKm = approach
            ? Number(approach.miss_distance.kilometers)
            : undefined;
          const relVelKps = approach
            ? Number(approach.relative_velocity.kilometers_per_second)
            : undefined;
          return {
            id: String(obj.id),
            name: obj.name as string,
            sizeMeters: size ?? 0,
            missDistanceKm: missKm ?? Number.POSITIVE_INFINITY,
            relativeVelocityKps: relVelKps ?? 0,
          };
        });

        const result = { date, objects: list };
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      } catch (error) {
        // Return sample data on any error
        const sampleData = {
          date,
          objects: [
            {
              id: "sample-1",
              name: "(Sample Asteroid 1) - API Error",
              sizeMeters: 150,
              missDistanceKm: 5000000,
              relativeVelocityKps: 15.2,
            },
            {
              id: "sample-2",
              name: "(Sample Asteroid 2) - API Error",
              sizeMeters: 75,
              missDistanceKm: 12000000,
              relativeVelocityKps: 8.7,
            },
          ],
        };
        cache.set(cacheKey, { data: sampleData, timestamp: Date.now() });
        return sampleData;
      }
    }
  );
}
