import { preflight, withCORS } from "./utils/cors.js"
import { requireAdmin } from "./utils/auth.js"
import { handleContent } from "./routes/content.js"

export default {
  async fetch(request, env, ctx) {
    // Preflight
    const pf = preflight(request, "*")
    if (pf) return pf

    const url = new URL(request.url)
    try {
      // Public GET (읽기만 공개하고 싶다면 여기서 분기)
      if (url.pathname === "/api/content" && request.method === "GET") {
        const resp = await handleContent(request, env)
        return withCORS(resp)
      }

      // Admin-only (쓰기/삭제)
      if (url.pathname.startsWith("/api/content")) {
        const auth = await requireAdmin(request, env)
        if (!auth.ok) return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }))

        const resp = await handleContent(request, env)
        return withCORS(resp)
      }

      return withCORS(new Response("Not Found", { status: 404 }))
    } catch (e) {
      return withCORS(new Response(JSON.stringify({ error: e.message || "Server Error" }), { status: 500 }))
    }
  }
}
