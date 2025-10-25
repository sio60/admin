// /api/content: content_blocks 테이블을 REST로 얇게 프록시
// GET  /api/content?key=hero.title
// PUT  /api/content  body: { key, type, content }

export async function handleContent(request, env) {
  const url = new URL(request.url)

  if (request.method === "GET") {
    const key = url.searchParams.get("key")
    const qp = key ? `?key=eq.${encodeURIComponent(key)}` : ""
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/content_blocks${qp}`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        Prefer: "return=representation"
      }
    })
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } })
  }

  if (request.method === "PUT" || request.method === "PATCH") {
    const body = await request.json()
    // upsert
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/content_blocks`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify({
        key: body.key,
        type: body.type ?? "text",
        content: body.content ?? {}
      })
    })
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } })
  }

  if (request.method === "DELETE") {
    const key = url.searchParams.get("key")
    if (!key) return new Response(JSON.stringify({ error: "key required" }), { status: 400 })
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/content_blocks?key=eq.${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    })
    return new Response(null, { status: res.ok ? 204 : res.status })
  }

  return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 })
}
