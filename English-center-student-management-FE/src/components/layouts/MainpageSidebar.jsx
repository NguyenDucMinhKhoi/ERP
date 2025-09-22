import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Info, BookOpen } from "lucide-react";

export default function MainpageSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "home", label: "Home", icon: <Home size={16} />, hash: "" },
    { key: "about", label: "About Us", icon: <Info size={16} />, hash: "about" },
    { key: "courses", label: "Courses", icon: <BookOpen size={16} />, hash: "courses" },
  ];

  const isActive = (hash) => {
    // if hash is empty -> active on root path without any hash
    if (!hash) return location.pathname === "/" && !location.hash;
    return location.hash === `#${hash}`;
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[220px] border-slate-200 bg-background px-3 py-6 lg:block">
      <div className="mb-6 px-2">
        <div className="text-sm font-semibold tracking-tight text-slate-800">ENGLISH CENTER</div>
        <div className="text-xs text-slate-500">Khóa học & Lộ trình</div>
      </div>

      <nav className="space-y-2">
        {items.map((it) => {
          const active = isActive(it.hash);
          return (
            <button
              key={it.key}
              onClick={() => navigate(it.hash ? `/#${it.hash}` : "/")}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-surface text-primary-main shadow-sm" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg border ${active ? "border-primary-light bg-primary-light text-primary-main" : "border-slate-200 bg-surface text-slate-600"}`}>
                {it.icon}
              </span>
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
