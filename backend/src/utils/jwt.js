// HMAC-SHA256 JWT (no deps)
function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}
async function hmacSign(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  )
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
}

export async function signJWT(payload, secret, { expSeconds = 3600 } = {}) {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now()/1000)
  const body = { iat: now, exp: now + expSeconds, ...payload }
  const p1 = base64url(new TextEncoder().encode(JSON.stringify(header)))
  const p2 = base64url(new TextEncoder().encode(JSON.stringify(body)))
  const unsigned = `${p1}.${p2}`
  const sig = base64url(await hmacSign(secret, unsigned))
  return `${unsigned}.${sig}`
}

export async function verifyJWT(token, secret) {
  const [h, p, s] = token.split(".")
  if (!h || !p || !s) return null
  const sig = base64url(await hmacSign(secret, `${h}.${p}`))
  if (sig !== s) return null
  const json = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(p.replace(/-/g, "+").replace(/_/g, "/")), c=>c.charCodeAt(0))))
  if (json.exp && Math.floor(Date.now()/1000) > json.exp) return null
  return json
}
