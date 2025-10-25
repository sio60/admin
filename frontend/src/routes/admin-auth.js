// 기본: 같은 도메인의 /api로 호출 (dev에서는 Vite proxy가 워커로 전달)
// 배포 시에는 .env의 VITE_API_BASE_URL로 덮어씀 (예: https://your-worker.workers.dev)
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const API = BASE || '' // ''이면 same-origin 사용

function url(p) { return `${API}${p}` }

export async function adminLogin(password) {
  try {
    const res = await fetch(url('/api/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json() // { token, role }
  } catch (e) {
    console.error('[adminLogin] API:', API || '(same-origin)', e)
    throw e
  }
}

export async function adminVerify(token) {
  if (!token) return false
  try {
    const res = await fetch(url('/api/admin/verify'), {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.ok
  } catch (e) {
    console.error('[adminVerify] fail', e)
    return false
  }
}

export async function getContent(key) {
  const u = new URL(url('/api/content'), window.location.origin)
  if (key) u.searchParams.set('key', key)
  const res = await fetch(BASE ? u.toString().replace(window.location.origin, BASE) : u.toString())
  if (!res.ok) throw new Error('load content failed')
  return res.json()
}

export async function upsertContent(token, { key, type='text', content={} }) {
  const res = await fetch(url('/api/content'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key, type, content }),
  })
  if (!res.ok) throw new Error('save failed')
  return res.json()
}
