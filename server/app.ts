import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses/expenses";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Added logger middleware to the app
app.use("*", logger());
app.use("/api/*", cors());

const ApiRoutes = app.basePath("/api").route("/expenses", expensesRoute);

app.use("*", serveStatic({ root: "../frontend/dist" }));
app.get("*", serveStatic({ path: "../frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof ApiRoutes;
