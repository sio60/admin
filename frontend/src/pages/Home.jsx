import React from 'react'
import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import EditableText from '../components/EditableText'

export default function Home() {
  const slides = Array.from({ length: 7 }, (_, i) => `/slide/slide${i+1}.png`)

  return (
    // title={null} → 제목 헤더 안 나옴, noChrome → 테두리/배경/패딩 제거
    <Layout title={null} noChrome>
      <section className="home-hero">
        <Carousel images={slides} interval={4500} aspect={16/9} />
        <h2 className="home-title">
          <EditableText blockKey="home.title" tag="span" placeholder="메인 타이틀" />
        </h2>
        <p className="home-sub">
          <EditableText blockKey="home.subtitle" tag="span" placeholder="간단한 소개 문구" />
        </p>
      </section>
    </Layout>
  )
}
