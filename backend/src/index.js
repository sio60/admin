import { preflight, withCORS } from "./utils/cors.js"
import { requireAdmin } from "./utils/auth.js"
import { handleContent } from "./routes/content.js"
import { handleProducts } from "./routes/products.js"
// (admin, notices 등 다른 라우트가 있다면 그대로 유지)

export default {
  async fetch(request, env) {
    const pf = preflight(request, "*"); if (pf) return pf
    const url = new URL(request.url)

    // 헬스
    if (url.pathname === "/" && request.method === "GET") {
      return withCORS(new Response(JSON.stringify({ ok: true, routes: ["/api/content","/api/products"] }), {
        headers: { "Content-Type":"application/json" }
      }))
    }

    // ---------- content_blocks (공개 GET / 관리자 PUT/DELETE) ----------
    if (url.pathname === "/api/content" && request.method === "GET") {
      return withCORS(await handleContent(request, env))
    }
    if (url.pathname.startsWith("/api/content") && ["PUT","PATCH","DELETE"].includes(request.method)) {
      const auth = await requireAdmin(request, env)
      if (!auth.ok) return withCORS(new Response(JSON.stringify({ error:"Unauthorized" }), { status: 401 }))
      return withCORS(await handleContent(request, env))
    }

    // ---------- products ----------
    // 공개: 리스트/상세
    if (url.pathname === "/api/products" && request.method === "GET") {
      return withCORS(await handleProducts(request, env))
    }
    if (/^\/api\/products\/\d+$/.test(url.pathname) && request.method === "GET") {
      return withCORS(await handleProducts(request, env))
    }
    // 관리자 보호: 생성/수정/삭제
    if (url.pathname.startsWith("/api/products") && ["POST","PUT","DELETE"].includes(request.method)) {
      const auth = await requireAdmin(request, env)
      if (!auth.ok) return withCORS(new Response(JSON.stringify({ error:"Unauthorized" }), { status: 401 }))
      return withCORS(await handleProducts(request, env))
    }

    return withCORS(new Response("Not Found", { status: 404 }))
  }
}
