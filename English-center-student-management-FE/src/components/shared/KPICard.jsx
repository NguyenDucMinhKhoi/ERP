import React from "react";

export default function KPICard({ title, value, delta, tone, icon, description }) {
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
        <div className="rounded-full bg-slate-100 p-3">
          {icon}
        </div>
      </div>
      <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${chip}`}>
        {delta}
      </div>
    </div>
  );
}
