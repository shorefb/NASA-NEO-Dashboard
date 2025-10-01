import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { registerNeoRoutes } from "./routes/neo.ts";

const app = Fastify({
  logger: true,
});

// CORS
await app.register(cors, {
  origin: true,
});

// Swagger / OpenAPI
await app.register(swagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "NASA Dashboard API",
      description: "Backend API for NASA Near Earth Objects dashboard",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:4000", description: "Local" }],
    tags: [
      { name: "health", description: "Service health" },
      { name: "neo", description: "Near Earth Objects" },
    ],
    components: {
      schemas: {},
    },
  },
});

await app.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
  staticCSP: true,
});

// Health endpoint
app.get(
  "/health",
  {
    schema: {
      tags: ["health"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            uptime: { type: "number" },
          },
        },
      },
    },
  },
  async () => {
    return { status: "ok", uptime: process.uptime() };
  }
);

// API routes
await registerNeoRoutes(app);

const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";

app
  .listen({ port, host })
  .then(() => {
    app.log.info(`Server listening on http://${host}:${port}`);
    app.log.info(`Swagger UI available at http://${host}:${port}/docs`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
