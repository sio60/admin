// src/pages/ProductsList.jsx
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8787'

export default function ProductsList({ status = 'live' }) {
  const isLive = status === 'live'
  const title = isLive ? 'Products · 판매중' : 'Products · 판매종료'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError('')
    fetch(`${API}/api/products?status=${status}&page=1&page_size=12&order=asc`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => { if (!cancel) setItems(data || []) })
      .catch(e => { if (!cancel) setError(e.message || '불러오기에 실패했어요') })
      .finally(() => { if (!cancel) setLoading(false) })
    return () => { cancel = true }
  }, [status])

  return (
    <Layout title={title}>
      <div className="products-toolbar">
        <div className="tabs">
          <Link to="/products/live"  className={`tab ${isLive ? 'active' : ''}`}>판매중</Link>
          <Link to="/products/ended" className={`tab ${!isLive ? 'active' : ''}`}>판매종료</Link>
        </div>
      </div>

      {loading && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">에러: {error}</p>}

      <div className="product-grid">
        {items.map(it => (
          <div className="product-card" key={it.id}>
            {it.thumb_url
              ? <img src={it.thumb_url} alt={it.name} className="product-img" />
              : <div className="product-img placeholder">이미지 없음</div>}
            <h4 className="product-name">{it.name}</h4>
            {it.sub_name && <div className="product-sub">{it.sub_name}</div>}
            {it.description && <p className="product-desc">{it.description}</p>}
            {typeof it.price === 'number' && (
              <div className="product-price">{it.price.toLocaleString()}원</div>
            )}
          </div>
        ))}
        {!loading && !error && items.length === 0 && (
          <div className="muted">표시할 제품이 없습니다.</div>
        )}
      </div>
    </Layout>
  )
}
