import React from 'react'
import CircleSlider from './CircleSlider'

/** c1/c2/c3 세트를 동그란 미니 슬라이더 3개로 표시 */
export default function TripleCircleSlider({ counts = { c1: 4, c2: 4, c3: 5 } }) {
  const seq = (base, k) => [
    `/circle/${base}.png`,
    ...Array.from({ length: k }, (_, i) => `/circle/${base}_${i + 1}.png`)
  ]

  const groups = [
    seq('c1', counts.c1 ?? 0),
    seq('c2', counts.c2 ?? 0),
    seq('c3', counts.c3 ?? 0),
  ]

  return (
    <section className="triple-section">
      <div className="triple-grid">
        {groups.map((imgs, i) => (
          <CircleSlider key={i} images={imgs} interval={2800 + i * 300} />
        ))}
      </div>
    </section>
  )
}
