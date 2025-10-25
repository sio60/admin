import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { EditModeProvider } from "./context/EditModeContext";
import { ServerAdminProvider } from "./context/ServerAdminProvider";

import Home from "./pages/Home";
import About from "./pages/About";
import ProductsList from "./pages/ProductsList";
import WhereToBuy from "./pages/WhereToBuy";
import SNS from "./pages/SNS";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

// ▼ 새 파일 import
import NoticeList from "./pages/NoticeList";
import NoticeDetail from "./pages/NoticeDetail";

import "./styles/index.css";
import "modern-normalize/modern-normalize.css";

export default function App() {
  return (
    <AuthProvider>
      <ServerAdminProvider>
        <EditModeProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products/live" element={<ProductsList status="live" />} />
            <Route path="/products/ended" element={<ProductsList status="ended" />} />
            <Route path="/where" element={<WhereToBuy />} />
            <Route path="/sns" element={<SNS />} />
            <Route path="/contact" element={<Contact />} />

            {/* Notice */}
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />

            <Route path="/admin" element={<Admin />} />
          </Routes>
        </EditModeProvider>
      </ServerAdminProvider>
    </AuthProvider>
  );
}
