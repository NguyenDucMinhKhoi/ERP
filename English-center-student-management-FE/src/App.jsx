import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mainpage from "./pages/Mainpage/Mainpage.jsx";
import CRM from "./pages/CRM/index.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
