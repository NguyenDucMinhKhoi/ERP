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
import ProfilePage from "./pages/ProfilePage.jsx";
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

// Helper function to get default page for role
const getDefaultPageForRole = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/dashboard";
    case ROLES.GIANGVIEN:
    case ROLES.ACADEMIC_STAFF:
      return "/course-management";
    case ROLES.SALES_STAFF:
      return "/crm-leads";
    case ROLES.FINANCE_STAFF:
      return "/finance";
    default:
      return "/crm";
  }
};

// Role-based route protection components
const RequireAdmin = ({ children }) => {
  const role = getUserRole();
  return role === ROLES.ADMIN ? children : <Navigate to={getDefaultPageForRole(role)} replace />;
};

const RequireFinanceAccess = ({ children }) => {
  const role = getUserRole();
  return (role === ROLES.ADMIN || role === ROLES.FINANCE_STAFF) 
    ? children 
    : <Navigate to={getDefaultPageForRole(role)} replace />;
};

const RequireCourseAccess = ({ children }) => {
  const role = getUserRole();
  return (role === ROLES.ADMIN || role === ROLES.ACADEMIC_STAFF || role === ROLES.GIANGVIEN) 
    ? children 
    : <Navigate to={getDefaultPageForRole(role)} replace />;
};

const RequireCRMAccess = ({ children }) => {
  const role = getUserRole();
  return (role === ROLES.ADMIN || role === ROLES.SALES_STAFF || role === ROLES.ACADEMIC_STAFF) 
    ? children 
    : <Navigate to={getDefaultPageForRole(role)} replace />;
};

// Component để xử lý route chính - Redirect đến trang chính của từng bộ phận
const MainRoute = () => {
  if (!isAuthenticated()) {
    // Chưa login: hiển thị Mainpage
    return <Mainpage />;
  }
  
  const role = getUserRole();
  
  // Redirect theo role và trang chính của từng bộ phận
  switch (role) {
    case ROLES.ADMIN:
      // Admin: Dashboard tổng quan toàn hệ thống
      return <Navigate to="/dashboard" replace />;
      
    case ROLES.GIANGVIEN:
      // Giảng viên: Quản lý khóa học và lớp học
      return <Navigate to="/course-management" replace />;
      
    case ROLES.ACADEMIC_STAFF:
      // Học vụ: Quản lý khóa học và học viên
      return <Navigate to="/course-management" replace />;
      
    case ROLES.SALES_STAFF:
      // Tư vấn: CRM và quản lý leads
      return <Navigate to="/crm-leads" replace />;
      
    case ROLES.FINANCE_STAFF:
      // Tài chính: Quản lý thanh toán và học phí
      return <Navigate to="/finance" replace />;
      
    case ROLES.HOCVIEN:
      // Học viên: Student portal
      return <Navigate to="/student" replace />;
      
    default:
      // Fallback: CRM page
      return <Navigate to="/crm" replace />;
  }
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
            path="/accounts/create" 
            element={
              <RequireAuth>
                <RequireAdmin>
                  <CreateAccount />
                </RequireAdmin>
              </RequireAuth>
            } 
          />
          
          {/* Finance routes - Admin + Finance Staff */}
          <Route 
            path="/finance" 
            element={
              <RequireAuth>
                <RequireFinanceAccess>
                  <FinancePage />
                </RequireFinanceAccess>
              </RequireAuth>
            } 
          />
          
          {/* Course Management routes - Admin + Academic Staff + Giảng viên */}
          <Route 
            path="/course-management" 
            element={
              <RequireAuth>
                <RequireCourseAccess>
                  <CourseManagement />
                </RequireCourseAccess>
              </RequireAuth>
            } 
          />
          
          {/* CRM routes - Admin + Sales Staff + Academic Staff */}
          <Route 
            path="/crm" 
            element={
              <RequireAuth>
                <RequireCRMAccess>
                  <CRMpage />
                </RequireCRMAccess>
              </RequireAuth>
            } 
          />
          <Route 
            path="/crm-leads" 
            element={
              <RequireAuth>
                <RequireCRMAccess>
                  <CRMLeads />
                </RequireCRMAccess>
              </RequireAuth>
            } 
          />
          
          {/* Reports routes - All staff can access */}
          <Route 
            path="/reports" 
            element={
              <RequireAuth>
                <Reports />
              </RequireAuth>
            } 
          />
          
          {/* Notifications routes - All staff can access */}
          <Route 
            path="/notifications" 
            element={
              <RequireAuth>
                <NotificationsSupport />
              </RequireAuth>
            } 
          />
          
          {/* Student routes - Deprecated (students don't have accounts by default) */}
          <Route 
            path="/student" 
            element={
              <RequireAuth>
                <StudentModules />
              </RequireAuth>
            } 
          />
          
          {/* Profile route - All authenticated users */}
          <Route 
            path="/profile" 
            element={
              <RequireAuth>
                <ProfilePage />
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
