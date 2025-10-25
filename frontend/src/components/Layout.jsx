import React, { useState } from "react";
import Topbar from "./Topbar";
import SideDrawer from "./SideDrawer";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout({ children, title, noChrome = false }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="page-wrap">
      <Topbar onMenu={() => setDrawerOpen(true)} />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Nav onNavigate={() => setDrawerOpen(false)} />
      </SideDrawer>

      <main className="page-main">
        {title ? (
          <header className="page-header">
            <h2>{title}</h2>
          </header>
        ) : null}
        <div className={`page-body${noChrome ? " no-chrome" : ""}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
