# Deploy the portfolio on Render

This version serves the portfolio and records visits through the same Render service. It uses Neon Postgres for the log so records are kept outside Render's temporary service filesystem.

## 1. Create the visitor database

1. Create a free Postgres project at [Neon](https://neon.tech/).
2. In the Neon SQL Editor, run the contents of `schema-postgres.sql` from this repository.
3. Copy the database connection string from Neon. Keep it private; it is a password.

## 2. Create the Render service

1. In Render, choose **New + → Web Service** and connect `Sahiti-web/sahiti-portfolio-`.
2. Select the `codex/ip-visitor-logging` branch to deploy this setup without changing `main`.
3. Set **Runtime** to `Node`, **Build Command** to `npm install`, and **Start Command** to `npm start`.
4. Choose the **Free** instance.
5. Add an environment variable named `DATABASE_URL` and paste the Neon connection string as its value.
6. Create the service and wait for the deployment to finish. Render provides the public URL on the service page.

## 3. Check that logging works

Open the Render URL and visit a few pages. In Neon, run:

```sql
SELECT id, ip_address, page_path, visited_at
FROM visits
ORDER BY visited_at DESC
LIMIT 50;
```

The app removes records older than 30 days when it receives a visit. Visitor IPs are personal data; the portfolio's privacy page describes this logging.

## Notes

- The Render web service may sleep after a period without requests on the free plan; the first visit after sleep can take a little longer.
- Keep `DATABASE_URL` in Render's environment settings only. Do not add the connection string to the repository.
- The existing Cloudflare Pages function and D1 schema are left in place. You can use them again if you switch hosting back.
