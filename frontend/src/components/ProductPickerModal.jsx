import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductPickerModal({ open, onClose }) {
  const nav = useNavigate()
  if (!open) return null

  const go = (path) => {
    onClose?.()
    nav(path)
  }

  return (
    <div className="picker-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="picker-panel" onClick={(e)=>e.stopPropagation()}>
        <h3 className="picker-title">어느 목록으로 갈까요?</h3>
        <div className="picker-grid">
          <button className="picker-card live" onClick={() => go('/products/live')}>
            <span className="picker-badge">판매중</span>
            <span className="picker-desc">현재 판매중인 제품</span>
          </button>
          <button className="picker-card ended" onClick={() => go('/products/ended')}>
            <span className="picker-badge">판매종료</span>
            <span className="picker-desc">종료된/단종 제품</span>
          </button>
        </div>
        <button className="picker-close" onClick={onClose} aria-label="닫기">닫기</button>
      </div>
    </div>
  )
}
