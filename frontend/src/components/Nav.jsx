import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Nav({ onNavigate }) {
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  const handle = () => onNavigate && onNavigate()
  return (
    <nav className="drawer-nav">
      <h1 className="logo">Menu</h1>
      <ul>
        <li><NavLink to="/about" className={link} onClick={handle}>About us & History</NavLink></li> {/* ✅ 경로 변경 */}
        <li><NavLink to="/brand" className={link} onClick={handle}>Brand</NavLink></li>
        <li><NavLink to="/products" className={link} onClick={handle}>Products</NavLink></li>
        <li><NavLink to="/where" className={link} onClick={handle}>Where to Buy</NavLink></li>
        <li><NavLink to="/sns" className={link} onClick={handle}>SNS</NavLink></li>
        <li><NavLink to="/contact" className={link} onClick={handle}>Contact</NavLink></li>
        <li><NavLink to="/notice" className={link} onClick={handle}>Notice</NavLink></li>
      </ul>
    </nav>
  )
}
