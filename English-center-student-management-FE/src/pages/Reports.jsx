import React, { useEffect, useState } from "react";
import Filters from "../components/Reports/Filters";
import ExportButtons from "../components/Reports/ExportButtons";
import StudentsReport from "../components/Reports/StudentsReport";
import RevenueReport from "../components/Reports/RevenueReport";
import CRMReport from "../components/Reports/CRMReport";
import StatusReport from "../components/Reports/StatusReport";
import authService from "../services/authService";
import crmService from "../services/crmService";

export default function Reports() {
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const [filters, setFilters] = useState({ from: "", to: "", course: "" });
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          if (mounted) setRole(me?.role || null);
        } else if (mounted) setRole(null);
      } catch {
        if (mounted) setRole(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load all students for filtering
  useEffect(() => {
    let mounted = true;
    const loadAllStudents = async () => {
      try {
        const data = await crmService.getStudents();
        if (mounted) {
          setAllStudents(data.results || data || []);
        }
      } catch (error) {
        console.error('Error loading all students:', error);
      }
    };
    loadAllStudents();
    return () => {
      mounted = false;
    };
  }, []);

  const isAdmin = true;

  const tabs = [
    { id: "students", label: "Số lượng học viên" },
    { id: "revenue", label: "Doanh thu" },
    { id: "crm", label: "CRM - Chuyển đổi" },
    { id: "status", label: "Tình trạng học viên" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <StudentsReport filters={filters} allStudents={allStudents} />;
      case "revenue":
        return <RevenueReport filters={filters} />;
      case "crm":
        return <CRMReport filters={filters} />;
      case "status":
        return <StatusReport filters={filters} />;
      default:
        return <StudentsReport filters={filters} allStudents={allStudents} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Báo cáo & Thống kê
          </h1>
          <p className="text-slate-600">
            Tổng hợp số liệu và biểu đồ theo bộ lọc
          </p>
        </div>
        <ExportButtons activeTab={activeTab} />
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-main text-primary-main"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <Filters value={filters} onChange={setFilters} />

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        {renderContent()}
      </div>
    </div>
  );
}