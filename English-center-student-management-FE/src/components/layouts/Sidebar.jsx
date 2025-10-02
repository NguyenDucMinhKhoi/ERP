import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Receipt,
  UserRound,
  LayoutGrid,
  Users,
  BarChart3,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import authService from "../../services/authService";
import { isAllowed, ROLES } from "../../utils/permissions"; // Import ROLES

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadRole() {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          if (mounted) setRole(me?.role || null);
        } else if (mounted) {
          setRole(null);
        }
      } catch {
        if (mounted) setRole(null);
      }
    }
    loadRole();
    const onStorage = (e) => {
      if (e.key === "ecsm_access_token" || e.key === "ecsm_refresh_token") {
        loadRole();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const canCRM = isAllowed(role, 'crm');
  const canBilling = isAllowed(role, 'billing');
  const canReports = isAllowed(role, 'reports');
  const canNotifications = isAllowed(role, 'notifications');
  const isAdmin = role === ROLES.ADMIN; // Sử dụng ROLES.ADMIN

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] border-slate-200 bg-background px-3 py-4 lg:block">
      {/* Brand trên cùng */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-main text-white shadow">
          <LayoutGrid size={18} />
        </div>
        <div className="text-sm font-semibold tracking-tight">
          ENGLISH CENTER ERP
        </div>
      </div>

      {/* Groups */}
      <NavSection title="Trang Chính">
        {isAdmin && (
          <NavItem
            icon={<Home size={18} />}
            label="Dashboard"
            active={
              location.pathname === "/" || location.pathname === "/dashboard"
            }
            onClick={() => handleNavigation("/dashboard")}
          />
        )}
        {canCRM && (
          <NavItem
            icon={<Users size={18} />}
            label="CRM - Học Viên"
            active={location.pathname === "/crm"}
            onClick={() => handleNavigation("/crm")}
          />
        )}
        {canCRM && (
          <NavItem
            icon={<Users size={18} />}
            label="CRM - Leads"
            active={location.pathname === "/crm-leads"}
            onClick={() => handleNavigation("/crm-leads")}
          />
        )}
        {canCRM && (
          <NavItem
            icon={<BookOpen size={18} />}
            label="Quản lý khóa học"
            active={location.pathname === "/course-management"}
            onClick={() => handleNavigation("/course-management")}
          />
        )}
        {canBilling && isAdmin && ( // Chỉ admin mới thấy Quản lý Tài chính
          <NavItem 
            icon={<Receipt size={18} />} 
            label="Quản lý Tài chính" 
            active={location.pathname === '/finance'}
            onClick={() => handleNavigation('/finance')}
          />
        )}
      </NavSection>

      <NavSection title="Báo Cáo & Phân Tích">
        {canReports && (
          <NavItem
            icon={<BarChart3 size={18} />}
            label="Báo cáo & Thống kê"
            active={location.pathname === "/reports"}
            onClick={() => handleNavigation("/reports")}
          />
        )}
        {canNotifications && (
          <NavItem
            icon={<MessageSquare size={18} />}
            label="Thông Báo & Hỗ Trợ"
            active={location.pathname === "/notifications"}
            onClick={() => handleNavigation("/notifications")}
          />
        )}
      </NavSection>

      <NavSection title="Tài Khoản">
        <NavItem
          icon={<UserRound size={18} />}
          label="Hồ Sơ"
          active={location.pathname === "/profile"}
          onClick={() => handleNavigation("/profile")}
        />
      </NavSection>
    </aside>
  );
}

function NavSection({ title, children }) {
  return (
    <div className="mb-4">
      {title && (
        <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </div>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function NavItem({ icon, label, active, pill, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-surface text-primary-main shadow-sm"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-${
          pill ? "full" : "lg"
        } border ${
          active
            ? "border-primary-light bg-primary-light text-primary-main"
            : "border-slate-200 bg-surface text-slate-600"
        }`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}