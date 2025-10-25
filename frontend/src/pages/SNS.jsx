import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'

export default function SNS() {
  return (
    <Layout title="SNS">
      <EditableText blockKey="sns.links" tag="div" placeholder="SNS 링크/안내" />
    </Layout>
  )
}
