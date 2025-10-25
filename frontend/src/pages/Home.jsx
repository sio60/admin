import React from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'
import EditableImage from '../components/EditableImage'

export default function Home() {
  return (
    <Layout title="Home">
      {/* Hero */}
      <section className="home-hero">
        <EditableImage blockKey="home.hero" alt="홈 히어로" className="home-hero-img" />
        <h2 className="home-title"><EditableText blockKey="home.title" tag="span" placeholder="메인 타이틀" /></h2>
        <p className="home-sub"><EditableText blockKey="home.subtitle" tag="span" placeholder="간단한 소개 문구" /></p>
      </section>

      {/* Features */}
      <section className="feature-grid">
        <div className="card">
          <h4><EditableText blockKey="home.feature1.title" tag="span" placeholder="포인트 1" /></h4>
          <EditableText blockKey="home.feature1.body" tag="p" placeholder="설명" />
        </div>
        <div className="card">
          <h4><EditableText blockKey="home.feature2.title" tag="span" placeholder="포인트 2" /></h4>
          <EditableText blockKey="home.feature2.body" tag="p" placeholder="설명" />
        </div>
        <div className="card">
          <h4><EditableText blockKey="home.feature3.title" tag="span" placeholder="포인트 3" /></h4>
          <EditableText blockKey="home.feature3.body" tag="p" placeholder="설명" />
        </div>
      </section>
    </Layout>
  )
}
