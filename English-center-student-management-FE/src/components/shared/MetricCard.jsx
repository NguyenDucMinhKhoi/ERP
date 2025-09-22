import React from "react";

export default function MetricCard({ title, value, icon, color }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-slate-100 p-2 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
