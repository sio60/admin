import React, { useState } from 'react'
import Topbar from './Topbar'
import SideDrawer from './SideDrawer'
import Nav from './Nav'

export default function Layout({ children, title }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="page-wrap">
      <Topbar onMenu={() => setOpen(true)} />
      <SideDrawer open={open} onClose={() => setOpen(false)}>
        <Nav onNavigate={() => setOpen(false)} />
      </SideDrawer>

      <main className="page-main">
        <header className="page-header">
          <h2>{title}</h2>
        </header>
        <div className="page-body">{children}</div>
      </main>
    </div>
  )
}
