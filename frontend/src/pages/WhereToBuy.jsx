import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'

export default function WhereToBuy() {
  return (
    <Layout title="Where to Buy">
      <EditableText blockKey="where.intro" tag="p" placeholder="구매처 안내" />
      <EditableText blockKey="where.list" tag="div" placeholder="오프라인/온라인 판매처 목록" />
    </Layout>
  )
}
