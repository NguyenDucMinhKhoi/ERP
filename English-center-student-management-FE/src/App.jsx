import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mainpage from "./pages/Mainpage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CRMpage from "./pages/CRMpage.jsx";
import CourseManagement from "./pages/CourseManagement.jsx";
import Reports from "./pages/Reports.jsx";
import CRMLeads from "./pages/CRMLeads.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import NotificationsSupport from "./pages/NotificationsSupport.jsx";
import { ROLES } from "./utils/permissions";
import { StudentModules } from "./components/CRM";

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
  const role = getUserRole();
  return role === ROLES.ADMIN ? children : <Navigate to="/crm" replace />;
};

// Component để xử lý route chính
const MainRoute = () => {
  if (!isAuthenticated()) {
    // Chưa login: hiển thị Mainpage
    return <Mainpage />;
  }
  
  const role = getUserRole();
  if (role === ROLES.ADMIN) return <Navigate to="/dashboard" replace />;
  if (role === ROLES.STUDENT) return <Navigate to="/student" replace />; // thêm học viên
  return <Navigate to="/crm" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />     
        {/* Tất cả routes đều dùng MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Route chính - xử lý cả trường hợp chưa login và đã login */}
          <Route index element={<MainRoute />} />
          
          {/* Admin-only routes */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin>
              </RequireAuth>
            } 
          />
          <Route 
            path="/finance" 
            element={
              <RequireAuth>
                <RequireAdmin>
                  <FinancePage />
                </RequireAdmin>
              </RequireAuth>
            } 
          />
          <Route 
            path="/accounts/create" 
            element={
              <RequireAuth>
                <RequireAdmin>
                  <CreateAccount />
                </RequireAdmin>
              </RequireAuth>
            } 
          />
          
          {/* General routes accessible to both admin and staff */}
          <Route 
            path="/crm" 
            element={
              <RequireAuth>
                <CRMpage />
              </RequireAuth>
            } 
          />
          <Route 
            path="/course-management" 
            element={
              <RequireAuth>
                <CourseManagement />
              </RequireAuth>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <RequireAuth>
                <Reports />
              </RequireAuth>
            } 
          />
          <Route 
            path="/crm-leads" 
            element={
              <RequireAuth>
                <CRMLeads />
              </RequireAuth>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <RequireAuth>
                <NotificationsSupport />
              </RequireAuth>
            } 
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
