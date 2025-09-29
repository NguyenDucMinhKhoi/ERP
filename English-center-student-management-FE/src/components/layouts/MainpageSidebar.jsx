import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Info, BookOpen, LayoutGrid } from "lucide-react";

export default function MainpageSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "home", label: "Home", icon: <Home size={16} />, hash: "" },
    { key: "about", label: "About Us", icon: <Info size={16} />, hash: "about" },
    { key: "courses", label: "Courses", icon: <BookOpen size={16} />, hash: "courses" },
  ];

  const [activeKey, setActiveKey] = useState(() => {
    if (location.pathname === "/") {
      if (location.hash) return location.hash.replace("#", "");
      return "home";
    }
    return "";
  });

  useEffect(() => {
    // Sync activeKey when location changes, but do not override a user-clicked key
    if (location.pathname === "/") {
      if (location.hash) {
        setActiveKey(location.hash.replace("#", ""));
      } else {
        setActiveKey((prev) => (items.some((i) => i.key === prev) ? prev : "home"));
      }
    } else {
      setActiveKey("");
    }
  }, [location.pathname, location.hash]);

  const isActive = (hash, key) => {
    // Primary source of truth: local activeKey when set, fallback to hash match
    if (activeKey) return activeKey === key;
    if (!hash) return location.pathname === "/" && !location.hash;
    return location.hash === `#${hash}`;
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] border-slate-200 bg-background px-3 py-4 lg:block">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-main text-white shadow">
          <LayoutGrid size={18} />
        </div>
        <div className="text-sm font-semibold tracking-tight">ENGLISH CENTER</div>
      </div>

      <nav className="space-y-2">
        {items.map((it) => {
          const active = isActive(it.hash, it.key);
          const handleClick = () => {
            setActiveKey(it.key);

            // If Home clicked -> scroll to top when on root, else navigate then scroll
            if (it.key === "home") {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              navigate("/");
              setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
              return;
            }

            if (!it.hash) return navigate("/");

            // If already on main page, scroll to the section without changing the path
            if (location.pathname === "/") {
              const el = document.getElementById(it.hash);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
              }
            }

            // Otherwise navigate to root, then try to scroll after a short delay
            navigate("/");
            setTimeout(() => {
              const el = document.getElementById(it.hash);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
          };


          return (
            <button
              key={it.key}
              onClick={handleClick}
              aria-current={active ? "page" : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-surface text-primary-main shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg border ${
                active ? "border-primary-light bg-primary-light text-primary-main" : "border-slate-200 bg-surface text-slate-600"
              }`}>
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
