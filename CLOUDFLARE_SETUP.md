# Deploy the portfolio and enable visitor IP logging

This portfolio is a static site. Cloudflare Pages can host it for free, and a Pages Function records each visit in a private D1 database. The log stores the visitor IP, page path, and visit time; records older than 30 days are removed when a new visit is logged.

## 1. Connect the existing GitHub repository

The portfolio is already in [Sahiti-web/sahiti-portfolio-](https://github.com/Sahiti-web/sahiti-portfolio-). In Cloudflare, connect this existing repository; do not create a second repository. The visitor logging code is in the `functions/api/visit.js` file and only records visits after the site is served over HTTPS with the database binding configured.

## 2. Create the Cloudflare Pages site

1. Create or sign in to a free Cloudflare account.
2. Open **Workers & Pages → Create application → Pages → Connect to Git** and select the GitHub repository.
3. Choose **None** for the framework preset. Leave the build command blank and set the build output directory to `.`.
4. Deploy the project. Pages Functions are deployed from the root `functions` folder when using Git integration.

## 3. Create and bind the database

1. In Cloudflare, open **Workers & Pages → D1 SQL Database → Create database** and name it `portfolio-visitor-log`.
2. Open its SQL console and run the contents of `schema.sql`.
3. Open the Pages project and go to **Settings → Bindings → Add → D1 database**.
4. Set the variable name to `VISITOR_LOG`, select `portfolio-visitor-log`, save, and redeploy.

## 4. View the visitor log

Open the D1 database SQL console and run:

```sql
SELECT visited_at, ip_address, page_path
FROM visits
ORDER BY visited_at DESC;
```

The database is not exposed through a public read endpoint; view it through the Cloudflare account that owns the project.

## Privacy disclosure

The site links to `privacy.html`, which explains that it records IP addresses, page paths, and timestamps for visitor insights. Keep the notice and retention period accurate if you change how the log works.

## Official Cloudflare guides

- [Connect a Git repository to Pages](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/)
- [Bind a D1 database to Pages Functions](https://developers.cloudflare.com/pages/functions/bindings/)
