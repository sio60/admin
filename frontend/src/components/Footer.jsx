import React, { useEffect, useState } from 'react'
import EditableText from './EditableText'
import AdminLoginButton from './AdminLoginButton'   // ✅ 추가

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`to-top ${show ? 'show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="맨 위로"
    >
      <span className="caret" aria-hidden="true" />
    </button>
  )
}

export default function Footer() {
  return (
    <>
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <h4 className="footer-brand">ZESTCO</h4>

          <p className="footer-line">
            대표 : <EditableText blockKey="footer.ceo" tag="span" placeholder="심현영" /> |
            {' '}사업자등록번호 : <EditableText blockKey="footer.biz" tag="span" placeholder="144-81-07001" /> |
            {' '}전화 : <EditableText blockKey="footer.tel" tag="span" placeholder="031-703-7833" /> |
            {' '}팩스 : <EditableText blockKey="footer.fax" tag="span" placeholder="031-716-7833" />
          </p>

          <p className="footer-line">
            주소 : <EditableText
              blockKey="footer.addr"
              tag="span"
              placeholder="경기도 성남시 분당구 방새울로200번길36 동부루트빌딩 1209호"
            />
          </p>

          <p className="footer-line">
            개인정보보호책임자 : <EditableText blockKey="footer.pic" tag="span" placeholder="박혜나" />
            {' '}(
            <EditableText blockKey="footer.email" tag="span" placeholder="trade@zestco.co.kr" />
            )
          </p>

          {/* ✅ 관리자 로그인 버튼을 푸터로 이동 */}
          <div className="footer-actions">
            <AdminLoginButton />
          </div>
        </div>
      </footer>

      <BackToTop />
    </>
  )
}
