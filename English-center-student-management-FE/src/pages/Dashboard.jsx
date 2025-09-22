import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  BookOpen,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import ClassList from "../components/ClassList";
import StudentListModal from "../components/StudentListModal";
import AddStudentModal from "../components/AddStudentModal";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" | "classes"
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleViewStudents = () => {
    setCurrentView("classes");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem);
    setIsStudentModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedClass(null);
  };

  const handleAddStudent = () => {
    setIsAddStudentModalOpen(true);
  };

  const handleCloseAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };

  const handleStudentAdded = (newStudent) => {
    console.log("New student added:", newStudent);
    // Ở đây bạn có thể thêm logic để cập nhật danh sách học viên
    // Ví dụ: updateStudentsList(newStudent);
  };

  // Nếu đang xem danh sách lớp học, hiển thị ClassList component
  if (currentView === "classes") {
    return (
      <>
        <ClassList
          onBack={handleBackToDashboard}
          onSelectClass={handleSelectClass}
        />
        {/* Student Modal - luôn render để có thể hiển thị */}
        <StudentListModal
          isOpen={isStudentModalOpen}
          onClose={handleCloseStudentModal}
          selectedClass={selectedClass}
        />
      </>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Quản Lý Trung Tâm Tiếng Anh
        </h1>
        <p className="text-slate-600 mt-1">
          Tổng quan hệ thống ERP - Quản lý học viên, khóa học và tài chính
        </p>
      </div>

      {/* KPI Cards - Top Level Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Tổng Học Viên"
          value="1,247"
          delta="+12%"
          tone="success"
          icon={<Users className="h-5 w-5" />}
          description="So với tháng trước"
        />
        <KPICard
          title="Khóa Học Đang Mở"
          value="24"
          delta="+3"
          tone="info"
          icon={<GraduationCap className="h-5 w-5" />}
          description="Tổng số lớp học"
        />
        <KPICard
          title="Doanh Thu Tháng"
          value="₫2.4B"
          delta="+18%"
          tone="success"
          icon={<DollarSign className="h-5 w-5" />}
          description="Tháng hiện tại"
        />
        <KPICard
          title="Tỷ Lệ Hoàn Thành"
          value="87%"
          delta="+5%"
          tone="success"
          icon={<TrendingUp className="h-5 w-5" />}
          description="Trung bình các khóa"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Học Viên Mới"
          value="89"
          icon={<UserCheck className="h-4 w-4" />}
          color="text-success"
        />
        <MetricCard
          title="Buổi Học Hôm Nay"
          value="12"
          icon={<Calendar className="h-4 w-4" />}
          color="text-info"
        />
        <MetricCard
          title="Học Viên Nợ Phí"
          value="23"
          icon={<AlertCircle className="h-4 w-4" />}
          color="text-error"
        />
        <MetricCard
          title="Điểm Danh Hôm Nay"
          value="94%"
          icon={<CheckCircle className="h-4 w-4" />}
          color="text-success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Revenue Chart */}
        <div className="card p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Doanh Thu Theo Tháng</h3>
            <div className="flex gap-2">
              <button className="rounded-lg bg-primary-main px-3 py-1 text-xs text-white">
                6 tháng
              </button>
              <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-600">
                1 năm
              </button>
            </div>
          </div>
          <div className="h-64 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary-main mx-auto mb-2" />
              <p className="text-slate-600">
                Biểu đồ doanh thu sẽ được hiển thị ở đây
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - 1/3 width
        <div className="xl:col-span-1">
          <QuickActions onActionClick={handleQuickAction} />
        </div> */}
      </div>

      {/* Module Overview */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* CRM Module */}
        <ModuleCard
          title="CRM - Quản Lý Học Viên"
          icon={<Users className="h-6 w-6" />}
          color="bg-primary-main"
          stats={[
            { label: "Tổng học viên", value: "1,247" },
            { label: "Lead mới", value: "89" },
            { label: "Chuyển đổi", value: "23%" },
          ]}
          actions={[
            { text: "Xem danh sách học viên", onClick: handleViewStudents },
            { text: "Thêm học viên mới", onClick: handleAddStudent },
            "Chăm sóc học viên",
          ]}
        />

        {/* Academic Module */}
        <ModuleCard
          title="Academic - Quản Lý Khóa Học"
          icon={<BookOpen className="h-6 w-6" />}
          color="bg-info"
          stats={[
            { label: "Khóa đang mở", value: "24" },
            { label: "Buổi học hôm nay", value: "12" },
            { label: "Tỷ lệ điểm danh", value: "94%" },
          ]}
          actions={["Quản lý lịch học", "Điểm danh", "Xem tiến độ"]}
        />

        {/* Finance Module */}
        <ModuleCard
          title="Finance - Quản Lý Tài Chính"
          icon={<DollarSign className="h-6 w-6" />}
          color="bg-success"
          stats={[
            { label: "Doanh thu tháng", value: "₫2.4B" },
            { label: "Học viên nợ phí", value: "23" },
            { label: "Tỷ lệ thu phí", value: "97%" },
          ]}
          actions={["Ghi thanh toán", "Xuất hóa đơn", "Báo cáo doanh thu"]}
        />

        {/* Operations Module */}
        <ModuleCard
          title="Operations - Vận Hành"
          icon={<Calendar className="h-6 w-6" />}
          color="bg-warning"
          stats={[
            { label: "Đăng ký mới", value: "45" },
            { label: "Hoàn thành", value: "32" },
            { label: "Tỷ lệ hoàn thành", value: "87%" },
          ]}
          actions={["Quản lý đăng ký", "Phân lớp học viên", "Báo cáo tổng hợp"]}
        />
      </div>
      {/* Recent Activities
      <RecentActivities onActivityClick={handleActivityClick} /> */}

      {/* API Tester - Development Only */}
      {/* <div className="mt-8">
        <APITester />
      </div> */}

      {/* Student Modal */}
      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={handleCloseStudentModal}
        selectedClass={selectedClass}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        onAddStudent={handleStudentAdded}
      />
    </div>
  );
}


// KPI Card Component
function KPICard({ title, value, delta, tone, icon, description }) {
  const toneMap = {
    success: "text-success bg-success-50",
    error: "text-error bg-error-50",
    info: "text-info bg-info-50",
    warning: "text-warning bg-warning-50",
  };
  const chip = toneMap[tone] || "text-primary-main bg-primary-light";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div className="rounded-full bg-slate-100 p-3">{icon}</div>
      </div>
      <div
        className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${chip}`}
      >
        {delta}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, color }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-slate-100 p-2 ${color}`}>{icon}</div>
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
// Quick Action Button Component
function QuickActionButton({ icon, title, description, color }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50">
      <div className={`rounded-lg p-2 text-white ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </button>
  );
}

// Module Card Component
function ModuleCard({ title, icon, color, stats, actions }) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-lg p-2 text-white ${color}`}>{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={typeof action === "object" ? action.onClick : undefined}
            className="block w-full rounded-lg bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
          >
            {typeof action === "object" ? action.text : action}
          </button>
        ))}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, time, type }) {
  const typeMap = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-full bg-slate-100 p-2 ${typeMap[type]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}

