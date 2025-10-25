import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'
import EditableImage from '../components/EditableImage'

export default function Brand() {
  return (
    <Layout title="Brand">
      <EditableImage blockKey="brand.logo" alt="Brand Logo" />
      <h3><EditableText blockKey="brand.motto" tag="span" placeholder="브랜드 모토" /></h3>
      <EditableText blockKey="brand.story" tag="div" placeholder="브랜드 스토리" />
    </Layout>
  )
}
