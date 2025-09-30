import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mainpage from "./pages/Mainpage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CRMpage from "./pages/CRMpage.jsx";
import StudentManagement from "./pages/StudentManagement.jsx";
import CourseManagement from "./pages/CourseManagement.jsx";
import CRMLeads from "./pages/CRMLeads.jsx";
import FinancePage from "./pages/FinancePage.jsx";

// Utility functions
const getUserRole = () => {
  try {
    return (localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "").toLowerCase();
  } catch {
    return "";
  }
};

// Protected route components
const RequireAdmin = ({ children }) => {
  return getUserRole() === "admin" ? children : <Navigate to="/" replace />;
};

const HomeRoute = () => {
  return getUserRole() === "admin" ? <Navigate to="/dashboard" replace /> : <Mainpage />;
};
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeRoute />} />
          
          {/* Admin-only routes */}
          <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
          <Route path="/finance" element={<RequireAdmin><FinancePage /></RequireAdmin>} />
                <Route
                  path="/student-management"
                  element={<StudentManagement />}
                />
                <Route
                  path="/course-management"
                  element={<CourseManagement />}
                />
                <Route path="/crm-leads" element={<CRMLeads />} />
          
          {/* General routes */}
          <Route path="/accounts/create" element={<CreateAccount />} />
          <Route path="/crm" element={<CRMpage />} />
          
          {/* Future routes - uncomment when ready */}
          {/* <Route path="/staff" element={<StaffPage />} /> */}
          {/* <Route path="/teacher" element={<TeacherPage />} /> */}
          {/* <Route path="/student" element={<StudentPage />} /> */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
