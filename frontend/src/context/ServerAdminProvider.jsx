import React, { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)
export const useServerAdmin = () => useContext(Ctx)

export function ServerAdminProvider({ children }) {
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/auth/admin/me`, {
        credentials: 'include'
      })
      const j = await res.json()
      setAdmin(!!j.admin)
    } finally { setLoading(false) }
  }
  useEffect(()=>{ refresh() }, [])

  async function login(password) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/auth/admin/login`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      credentials:'include',
      body: JSON.stringify({ password })
    })
    const j = await res.json()
    if (j.ok) { await refresh(); return true }
    return false
  }

  async function logout() {
    await fetch(`${import.meta.env.VITE_API_BASE || ''}/auth/admin/logout`, {
      method:'POST', credentials:'include'
    })
    setAdmin(false)
  }

  return <Ctx.Provider value={{ admin, loading, login, logout }}>{children}</Ctx.Provider>
}
