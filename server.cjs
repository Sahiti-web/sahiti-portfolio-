const express = require("express");
const path = require("node:path");
const net = require("node:net");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const blockedFiles = new Set([
  "CLOUDFLARE_SETUP.md",
  "RENDER_DEPLOY.md",
  "package.json",
  "package-lock.json",
  "schema.sql",
  "schema-postgres.sql",
  "server.cjs",
  "generate_assets.py"
]);

app.disable("x-powered-by");
// Render sits behind one trusted proxy and forwards the visitor address in X-Forwarded-For.
app.set("trust proxy", 1);

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false }
    })
  : null;

app.get("/healthz", (_request, response) => response.status(200).send("ok"));

app.post("/api/visit", express.json({ limit: "2kb" }), async (request, response) => {
  if (!pool) return response.status(503).send("Visitor logging is not configured.");

  const origin = request.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.get("host")) {
        return response.sendStatus(403);
      }
    } catch {
      return response.sendStatus(403);
    }
  }

  const forwardedFor = request.get("x-forwarded-for") || "";
  const forwardedAddress = forwardedFor.split(",")[0].trim();
  const ipAddress = net.isIP(forwardedAddress)
    ? forwardedAddress
    : (net.isIP(request.ip || "") ? request.ip : "");
  if (!ipAddress) return response.sendStatus(204);

  let pagePath = "/";
  if (typeof request.body?.path === "string") {
    try {
      pagePath = new URL(request.body.path, "https://portfolio.invalid").pathname.slice(0, 300) || "/";
    } catch {
      pagePath = "/";
    }
  }

  try {
    await pool.query(
      "INSERT INTO visits (ip_address, page_path, visited_at) VALUES ($1, $2, NOW())",
      [ipAddress, pagePath]
    );
    await pool.query("DELETE FROM visits WHERE visited_at < NOW() - INTERVAL '30 days'");
    return response.sendStatus(204);
  } catch (error) {
    console.error("Visitor log write failed:", error.message);
    return response.status(503).send("Visitor logging is temporarily unavailable.");
  }
});

app.use((request, response, next) => {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(request.path);
  } catch {
    return response.sendStatus(400);
  }
  const fileName = path.basename(requestedPath);
  if (requestedPath.startsWith("/functions/") || blockedFiles.has(fileName)) {
    return response.sendStatus(404);
  }
  next();
});

app.use(express.static(root, {
  dotfiles: "deny",
  extensions: ["html"],
  index: "index.html",
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.use((_request, response) => response.sendFile(path.join(root, "index.html")));

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio server listening on ${port}`);
  if (!pool) {
    console.warn("⚠️  DATABASE_URL is not set. Visitor logging is disabled.");
  } else {
    pool.query("SELECT 1")
      .then(() => console.log("✅ Successfully connected to PostgreSQL / Supabase database."))
      .catch((err) => console.error("❌ Database connection failed on startup:", err.message));
  }
});

async function shutdown() {
  server.close(async () => {
    if (pool) await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
