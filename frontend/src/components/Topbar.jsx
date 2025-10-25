import React from 'react'
import { useEditMode } from '../context/EditModeContext'
import { useAuth } from '../context/AuthProvider'
import AdminLoginButton from './AdminLoginButton'

export default function Topbar({ onMenu }) {
  const { canEdit, on, toggle } = useEditMode()
  const { user } = useAuth()

  // 절대경로(도메인 포함) 헬퍼
  const abs = (p) => new URL(p, window.location.origin).toString()

  return (
    <header className="topbar">
      {/* 햄버거: 절대경로 */}
      <button
        className="hamburger"
        onClick={onMenu}
        aria-label="메뉴 열기"
        aria-haspopup="dialog"
      >
        <img
          src={abs('/icons/hamburger.png')}
          alt=""
          width="26"
          height="26"
          aria-hidden="true"
          decoding="async"
        />
      </button>

      {/* 가운데 로고: 절대경로 */}
      <div className="logo-center" aria-label="홈으로">
        <a href={abs('/')} className="logo-link">
          <img
            src={abs('/brand-logo.png')}
            alt="Logo"
            className="logo-img"
            decoding="async"
          />
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
