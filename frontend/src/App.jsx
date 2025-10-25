import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { EditModeProvider } from './context/EditModeContext'
import { ServerAdminProvider } from './context/ServerAdminProvider'

import Home from './pages/Home'
import About from './pages/About'
import Brand from './pages/Brand'
import Products from './pages/Products'
import WhereToBuy from './pages/WhereToBuy'
import SNS from './pages/SNS'
import Contact from './pages/Contact'
import Notice from './pages/Notice'
import Admin from './pages/Admin'

import './styles/base.css'
import 'modern-normalize/modern-normalize.css'

export default function App() {
  return (
    <AuthProvider>
      <ServerAdminProvider>
        <EditModeProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/products" element={<Products />} />
            <Route path="/where" element={<WhereToBuy />} />
            <Route path="/sns" element={<SNS />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </EditModeProvider>
      </ServerAdminProvider>
    </AuthProvider>
  )
}
