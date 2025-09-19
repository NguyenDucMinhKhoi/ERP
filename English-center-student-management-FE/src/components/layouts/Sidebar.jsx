import React from "react";
import {
  Home,
  Table2,
  Receipt,
  UserRound,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] border-slate-200 bg-background px-3 py-4 lg:block">
      {/* Brand trên cùng */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-main text-white shadow">
          <LayoutGrid size={18} />
        </div>
        <div className="text-sm font-semibold tracking-tight">
          PURITY UI DASHBOARD
        </div>
      </div>

      {/* Groups */}
      <NavSection title="Pages">
        <NavItem icon={<Home size={18} />} label="Dashboard" />
        <NavItem icon={<Table2 size={18} />} label="Tables" />
        <NavItem icon={<Receipt size={18} />} label="Billing" />
        <NavItem icon={<ChevronRight size={18} />} label="RTL" />
      </NavSection>

      <NavSection title="Account Pages">
        <NavItem icon={<UserRound size={18} />} label="Profile" />
        <NavItem icon={<ChevronRight size={18} />} label="Sign In" />
        <NavItem icon={<ChevronRight size={18} />} label="Sign Up" />
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

function NavItem({ icon, label, active, pill }) {
  return (
    <button
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-surface text-primary-main shadow-sm ring-1 ring-primary-light"
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
