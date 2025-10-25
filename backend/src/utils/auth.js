import { verifyJWT } from "./../utils/jwt.js"

export async function requireAdmin(request, env) {
  const auth = request.headers.get("Authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token) return { ok: false }

  const payload = await verifyJWT(token, env.JWT_SECRET)
  if (!payload || payload.role !== "admin") return { ok: false }
  return { ok: true, user: { role: "admin" } }
}
