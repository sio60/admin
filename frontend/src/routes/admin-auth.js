import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import * as jose from 'jose'

export const adminAuth = new Hono()

// CORS (프런트 도메인으로 제한)
adminAuth.use('/*', async (c, next) => {
  const ORIGIN = c.req.header('Origin')
  const FRONT = 'https://your-frontend.example.com' // <- 여기에 프론트 배포 도메인
  if (ORIGIN === FRONT) {
    c.header('Access-Control-Allow-Origin', FRONT)
    c.header('Vary', 'Origin')
  }
  c.header('Access-Control-Allow-Credentials', 'true')
  c.header('Access-Control-Allow-Headers', 'content-type')
  c.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  if (c.req.method === 'OPTIONS') return c.body(null, 204)
  await next()
})

adminAuth.post('/auth/admin/login', async (c) => {
  const { password } = await c.req.json().catch(() => ({}))
  if (!password) return c.json({ ok:false, error:'missing' }, 400)
  if (password !== c.env.AUTH_ADMIN_PASSWORD) return c.json({ ok:false }, 401)

  const secret = new TextEncoder().encode(c.env.AUTH_SECRET)
  const token = await new jose.SignJWT({ role:'admin' })
    .setProtectedHeader({ alg:'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  // 프론트/백엔드 도메인이 다르면 SameSite=None 필요
  setCookie(c, 'admin_session', token, {
    httpOnly: true, secure: true, path: '/',
    sameSite: 'None',           // 같은 도메인이면 'Lax'도 OK
    maxAge: 60*60*24*7
  })
  return c.json({ ok:true })
})

adminAuth.get('/auth/admin/me', async (c) => {
  const token = getCookie(c, 'admin_session')
  if (!token) return c.json({ ok:true, admin:false })
  try {
    const secret = new TextEncoder().encode(c.env.AUTH_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return c.json({ ok:true, admin: payload.role === 'admin' })
  } catch {
    deleteCookie(c, 'admin_session', { path:'/' })
    return c.json({ ok:true, admin:false })
  }
})

adminAuth.post('/auth/admin/logout', async (c) => {
  deleteCookie(c, 'admin_session', { path:'/' })
  return c.json({ ok:true })
})
