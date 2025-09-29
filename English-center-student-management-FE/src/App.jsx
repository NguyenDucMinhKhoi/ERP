import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mainpage from "./pages/Mainpage/Mainpage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CRMpage from "./pages/CRMpage.jsx";
import FinancePage from "./pages/FinancePage.jsx";

function getUserRole() {
  try {
    return (
      localStorage.getItem("userRole") ||
      sessionStorage.getItem("userRole") ||
      ""
    ).toLowerCase();
  } catch {
    return "";
  }
}

function RequireAdmin({ children }) {
  const role = getUserRole();
  if (role === "admin") return children;
  return <Navigate to="/" replace />;
}

function HomeRoute() {
  const role = getUserRole();
  if (role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Mainpage />;
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeRoute />} />
          {/* Admin-only dashboard */}
          <Route
            path="/dashboard"
            element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            }
          />
          {/**
           * Các route cho nhân viên, giáo viên, học viên chưa có UI.
           * Khi bạn sẵn sàng, bỏ comment và trỏ tới page tương ứng.
           */}
          {/** <Route path="/staff" element={<StaffPage />} /> */}
          {/** <Route path="/teacher" element={<TeacherPage />} /> */}
          {/** <Route path="/student" element={<StudentPage />} /> */}
          <Route path="/accounts/create" element={<CreateAccount />} />
          <Route path="/crm" element={<CRMpage />} />
          <Route 
            path="/finance" 
            element={
              <RequireAdmin>
                <FinancePage />
              </RequireAdmin>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
