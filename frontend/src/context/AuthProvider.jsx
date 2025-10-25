import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let ok = true
    ;(async () => {
      if (!user) { setProfile(null); setLoading(false); return }
      const { data } = await supabase.from('profiles').select('role, display_name').eq('id', user.id).maybeSingle()
      if (ok) { setProfile(data || null); setLoading(false) }
    })()
    return () => { ok = false }
  }, [user])

  const isAdmin = !!profile && ['admin','editor'].includes(profile.role)
  return <AuthCtx.Provider value={{ user, profile, isAdmin, loading }}>{children}</AuthCtx.Provider>
}
