import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function Carousel({
  images = [],
  interval = 4000,
  aspect = 21 / 9,     // 낮은 높이 기본
  rounded = true
}) {
  const [idx, setIdx] = useState(0)
  const [hover, setHover] = useState(false)
  const touch = useRef({ x: 0, y: 0, dragging: false })

  const len = images.length
  const go = (n) => setIdx((p) => (p + n + len) % len)
  const goto = (n) => setIdx(((n % len) + len) % len)

  useEffect(() => {
    images.forEach((src) => { const img = new Image(); img.src = src })
  }, [images])

  useEffect(() => {
    if (len <= 1 || hover || document.hidden) return
    const id = setInterval(() => go(1), interval)
    const onVis = () => {}
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [hover, interval, len])

  // swipe
  function onTouchStart(e) {
    const t = e.touches?.[0]; if (!t) return
    touch.current = { x: t.clientX, y: t.clientY, dragging: true }
  }
  function onTouchMove(e) {
    if (!touch.current.dragging) return
    const dx = e.touches[0].clientX - touch.current.x
    const dy = e.touches[0].clientY - touch.current.y
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault()
  }
  function onTouchEnd(e) {
    if (!touch.current.dragging) return
    const endX = (e.changedTouches?.[0] || {}).clientX ?? touch.current.x
    const dx = endX - touch.current.x
    touch.current.dragging = false
    const th = 40
    if (dx > th) go(-1)
    if (dx < -th) go(1)
  }

  const slides = useMemo(() => images.map((src, i) => ({
    src, alt: `Slide ${i+1}`
  })), [images])

  return (
    // ✅ 클리핑 전용 래퍼: 여기에 border-radius + overflow
    <div className={`carousel-clip ${rounded ? '' : 'square'}`}>
      <div
        className="carousel"
        style={{ paddingTop: `${100 / aspect}%` }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div className="carousel-slide" key={i} aria-hidden={idx !== i}>
              <img src={s.src} alt={s.alt} draggable="false" />
            </div>
          ))}
        </div>

        {len > 1 && (
          <>
            <button className="carousel-arrow left"  onClick={() => go(-1)} aria-label="이전"></button>
            <button className="carousel-arrow right" onClick={() => go(1)}  aria-label="다음"></button>
          </>
        )}

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
    </div>
  )
}
