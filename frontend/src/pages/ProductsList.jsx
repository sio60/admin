import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'
import EditableImage from '../components/EditableImage'
import { Link } from 'react-router-dom'

export default function ProductsList({ status = 'live' }) {
  const isLive = status === 'live'
  const title = isLive ? 'Products · 판매중' : 'Products · 판매종료'

  // TODO: 실제 목록은 Supabase 등에서 status로 필터링해 가져오세요.
  // 여기선 블록키 기준으로 샘플 3개씩 배치
  const items = [1,2,3].map(n => ({
    key: `products.${status}.${n}`,
  }))

  return (
    <Layout title={title}>
      <div className="products-toolbar">
        <div className="tabs">
          <Link to="/products/live"   className={`tab ${isLive ? 'active' : ''}`}>판매중</Link>
          <Link to="/products/ended"  className={`tab ${!isLive ? 'active' : ''}`}>판매종료</Link>
        </div>
      </div>

      <div className="product-grid">
        {items.map(({key}, i) => (
          <div className="product-card" key={i}>
            <EditableImage blockKey={`${key}.image`} alt="제품 이미지" className="product-img" />
            <h4 className="product-name">
              <EditableText blockKey={`${key}.name`} tag="span" placeholder="제품명" />
            </h4>
            <p className="product-desc">
              <EditableText blockKey={`${key}.desc`} tag="span" placeholder="간단 설명" />
            </p>
          </div>
        ))}
      </div>
    </Layout>
  )
}
