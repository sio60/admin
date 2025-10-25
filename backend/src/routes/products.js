// Products REST (Supabase PostgREST 프록시)
// GET    /api/products?status=live|ended|for_sale|discontinued&page=1&page_size=12&order=asc
// GET    /api/products/:id
// POST   /api/products          (admin)
// PUT    /api/products/:id      (admin)
// DELETE /api/products/:id      (admin)

function jsonHeaders(status = 200) {
  return { status, headers: { "Content-Type": "application/json" } }
}

function mapStatusParam(raw) {
  if (!raw) return null
  const v = String(raw).toLowerCase()
  if (v === "live") return "for_sale"
  if (v === "ended") return "discontinued"
  if (v === "for_sale" || v === "discontinued") return v
  return null
}

export async function handleProducts(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  // ---------- LIST ----------
  if (request.method === "GET" && path === "/api/products") {
    const statusParam = mapStatusParam(url.searchParams.get("status"))
    const page   = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1)
    const size   = Math.min(Math.max(parseInt(url.searchParams.get("page_size") || "12", 10), 1), 50)
    const start  = (page - 1) * size
    const end    = start + size - 1
    const order  = (url.searchParams.get("order") || "asc").toLowerCase() === "desc" ? "desc" : "asc"

    const filters = []
    if (statusParam) filters.push(`status=eq.${encodeURIComponent(statusParam)}`)
    const q = filters.length ? `&${filters.join("&")}` : ""

    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/products?select=*&order=order_no.${order}${q}`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          "Range-Unit": "items",
          Range: `${start}-${end}`,
          Prefer: "count=exact"
        }
      }
    )

    const body = await res.text()
    const out = new Response(body, jsonHeaders(res.status))
    const cr = res.headers.get("Content-Range")
    if (cr) out.headers.set("Content-Range", cr)
    return out
  }

  // ---------- READ ONE ----------
  const m = path.match(/^\/api\/products\/(\d+)$/)
  if (request.method === "GET" && m) {
    const id = m[1]
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    })
    return new Response(await res.text(), jsonHeaders(res.status))
  }

  // ---------- CREATE (admin) ----------
  if (request.method === "POST" && path === "/api/products") {
    const body = await request.json()

    if (!body?.name) {
      return new Response(JSON.stringify({ error: "name is required" }), jsonHeaders(400))
    }
    if (body.status && !["for_sale","discontinued"].includes(body.status)) {
      return new Response(JSON.stringify({ error: "invalid status" }), jsonHeaders(400))
    }

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        name: body.name,
        sub_name: body.sub_name ?? null,
        description: body.description ?? null,
        thumb_url: body.thumb_url ?? null,
        image_urls: body.image_urls ?? [],
        ingredients: body.ingredients ?? null,
        price: body.price ?? null,
        status: body.status ?? "for_sale",
        discontinued_at: body.discontinued_at ?? null,
        order_no: body.order_no ?? 0,
        is_active: body.is_active ?? true
      })
    })
    return new Response(await res.text(), jsonHeaders(res.status))
  }

  // ---------- UPDATE (admin) ----------
  if (request.method === "PUT" && m) {
    const id = m[1]
    const body = await request.json()
    if (body.status && !["for_sale","discontinued"].includes(body.status)) {
      return new Response(JSON.stringify({ error: "invalid status" }), jsonHeaders(400))
    }

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(body)
    })
    return new Response(await res.text(), jsonHeaders(res.status))
  }

  // ---------- DELETE (admin) ----------
  if (request.method === "DELETE" && m) {
    const id = m[1]
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    })
    return new Response(null, { status: res.ok ? 204 : res.status })
  }

  return new Response("Not Found", { status: 404 })
}
