import React, { useState } from 'react'
import Topbar from './Topbar'
import SideDrawer from './SideDrawer'
import Nav from './Nav'

export default function Layout({ children, title, noChrome = false }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="page-wrap">
      <Topbar onMenu={() => setOpen(true)} />
      <SideDrawer open={open} onClose={() => setOpen(false)}>
        <Nav onNavigate={() => setOpen(false)} />
      </SideDrawer>

      <main className="page-main">
        {/* 제목이 있을 때만 헤더 렌더링 */}
        {title ? (
          <header className="page-header">
            <h2>{title}</h2>
          </header>
        ) : null}

        <div className={`page-body${noChrome ? ' no-chrome' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  )
}
