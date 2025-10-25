import React from 'react'

export default function CircleGallery() {
  // 절대경로 생성 헬퍼 (도메인 포함 절대주소가 필요하면 사용)
  const abs = (p) => new URL(p, window.location.origin).toString()

  const rows = [
    [ '/circle/c1.png',  '/circle/c1_1.png', '/circle/c1_2.png', '/circle/c1_3.png', '/circle/c1_4.png' ],
    [ '/circle/c2.png',  '/circle/c2_1.png', '/circle/c2_2.png', '/circle/c2_3.png', '/circle/c2_4.png' ],
    [ '/circle/c3.png',  '/circle/c3_1.png', '/circle/c3_2.png', '/circle/c3_3.png', '/circle/c3_4.png', '/circle/c3_5.png' ],
  ]

  return (
    <section className="circle-section">
      <div className="circle-card">
        {rows.map((list, rIdx) => (
          <div className="circle-row" key={rIdx}>
            {list.map((src, i) => (
              <figure className="circle" key={i}>
                <img src={abs(src)} alt={`circle ${rIdx + 1}-${i + 1}`} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
