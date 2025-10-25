// src/routes/notices.js

// (선택) 이미 쓰던 관리자 인증 유틸이 있으면 그걸 import 해서 쓰세요.
// 여기서는 간단히 ADMIN_PASSWORD 헤더 체크(또는 Bearer)로 예시.
async function requireAdmin(request, env) {
  const h = request.headers.get("Authorization") || "";
  const pass = request.headers.get("x-admin-password") || "";
  const ok = h === `Bearer ${env.ADMIN_PASSWORD}` || pass === env.ADMIN_PASSWORD;
  if (!ok) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
}

export async function handleNotices(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // ===== 목록 GET /api/notices =====
  if (request.method === "GET" && path === "/api/notices") {
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const size = Math.min(parseInt(url.searchParams.get("page_size") || "10", 10), 50);
    const start = (page - 1) * size;
    const end = start + size - 1;

    const sort = (url.searchParams.get("sort") || "newest").toLowerCase();
    // newest | viewed | updated | best
    let order;
    switch (sort) {
      case "viewed":  order = "views.desc";        break;
      case "updated": order = "updated_at.desc";   break;
      case "best":    order = "likes.desc";        break;
      default:        order = "published_at.desc"; break;
    }

    // 검색: q=, target=title|content|author|all
    const q = url.searchParams.get("q");
    const target = (url.searchParams.get("target") || "all").toLowerCase();
    const filters = [];
    if (q) {
      const like = `*${q.replace(/\*/g, "")}*`;
      if (target === "title") {
        filters.push(`title=ilike.${encodeURIComponent(like)}`);
      } else if (target === "content") {
        filters.push(`content_html=ilike.${encodeURIComponent(like)}`);
      } else if (target === "author") {
        filters.push(`author=ilike.${encodeURIComponent(like)}`);
      } else {
        // or= 로 묶기
        filters.push(
          `or=(title.ilike.${encodeURIComponent(like)},content_html.ilike.${encodeURIComponent(like)},author.ilike.${encodeURIComponent(like)})`
        );
      }
    }

    const qs = filters.length ? `&${filters.join("&")}` : "";
    const endpoint = `${env.SUPABASE_URL}/rest/v1/notice_posts?select=*&order=${order}${qs}`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        Prefer: "count=exact",
        Range: `${start}-${end}`
      }
    });

    const text = await res.text();
    const items = text ? JSON.parse(text) : [];
    // total 파싱
    const cr = res.headers.get("content-range"); // e.g. items 0-9/123
    let total = 0;
    if (cr) {
      const m = cr.match(/\/(\d+)$/);
      if (m) total = parseInt(m[1], 10);
    }

    return new Response(JSON.stringify({ items, total, page, page_size: size }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // ===== 상세 GET /api/notices/:id =====
  const m = path.match(/^\/api\/notices\/(\d+)$/);
  if (request.method === "GET" && m) {
    const id = m[1];
    const withInc = url.searchParams.get("inc") === "1";

    let row;

    if (withInc) {
      // RPC로 조회수 +1 후 row 반환
      const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/notice_inc_view`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({ p_id: Number(id) })
      });
      if (r.ok) {
        const arr = JSON.parse(await r.text());
        row = arr;
      }
    }
    if (!row) {
      const r = await fetch(`${env.SUPABASE_URL}/rest/v1/notice_posts?id=eq.${id}&select=*`, {
        headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` }
      });
      const arr = JSON.parse(await r.text());
      row = arr && arr[0];
    }

    if (!row) return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });

    return new Response(JSON.stringify(row), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  // ===== 생성 POST /api/notices (관리자) =====
  if (request.method === "POST" && path === "/api/notices") {
    await requireAdmin(request, env);
    const body = await request.json();

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/notice_posts`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        title: body.title,
        author: body.author || "Zestco",
        content_html: body.content_html || "",
        published_at: body.published_at || new Date().toISOString()
      })
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  }

  // ===== 수정 PUT /api/notices/:id (관리자) =====
  if ((request.method === "PUT" || request.method === "PATCH") && m) {
    await requireAdmin(request, env);
    const id = m[1];
    const body = await request.json();

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/notice_posts?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        title: body.title,
        author: body.author,
        content_html: body.content_html,
        published_at: body.published_at
      })
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  }

  // ===== 삭제 DELETE /api/notices/:id (관리자) =====
  if (request.method === "DELETE" && m) {
    await requireAdmin(request, env);
    const id = m[1];

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/notice_posts?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    });
    return new Response(null, { status: res.ok ? 204 : res.status });
  }

  return new Response("Not Found", { status: 404 });
}
