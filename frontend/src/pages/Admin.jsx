import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthProvider'
import { useEditMode } from '../context/EditModeContext'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const { user, profile, isAdmin } = useAuth()
  const { on, toggle } = useEditMode()
  const [email, setEmail] = useState('')

  async function loginWithOtp(e) {
    e.preventDefault()
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } })
    alert('메일로 로그인 링크를 보냈어요.')
  }
  async function logout() { await supabase.auth.signOut() }

  return (
    <Layout title="admin">
      {!user && (
        <form onSubmit={loginWithOtp} className="card">
          <h3>관리자 로그인</h3>
          <p>관리자 이메일로 매직링크 로그인 (Supabase Auth)</p>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required />
          <button type="submit">로그인 링크 받기</button>
        </form>
      )}
      {user && (
        <div className="card">
          <p>로그인: <b>{user.email}</b></p>
          <p>권한: <b>{profile?.role || 'viewer'}</b></p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={toggle}>{on ? '편집 종료' : '편집 모드'}</button>
            <button onClick={logout}>로그아웃</button>
          </div>
          {!isAdmin && <p style={{color:'#b00',marginTop:8}}>※ 관리자/에디터 권한이 아니라 쓰기는 제한됩니다.</p>}
        </div>
      )}
      <div className="card">
        <h3>초기 가이드</h3>
        <ol>
          <li>Supabase에서 관리자 이메일로 로그인 → <code>profiles</code>에 <code>role='admin'</code> 설정</li>
          <li>각 페이지에서 편집 모드 켜고 텍스트/이미지 저장</li>
        </ol>
      </div>
    </Layout>
  )
}
