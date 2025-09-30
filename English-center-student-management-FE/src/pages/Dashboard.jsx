import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { StudentDashboard } from "../components/student/modules";
import authService from "../services/authService";

export default function Dashboard() {
  // Event handlers
  const navigate = useNavigate();
  const location = useLocation();
  const [successData, setSuccessData] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (location.state && location.state.accountCreated) {
      setSuccessData(location.state.accountCreated);
      // Clear the navigation state so dialog doesn't reappear on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          const role = me?.role || null;
          setUserRole(role);
          if (role === 'hocvien') {
            navigate('/student', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    };
    loadUserRole();
  }, [navigate]);

  // Nếu là học viên, đã điều hướng sang /student ở trên
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
          English Center Management Dashboard
        </h1>
        <p className="text-slate-600 mt-1">
          ERP overview - Manage students, courses, and finances
        </p>
      </div>

      {/* KPI Cards - Top Level Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total Students"
          value="1,247"
          delta="+12%"
          tone="success"
          icon={<Users className="h-5 w-5" />}
          description="Compared to last month"
        />
        <KPICard
          title="Active Courses"
          value="24"
          delta="+3"
          tone="info"
          icon={<GraduationCap className="h-5 w-5" />}
          description="Total classes"
        />
        <KPICard
          title="Monthly Revenue"
          value="₫2.4B"
          delta="+18%"
          tone="success"
          icon={<DollarSign className="h-5 w-5" />}
          description="Current month"
        />
        <KPICard
          title="Completion Rate"
          value="87%"
          delta="+5%"
          tone="success"
          icon={<TrendingUp className="h-5 w-5" />}
          description="Average across courses"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="New Students"
          value="89"
          icon={<UserCheck className="h-4 w-4" />}
          color="text-success"
        />
        <MetricCard
          title="Classes Today"
          value="12"
          icon={<Calendar className="h-4 w-4" />}
          color="text-info"
        />
        <MetricCard
          title="Students In Debt"
          value="23"
          icon={<AlertCircle className="h-4 w-4" />}
          color="text-error"
        />
        <MetricCard
          title="Attendance Today"
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
            title="Revenue by Month"
            icon={TrendingUp}
            description="Revenue chart placeholder"
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
