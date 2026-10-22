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

function createPostgresPool() {
  let raw = (process.env.DATABASE_URL || "").trim();
  if (!raw) return null;

  // Strip accidental prefixes or enclosing quotes
  raw = raw.replace(/^DATABASE_URL\s*=\s*/i, "");
  raw = raw.replace(/^psql\s+/i, "");
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1).trim();
  }

  // Parse URI components directly to avoid ERR_INVALID_URL caused by special characters in passwords
  const regex = /^postgres(?:ql)?:\/\/([^:]+):(.*)@([^:\/@]+)(?::(\d+))?\/([^?]+)(?:\?.*)?$/;
  const match = raw.match(regex);

  if (match) {
    let [_, user, password, host, port, database] = match;
    if (password.startsWith("[") && password.endsWith("]")) {
      password = password.slice(1, -1);
    }
    return new Pool({
      user: decodeURIComponent(user),
      password: decodeURIComponent(password),
      host,
      port: Number(port) || 5432,
      database,
      ssl: host.includes("localhost") ? false : { rejectUnauthorized: false }
    });
  }

  // Fallback if already structured or non-standard URI
  return new Pool({
    connectionString: raw,
    ssl: raw.includes("localhost") ? false : { rejectUnauthorized: false }
  });
}

const pool = createPostgresPool();

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

// ── Admin: view visitor log (password-protected) ──────────────────────────
app.get("/api/admin/visits", async (request, response) => {
  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
  if (!adminPassword) {
    return response.status(503).json({ error: "Admin access is not configured on this server." });
  }
  const provided = (request.get("x-admin-password") || "").trim();
  if (!provided || provided !== adminPassword) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  if (!pool) {
    return response.status(503).json({ error: "Database is not configured." });
  }
  try {
    const result = await pool.query(
      "SELECT ip_address, page_path, visited_at FROM visits ORDER BY visited_at DESC LIMIT 5000"
    );
    return response.json({ visits: result.rows });
  } catch (error) {
    console.error("Admin visits query failed:", error.message);
    return response.status(503).json({ error: "Database query failed." });
  }
});

app.post(
  "/api/contact",
  express.json({ limit: "10kb" }),
  express.urlencoded({ extended: true, limit: "10kb" }),
  async (request, response) => {
    const { name, email, message } = request.body || {};
    const isJson = request.headers.accept?.includes("application/json") || request.is("json");

    if (!name || !email || !message) {
      if (isJson) {
        return response.status(400).json({ success: false, error: "Missing required fields" });
      }
      return response.redirect("/contact.html?error=missing_fields");
    }

    if (pool) {
      try {
        await pool.query(
          "CREATE TABLE IF NOT EXISTS messages (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)"
        );
        await pool.query(
          "INSERT INTO messages (name, email, message, created_at) VALUES ($1, $2, $3, NOW())",
          [String(name).slice(0, 150), String(email).slice(0, 150), String(message).slice(0, 4000)]
        );
      } catch (error) {
        console.error("Message backup write failed:", error.message);
      }
    }

    if (isJson) {
      return response.status(200).json({ success: true, message: "Message received successfully." });
    }
    return response.redirect("/contact.html?sent=true");
  }
);

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
    try {
      pool.query("SELECT 1")
        .then(() => console.log("✅ Successfully connected to PostgreSQL / Supabase database."))
        .catch((err) => console.error("❌ Database connection failed on startup:", err.message));
    } catch (err) {
      console.error("❌ DATABASE_URL format is invalid:", err.message);
    }
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
