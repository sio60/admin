import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Nav() {
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  return (
    <nav className="side-nav">
      <h1 className="logo">AdminSite</h1>
      <ul>
        <li><NavLink to="/" className={link}>About us & History</NavLink></li>
        <li><NavLink to="/brand" className={link}>Brand</NavLink></li>
        <li><NavLink to="/products" className={link}>Products</NavLink></li>
        <li><NavLink to="/where" className={link}>Where to Buy</NavLink></li>
        <li><NavLink to="/sns" className={link}>SNS</NavLink></li>
        <li><NavLink to="/contact" className={link}>Contact</NavLink></li>
        <li><NavLink to="/notice" className={link}>Notice</NavLink></li>
        <li><NavLink to="/admin" className={link}>admin</NavLink></li>
      </ul>
    </nav>
  )
}
