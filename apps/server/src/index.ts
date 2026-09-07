import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter, createContext } from "@lean-divida/api";

const PORT = Number(process.env.PORT ?? 3000);
const app = express();

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[trpc] ${path}:`, error.cause ?? error);
      }
    }
  }),
);

// In prod, serve the built SPA from the same origin. In dev, Vite serves it
// on :5173 and proxies /trpc here, so this block is inert.
if (process.env.NODE_ENV === "production") {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const webDist = path.resolve(here, "../../web/dist");
  app.use(express.static(webDist));
  app.get("*", (_req, res) => res.sendFile(path.join(webDist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
