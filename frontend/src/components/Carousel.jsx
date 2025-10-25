import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function Carousel({
  images = [],
  interval = 4000,      // 자동재생 간격(ms)
  aspect = 16 / 9,      // 가로:세로 비율
  rounded = true
}) {
  const [idx, setIdx] = useState(0)
  const [hover, setHover] = useState(false)
  const trackRef = useRef(null)
  const touch = useRef({ x:0, y:0, dragging:false })

  const len = images.length
  const go = (n) => setIdx((prev) => (prev + n + len) % len)
  const goto = (n) => setIdx(((n % len) + len) % len)

  // 이미지 프리로드
  useEffect(() => {
    images.forEach((src) => { const img = new Image(); img.src = src })
  }, [images])

  // 자동재생 (호버/탭 비가시성면 정지)
  useEffect(() => {
    if (len <= 1) return
    if (hover || document.hidden) return
    const id = setInterval(() => go(1), interval)
    const onVis = () => { /* 트리거 재시작 위해 상태 토글 */ }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [hover, interval, len])

  // 키보드
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [len])

  // 터치 스와이프
  function onTouchStart(e) {
    const t = e.touches?.[0]
    if (!t) return
    touch.current = { x: t.clientX, y: t.clientY, dragging: true }
  }
  function onTouchMove(e) {
    if (!touch.current.dragging) return
    // 기본 스크롤 방지(수평 이동이 더 크면)
    const dx = e.touches[0].clientX - touch.current.x
    const dy = e.touches[0].clientY - touch.current.y
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault()
  }
  function onTouchEnd(e) {
    if (!touch.current.dragging) return
    const endX = (e.changedTouches?.[0] || {}).clientX ?? touch.current.x
    const dx = endX - touch.current.x
    touch.current.dragging = false
    const threshold = 40
    if (dx > threshold) go(-1)
    if (dx < -threshold) go(1)
  }

  const slides = useMemo(() => images.map((src, i) => ({
    src, alt: `Slide ${i+1}`
  })), [images])

  return (
    <div
      className={`carousel ${rounded ? 'rounded' : ''}`}
      style={{ paddingTop: `${100 / aspect}%` }}     // aspect-ratio 유지
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="carousel-track"
        ref={trackRef}
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div className="carousel-slide" key={i} aria-hidden={idx !== i}>
            <img src={s.src} alt={s.alt} draggable="false" />
          </div>
        ))}
      </div>

      {/* 화살표 */}
      {len > 1 && (
        <>
          <button className="carousel-arrow left" onClick={() => go(-1)} aria-label="이전">‹</button>
          <button className="carousel-arrow right" onClick={() => go(1)} aria-label="다음">›</button>
        </>
      )}

      {/* 도트 */}
      {len > 1 && (
        <div className="carousel-dots" role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === idx ? 'active' : ''}`}
              onClick={() => goto(i)}
              aria-label={`슬라이드 ${i+1}`}
              role="tab"
              aria-selected={i === idx}
            />
          ))}
        </div>
      )}
    </div>
  )
}
