import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export default function Nav({ onNavigate }) {
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  const handle = () => onNavigate && onNavigate()
  const { pathname } = useLocation()
  const [openProducts, setOpenProducts] = useState(false)

  // 현재 /products/* 에 있으면 자동으로 펼침
  useEffect(() => {
    setOpenProducts(pathname.startsWith('/products'))
  }, [pathname])

  return (
    <nav className="drawer-nav">
      <h1 className="logo">Menu</h1>
      <ul className="nav-root">
        <li><NavLink to="/about" className={link} onClick={handle}>About us & History</NavLink></li>

        {/* ▼ Products 드롭다운 */}
        <li className={`has-sub ${openProducts ? 'open' : ''}`}>
          <button
            type="button"
            className="nav-link caret"
            onClick={() => setOpenProducts(v => !v)}
            aria-expanded={openProducts}
            aria-controls="nav-products-sub"
          >
            <span>Products</span>
            <span className="chev" aria-hidden />
          </button>

          <ul id="nav-products-sub" className="nav-sub">
            <li>
              <NavLink to="/products/live" className="nav-sublink" onClick={handle}>
                판매중
              </NavLink>
            </li>
            <li>
              <NavLink to="/products/ended" className="nav-sublink" onClick={handle}>
                판매종료
              </NavLink>
            </li>
          </ul>
        </li>

        <li><NavLink to="/where" className={link} onClick={handle}>Where to Buy</NavLink></li>
        <li><NavLink to="/sns" className={link} onClick={handle}>SNS</NavLink></li>
        <li><NavLink to="/contact" className={link} onClick={handle}>Contact</NavLink></li>
        <li><NavLink to="/notice" className={link} onClick={handle}>Notice</NavLink></li>
      </ul>
    </nav>
  )
}
