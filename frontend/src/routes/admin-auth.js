// src/routes/admin-auth.js
const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8787"

export async function adminLogin(password) {
  const res = await fetch(`${API}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })
  if (!res.ok) return null
  return res.json() // { token, role }
}

export async function adminVerify(token) {
  if (!token) return false
  try {
    const res = await fetch(`${API}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.ok
  } catch {
    return false
  }
}

export async function getContent(key) {
  const url = new URL(`${API}/api/content`)
  if (key) url.searchParams.set("key", key)
  const res = await fetch(url.toString(), { method: "GET" })
  if (!res.ok) throw new Error("failed to load content")
  return res.json() // { items: [...] } or { key, ... }
}

export async function upsertContent(token, { key, type = "text", content = {} }) {
  const res = await fetch(`${API}/api/content`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ key, type, content })
  })
  if (!res.ok) throw new Error("failed to save")
  return res.json()
}
