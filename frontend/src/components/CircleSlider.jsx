import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function CircleSlider({ images = [], interval = 3000 }) {
  const [idx, setIdx] = useState(0)
  const [hover, setHover] = useState(false)
  const touch = useRef({ x: 0, y: 0, dragging: false })
  const len = images.length || 1

  const slides = useMemo(
    () => images.map((src, i) => ({ src: new URL(src, window.location.origin).toString(), i })),
    [images]
  )

  useEffect(() => {
    if (len <= 1 || hover) return
    const id = setInterval(() => setIdx(v => (v + 1) % len), interval)
    return () => clearInterval(id)
  }, [len, hover, interval])

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
    if (dx > th) setIdx(v => (v - 1 + len) % len)
    if (dx < -th) setIdx(v => (v + 1) % len)
  }

  return (
    <div
      className="circle-slider"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="track" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {slides.map(s => (
          <div className="slide" key={s.i}>
            <img src={s.src} alt={`circle ${s.i + 1}`} draggable="false" />
          </div>
        ))}
      </div>
    </div>
  )
}
