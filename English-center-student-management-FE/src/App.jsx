import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mainpage from "./pages/Mainpage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CRMpage from "./pages/CRMpage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import CourseManagement from "./pages/CourseManagement.jsx";
import CRMLeads from "./pages/CRMLeads.jsx";
import NotificationsSupport from "./pages/NotificationsSupport.jsx";
import { ROLES } from "./utils/permissions";

// Utility functions
const getUserRole = () => {
  try {
    return (localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "").toLowerCase();
  } catch {
    return "";
  }
};

const isAuthenticated = () => {
  return !!getUserRole();
};

// Protected route components

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const RequireAdmin = ({ children }) => {
  return getUserRole() === "admin" ? children : <Navigate to="/" replace />;
};

// Component để xử lý route chính
const MainRoute = () => {
  if (!isAuthenticated()) {
    // Chưa login: hiển thị Mainpage
    return <Mainpage />;
  }
  
  // Đã login: redirect theo role
  const role = getUserRole();
  return role === ROLES.ADMIN ? <Navigate to="/dashboard" replace /> : <Navigate to="/crm" replace />;
};
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route login không dùng layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes dùng MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Route chính - xử lý cả trường hợp chưa login và đã login */}
          <Route index element={<MainRoute />} />

          {/* Admin-only routes */}
          <Route path="dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
          <Route path="finance" element={<RequireAdmin><FinancePage /></RequireAdmin>} />

          {/* General routes */}
          <Route path="accounts/create" element={<CreateAccount />} />
          <Route path="crm" element={<CRMpage />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="crm-leads" element={<CRMLeads />} />
          <Route path="notifications" element={<NotificationsSupport />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

