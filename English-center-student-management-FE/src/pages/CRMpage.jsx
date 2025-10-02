import React, { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { StudentProfile, CRMReports } from "../components/CRM";
import CareLogForm from "../components/CRM/CareLogForm";
// Reuse StudentManagement components
import StudentList from "../components/StudentManagement/StudentList";
import AddStudentForm from "../components/StudentManagement/AddStudentForm";
import EditStudentForm from "../components/StudentManagement/EditStudentForm";
import StudentProfileModal from "../components/StudentManagement/StudentProfileModal";
import authService from "../services/authService";
import { ROLES } from "../utils/permissions";

export default function CRMpage() {
  const [activeTab, setActiveTab] = useState("students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCareLogForm, setShowCareLogForm] = useState(false);
  // StudentManagement-style modals
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Role
  const [role, setRole] = useState(null);

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

  const tabs = [
    {
      id: "students",
      label: "Danh Sách Học Viên",
      icon: Users,
      description: "Quản lý thông tin học viên",
    },

    {
      id: "reports",
      label: "Báo Cáo CRM",
      icon: BarChart3,
      description: "Phân tích hiệu suất và chuyển đổi",
    },
  ];

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveTab("profile");
  };

  const handleAddCareLog = (student) => {
    setSelectedStudent(student);
    setShowCareLogForm(true);
  };

  const handleSaveCareLog = (careLogData) => {
    // TODO: Implement API call to save care log
    setShowCareLogForm(false);
  };

  // StudentManagement handlers
  const openAddStudent = () => setShowAddForm(true);
  const openEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditForm(true);
  };
  const openProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };
  const closeAll = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowProfileModal(false);
    setSelectedStudent(null);
  };

  const isAdmin = role === ROLES.ADMIN;
  // Fields staff can update per policy image: phone, status, class, notes
  const staffAllowedFields = ["phone", "status", "class", "notes"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "students":
        return (
          <StudentList onEdit={openEditStudent} onViewProfile={openProfile} />
        );
      case "profile":
        return <StudentProfile student={selectedStudent} />;
      case "reports":
        return <CRMReports />;
      default:
        return (
          <StudentList onEdit={openEditStudent} onViewProfile={openProfile} />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          CRM - Quản Lý Học Viên
        </h1>
        <p className="text-slate-600 mt-1">
          Hệ thống chăm sóc khách hàng và quản lý học viên
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tổng Học Viên</p>
              <p className="text-2xl font-bold text-slate-800">1,247</p>
            </div>
            <Users className="h-8 w-8 text-primary-main" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">+12%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Chăm Sóc Hôm Nay</p>
              <p className="text-2xl font-bold text-slate-800">23</p>
            </div>
            <MessageSquare className="h-8 w-8 text-info" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">+5%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tỷ Lệ Chuyển Đổi</p>
              <p className="text-2xl font-bold text-slate-800">30%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-success" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">+2.3%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Churn Rate</p>
              <p className="text-2xl font-bold text-slate-800">1.8%</p>
            </div>
            <AlertCircle className="h-8 w-8 text-warning" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">-0.3%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-main text-primary-main"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Toolbar for Students tab */}
      {activeTab === "students" && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-slate-600" />
          <button
            onClick={openAddStudent}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors interactive-button"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm học viên
          </button>
        </div>
      )}

      <div className="min-h-[600px]">{renderTabContent()}</div>

      {showCareLogForm && selectedStudent && (
        <CareLogForm
          isOpen={showCareLogForm}
          onClose={() => setShowCareLogForm(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.ten}
          onSave={handleSaveCareLog}
        />
      )}

      {/* StudentManagement modals (reused) */}
      {activeTab === "students" && (
        <>
          {showAddForm && (
            <AddStudentForm onClose={closeAll} onSuccess={closeAll} />
          )}
          {showEditForm && selectedStudent && (
            <EditStudentForm
              student={selectedStudent}
              onClose={closeAll}
              onSuccess={closeAll}
              allowedFields={isAdmin ? null : staffAllowedFields}
            />
          )}
          {showProfileModal && selectedStudent && (
            <StudentProfileModal
              student={selectedStudent}
              onClose={closeAll}
              onEdit={() => {
                setShowProfileModal(false);
                openEditStudent(selectedStudent);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
