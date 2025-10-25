import React from 'react'
import { useEditMode } from '../context/EditModeContext'
import { useAuth } from '../context/AuthProvider'
import AdminLoginButton from './AdminLoginButton'

export default function Topbar({ onMenu }) {
  const { canEdit, on, toggle } = useEditMode()
  const { user } = useAuth()

  return (
    <header className="topbar">
      {/* 햄버거: 제공한 이미지 사용 */}
      <button
        className="hamburger"
        onClick={onMenu}
        aria-label="메뉴 열기"
        aria-haspopup="dialog"
      >
        <img src="/icons/hamburger.png" alt="" width="26" height="26" aria-hidden="true" />
      </button>

      {/* 가운데 로고 (텍스트 브랜드 제거) */}
      <div className="logo-center" aria-label="홈으로">
        <a href="/" className="logo-link">
          <img src="/brand-logo.png" alt="Logo" className="logo-img" />
        </a>
      </div>

      <div className="topbar-actions">
        <AdminLoginButton />
        {user ? <span className="user-tag">{user.email}</span> : null}
        {canEdit && (
          <button className="edit-toggle" onClick={toggle}>
            {on ? '편집 종료' : '편집 모드'}
          </button>
        )}
      </div>
    </header>
  )
}
