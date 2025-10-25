import React from 'react'
import Nav from './Nav'
import { useEditMode } from '../context/EditModeContext'
import { useAuth } from '../context/AuthProvider'
import AdminLoginButton from './AdminLoginButton' // ✅ 추가

export default function Layout({ children, title }) {
  const { canEdit, on, toggle } = useEditMode()
  const { user } = useAuth()

  return (
    <div className="app-wrap">
      <Nav />
      <main>
        <header className="page-header">
          <h2>{title}</h2>
          <div className="actions">
            {/* ✅ 관리자 비번 로그인/로그아웃 버튼 */}
            <AdminLoginButton />
            {user ? <span className="user-tag">{user.email}</span> : null}
            {canEdit && (
              <button className="edit-toggle" onClick={toggle}>
                {on ? '편집 종료' : '편집 모드'}
              </button>
            )}
          </div>
        </header>
        <div className="page-body">{children}</div>
      </main>
    </div>
  )
}
