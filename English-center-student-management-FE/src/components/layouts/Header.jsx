import React, { useEffect, useRef, useState } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { ROLES } from "../../utils/permissions";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../utils/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          if (mounted) setUser(me);
        } else {
          if (mounted) setUser(null);
        }
      } catch {
        if (mounted) setUser(null);
      }
    }
    loadMe();
    // Optionally, you can listen to storage changes for multi-tab logout
    const onStorage = (e) => {
      if (e.key === ACCESS_TOKEN_KEY || e.key === REFRESH_TOKEN_KEY) {
        loadMe();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-slate-200 bg-background backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Breadcrumb */}
        <div className="hidden text-sm text-slate-500 lg:block">
          <span className="font-medium text-slate-800">Pages</span>
          <span className="mx-2">/</span>
          <span>Dashboard</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden w-64 lg:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              placeholder="Type here..."
              className="w-full rounded-full border border-slate-200 bg-surface px-10 py-2 text-sm outline-none ring-primary-light placeholder:text-slate-400 focus:ring-2"
            />
          </div>

          {/* Bell */}
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-surface hover:bg-slate-100">
            <Bell size={18} />
            <span className="absolute h-4 min-w-4 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* Profile */}
          <div ref={ref} className="relative">
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-surface px-3 py-1.5 hover:bg-slate-100"
              >
                <img
                  src="https://i.pravatar.cc/32?img=11"
                  alt="avatar"
                  className="h-7 w-7 rounded-lg"
                />
                <span className="hidden text-sm font-medium sm:block">
                  Sign In
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-surface px-3 py-1.5 hover:bg-slate-100"
                >
                  <img
                    src="https://i.pravatar.cc/32?img=11"
                    alt="avatar"
                    className="h-7 w-7 rounded-lg"
                  />
                  <span className="hidden text-sm font-medium sm:block">
                    {user?.last_name + ' ' + user?.first_name || user?.username}
                  </span>
                  {user?.role && (
                    <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 sm:block">
                      {user.role === ROLES.ADMIN ? 'Admin' : 
                       user.role === ROLES.GIANGVIEN ? 'Giảng viên' :
                       user.role === ROLES.ACADEMIC_STAFF ? 'Học vụ' :
                       user.role === ROLES.SALES_STAFF ? 'Tư vấn' :
                       user.role === ROLES.FINANCE_STAFF ? 'Tài chính' : 'Unknown'}
                    </span>
                  )}
                  <ChevronDown size={16} />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-lg">
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100" onClick={() => navigate('/profile')}>
                      Profile
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100" onClick={() => navigate('/settings')}>
                      Settings
                    </button>
                    <div className="h-px bg-slate-200" />
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-slate-100"
                      onClick={async () => {
                        await authService.logout();
                        setUser(null);
                        setOpen(false);
                        navigate('/');
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
