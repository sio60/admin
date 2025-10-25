import React from 'react'
import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import EditableText from '../components/EditableText'
import TripleCircleSlider from '../components/TripleCircleSlider'

export default function Home() {
  const slides = Array.from({ length: 7 }, (_, i) => `/slide/slide${i + 1}.png`)

  return (
    <Layout title={null} noChrome>
      <section className="home-hero">
        <Carousel images={slides} interval={4500} aspect={24 / 9} />
        <h2 className="home-title">
          <EditableText blockKey="home.title" tag="span" placeholder="메인 타이틀" />
        </h2>
        <p className="home-sub">
          <EditableText blockKey="home.subtitle" tag="span" placeholder="간단한 소개 문구" />
        </p>
      </section>

      {/* 원형 3연 슬라이더 (c1/c2/c3) */}
      <TripleCircleSlider counts={{ c1: 4, c2: 4, c3: 5 }} />
    </Layout>
  )
}
