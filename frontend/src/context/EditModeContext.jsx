import React, { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthProvider'
import { useServerAdmin } from './ServerAdminProvider'

const EditCtx = createContext(null)
export const useEditMode = () => useContext(EditCtx)

export function EditModeProvider({ children }) {
  const { isAdmin: supaAdmin } = useAuth()
  const { admin: serverAdmin } = useServerAdmin()
  const can = supaAdmin || serverAdmin
  const [on, setOn] = useState(false)
  return (
    <EditCtx.Provider value={{ on: on && can, toggle: () => setOn(v=>!v), canEdit: can }}>
      {children}
    </EditCtx.Provider>
  )
}
