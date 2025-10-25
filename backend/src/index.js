// src/index.js
import { preflight, withCORS } from "./utils/cors.js";
import { requireAdmin } from "./utils/auth.js";

import { handleContent } from "./routes/content.js";
import { handleProducts } from "./routes/products.js";
import { handleNotices } from "./routes/notices.js";   // ★ 추가

export default {
  async fetch(request, env) {
    // CORS 프리플라이트
    const pf = preflight(request, "*");
    if (pf) return pf;

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 헬스체크
    if (path === "/" && method === "GET") {
      return withCORS(
        new Response(
          JSON.stringify({
            ok: true,
            routes: ["/api/content", "/api/products", "/api/notices"],
          }),
          { headers: { "Content-Type": "application/json" } }
        )
      );
    }

    // ---------- content_blocks ----------
    if (path === "/api/content" && method === "GET") {
      return withCORS(await handleContent(request, env));
    }
    if (path.startsWith("/api/content") && ["PUT", "PATCH", "DELETE"].includes(method)) {
      const auth = await requireAdmin(request, env);
      if (!auth.ok)
        return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
      return withCORS(await handleContent(request, env));
    }

    // ---------- products ----------
    // 공개: 리스트/상세
    if ((path === "/api/products" && method === "GET") ||
        (/^\/api\/products\/\d+$/.test(path) && method === "GET")) {
      return withCORS(await handleProducts(request, env));
    }
    // 관리자 보호: 생성/수정/삭제
    if (path.startsWith("/api/products") && ["POST", "PUT", "DELETE"].includes(method)) {
      const auth = await requireAdmin(request, env);
      if (!auth.ok)
        return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
      return withCORS(await handleProducts(request, env));
    }

    // ---------- notices ----------
    // 공개: 목록/상세
    if ((path === "/api/notices" && method === "GET") ||
        (/^\/api\/notices\/\d+$/.test(path) && method === "GET")) {
      return withCORS(await handleNotices(request, env));
    }
    // 관리자 보호: 생성/수정/삭제
    if (path.startsWith("/api/notices") && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const auth = await requireAdmin(request, env);
      if (!auth.ok)
        return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
      return withCORS(await handleNotices(request, env));
    }

    return withCORS(new Response("Not Found", { status: 404 }));
  },
};
