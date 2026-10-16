export async function onRequestPost({ request, env }) {
  if (!env.VISITOR_LOG) {
    return new Response("Visitor logging is not configured yet.", { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  const ipAddress = request.headers.get("CF-Connecting-IP");
  if (!ipAddress) return new Response(null, { status: 204 });

  const payload = await request.json().catch(() => ({}));
  const pagePath = typeof payload.path === "string"
    ? payload.path.split(/[?#]/, 1)[0].slice(0, 300)
    : "/";

  await env.VISITOR_LOG.prepare(
    "INSERT INTO visits (ip_address, page_path) VALUES (?, ?)"
  ).bind(ipAddress, pagePath || "/").run();

  await env.VISITOR_LOG.prepare(
    "DELETE FROM visits WHERE julianday(visited_at) < julianday('now', '-30 days')"
  ).run();

  return new Response(null, { status: 204 });
}
