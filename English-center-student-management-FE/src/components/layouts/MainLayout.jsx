import React from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import MainpageSidebar from "./MainpageSidebar.jsx";
import { useLocation } from "react-router-dom";

export default function MainLayout({ children }) {
  const location = useLocation();

  // Show a slimmer, content-focused sidebar for the public mainpage (/) so dashboard sidebar remains untouched
  const isMainpage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4">
      {/* 2 cột: Sidebar + Content */}
      <div className="mx-auto grid max-w-full grid-cols-1 gap-0 lg:grid-cols-[260px_1fr]">
        {/* Choose sidebar: mainpage-specific or the regular app sidebar */}
        {isMainpage ? <MainpageSidebar /> : <Sidebar />}

        {/* Cột nội dung bên phải */}
        <div className="min-h-[100dvh]">
          {/* Header nằm CHỈ trong cột content */}
          <Header />

          {/* Nội dung trang */}
          <main className="space-y-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
