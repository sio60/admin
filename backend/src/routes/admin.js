import { signJWT, verifyJWT } from "../utils/jwt.js"

export async function handleAdmin(request, env) {
  const url = new URL(request.url)

  // POST /api/admin/login  { password }
  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    const { password } = await request.json()
    if (!password || password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "INVALID_PASSWORD" }), { status: 401 })
    }
    const token = await signJWT({ role: "admin" }, env.JWT_SECRET, { expSeconds: 60 * 60 * 8 }) // 8h
    return new Response(JSON.stringify({ token, role: "admin" }), { status: 200, headers: { "Content-Type": "application/json" } })
  }

  // GET /api/admin/verify  (Authorization: Bearer <token>)
  if (url.pathname === "/api/admin/verify" && request.method === "GET") {
    const auth = request.headers.get("Authorization") || ""
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
    const payload = token ? await verifyJWT(token, env.JWT_SECRET) : null
    if (!payload || payload.role !== "admin") {
      return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { "Content-Type": "application/json" } })
    }
    return new Response(JSON.stringify({ ok: true, role: "admin" }), { status: 200, headers: { "Content-Type": "application/json" } })
  }

  return new Response("Not Found", { status: 404 })
}
