import React from "react";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import EditableText from "../components/EditableText";
import CircleSlider from "../components/CircleSlider";

export default function Home() {
  // 상단 캐러셀 이미지
  const slides = Array.from({ length: 7 }, (_, i) => `/slide/slide${i + 1}.png`);

  // c1/c2/c3 이미지 시퀀스
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
      {/* 상단 캐러셀만 표시 (제목/설명 텍스트 제거) */}
      <section className="home-hero">
        <Carousel images={slides} interval={4500} aspect={24 / 9} />
      </section>

      {/* 좌: 환영 문구 / 우: 네모 슬라이더 3개 */}
      <section className="home-split">
        <div className="split-text">
          <h3 className="welcome-ko">
            <EditableText
              blockKey="home.welcome.ko"
              tag="span"
              placeholder="제스트코에 오신 것을 환영합니다."
            />
          </h3>
          <h4 className="welcome-en">
            <EditableText
              blockKey="home.welcome.en"
              tag="span"
              placeholder="Welcome To Zestco!"
            />
          </h4>
        </div>

        <div className="split-media three-rings">
          <CircleSlider images={c1} interval={2600} padPct={6} radius={14} />
          <CircleSlider images={c2} interval={2800} padPct={6} radius={14} />
          <CircleSlider images={c3} interval={3000} padPct={6} radius={14} />
        </div>
      </section>
    </Layout>
  );
}
