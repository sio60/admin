import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'

export default function Notice() {
  return (
    <Layout title="Notice">
      <EditableText blockKey="notice.list" tag="div" placeholder="공지사항을 입력하세요(목록/HTML)" />
    </Layout>
  )
}
