import React, { useState } from 'react'
import { useServerAdmin } from '../context/ServerAdminProvider'

export default function AdminLoginButton() {
  const { admin, login, logout } = useServerAdmin()
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState('')

  if (admin) {
    return <button onClick={logout}>관리자 로그아웃</button>
  }
  return (
    <>
      <button onClick={() => setOpen(true)}>관리자</button>
      {open && (
        <div className="card" style={{position:'fixed', top:80, right:20, zIndex:9999}}>
          <h4>관리자 로그인</h4>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="비밀번호" />
          <div style={{display:'flex', gap:8}}>
            <button onClick={async()=>{ if(await login(pw)) setOpen(false) }}>로그인</button>
            <button onClick={()=>setOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </>
  )
}
