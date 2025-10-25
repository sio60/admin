import { preflight, withCORS } from "./utils/cors.js"
import { requireAdmin } from "./utils/auth.js"
import { handleContent } from "./routes/content.js"
import { handleAdmin } from "./routes/admin.js"

export default {
  async fetch(request, env) {
    const pf = preflight(request, "*"); if (pf) return pf
    const url = new URL(request.url)

    // health
    if (url.pathname === "/" && request.method === "GET") {
      return withCORS(new Response(JSON.stringify({ ok: true, routes: ["/api/admin/*", "/api/content"] }), { headers: { "Content-Type":"application/json" }}))
    }

    // admin login/verify
    if (url.pathname.startsWith("/api/admin")) {
      const resp = await handleAdmin(request, env)
      return withCORS(resp)
    }

    // public read
    if (url.pathname === "/api/content" && request.method === "GET") {
      return withCORS(await handleContent(request, env))
    }

    // write/delete (admin)
    if (url.pathname.startsWith("/api/content")) {
      const auth = await requireAdmin(request, env)
      if (!auth.ok) return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }))
      return withCORS(await handleContent(request, env))
    }

    return withCORS(new Response("Not Found", { status: 404 }))
  }
}
