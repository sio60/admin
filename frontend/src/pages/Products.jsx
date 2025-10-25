import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'
import EditableImage from '../components/EditableImage'

export default function Products() {
  return (
    <Layout title="Products">
      <h3><EditableText blockKey="products.title" tag="span" placeholder="제품 소개" /></h3>
      <div className="product">
        <EditableImage blockKey="products.item1.image" alt="제품1" />
        <EditableText blockKey="products.item1.name" tag="h4" placeholder="제품명" />
        <EditableText blockKey="products.item1.desc" tag="p" placeholder="설명" />
      </div>
      <div className="product">
        <EditableImage blockKey="products.item2.image" alt="제품2" />
        <EditableText blockKey="products.item2.name" tag="h4" placeholder="제품명" />
        <EditableText blockKey="products.item2.desc" tag="p" placeholder="설명" />
      </div>
    </Layout>
  )
}
