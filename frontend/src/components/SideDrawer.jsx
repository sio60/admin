import React, { useEffect } from 'react'

export default function SideDrawer({ open, onClose, children }) {
  // ESC로 닫기
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  // 열렸을 때 바디 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = open ? 'hidden' : prev
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <div className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
      <button className="backdrop" onClick={onClose} aria-label="배경 닫기" />
      <div className="drawer-panel">
        <button className="drawer-close" onClick={onClose} aria-label="닫기">×</button>
        {children}
      </div>
    </div>
  )
}
