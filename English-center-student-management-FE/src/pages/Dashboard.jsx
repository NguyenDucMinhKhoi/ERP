import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { KPICard, MetricCard, ChartPlaceholder } from "../components/shared";
import {
  QuickActions,
  ModuleOverview,
  RecentActivities,
} from "../components/dashboard";
import { APITester } from "../components/CRM";

export default function Dashboard() {
  // Event handlers
  const navigate = useNavigate();
  const handleQuickAction = (action, actionData) => {
    if (action === "add-employee") {
      navigate("/accounts/create");
      return;
    }
    console.log("Quick action clicked:", action, actionData);
  };

  const handleModuleAction = (moduleTitle, action, actionIndex) => {
    console.log("Module action clicked:", moduleTitle, action, actionIndex);
    // TODO: Implement navigation to specific module pages
  };

  const handleActivityClick = (activity, index) => {
    console.log("Activity clicked:", activity, index);
    // TODO: Implement navigation to activity details
  };

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
        {/* Revenue Chart - 2/3 width */}
        <div className="xl:col-span-2">
          <ChartPlaceholder
            title="Doanh Thu Theo Tháng"
            icon={TrendingUp}
            description="Biểu đồ doanh thu sẽ được hiển thị ở đây"
            height="h-64"
            showFilters={true}
          />
        </div>

        {/* Quick Actions - 1/3 width */}
        <div className="xl:col-span-1">
          <QuickActions onActionClick={handleQuickAction} />
        </div>
      </div>

      {/* Module Overview */}
      <ModuleOverview onModuleAction={handleModuleAction} />

      {/* Recent Activities */}
      <RecentActivities onActivityClick={handleActivityClick} />

      {/* API Tester - Development Only */}
      <div className="mt-8">
        <APITester />
      </div>
    </div>
  );
}
