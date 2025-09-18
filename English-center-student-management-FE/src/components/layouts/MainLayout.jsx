import React from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 2 cột: Sidebar + Content */}
      <div className="mx-auto grid max-w-full grid-cols-1 gap-0 lg:grid-cols-[260px_1fr]">
        {/* Sidebar luôn ở cột trái, sticky full-height */}
        <Sidebar />

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
