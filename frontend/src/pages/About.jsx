import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'
import EditableImage from '../components/EditableImage'

export default function About() {
  return (
    <Layout title="About us & History">
      <EditableImage blockKey="about.hero" alt="About Hero" />
      <h3><EditableText blockKey="about.title" tag="span" placeholder="회사 소개 제목" /></h3>
      <EditableText blockKey="about.body" tag="div" placeholder="회사 소개 본문" />
      <h4>History</h4>
      <EditableText blockKey="about.history" tag="div" placeholder="연혁을 입력하세요" />
    </Layout>
  )
}
