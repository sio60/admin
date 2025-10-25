import React from "react";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import EditableText from "../components/EditableText";
import CircleSlider from "../components/CircleSlider";

export default function Home() {
  // 상단 캐러셀 이미지
  const slides = Array.from({ length: 7 }, (_, i) => `/slide/slide${i + 1}.png`);

  // 세 슬라이더 이미지
  const seq = (base, k) => [
    `/circle/${base}.png`,
    ...Array.from({ length: k }, (_, i) => `/circle/${base}_${i + 1}.png`),
  ];
  const counts = { c1: 4, c2: 4, c3: 5 };
  const c1 = seq("c1", counts.c1);
  const c2 = seq("c2", counts.c2);
  const c3 = seq("c3", counts.c3);

  return (
    <Layout title={null} noChrome>
      {/* 상단 캐러셀 */}
      <section className="home-hero">
        <Carousel images={slides} interval={4500} aspect={24 / 9} />
      </section>

      {/* 중앙 타이틀 + 네모 슬라이더 3개 (가운데만 살짝 아래) */}
      <section className="home-intro">
        <div className="intro-text">
          <h1 className="intro-title">
            <EditableText
              blockKey="home.welcome.ko"
              tag="span"
              placeholder="신뢰·맛·품질로 완성하는 제스트의 선택"
            />
          </h1>
          <p className="intro-sub">
            <EditableText
              blockKey="home.welcome.en"
              tag="span"
              placeholder="We deliver trusted quality and remarkable taste."
            />
          </p>
        </div>

        <div className="intro-sliders">
          <div className="intro-item">
            <CircleSlider images={c1} interval={2600} padPct={6} radius={14} />
          </div>
          <div className="intro-item lower">
            <CircleSlider images={c2} interval={2800} padPct={6} radius={14} />
          </div>
          <div className="intro-item">
            <CircleSlider images={c3} interval={3000} padPct={6} radius={14} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
