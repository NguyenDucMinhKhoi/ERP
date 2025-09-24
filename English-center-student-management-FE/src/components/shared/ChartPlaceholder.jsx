import React from "react";

export default function ChartPlaceholder({ 
  title, 
  icon: Icon, 
  description = "Biểu đồ sẽ được hiển thị ở đây",
  height = "h-64",
  showFilters = true 
}) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {showFilters && (
          <div className="flex gap-2">
            <button className="rounded-lg bg-primary-main px-3 py-1 text-xs text-white">6 tháng</button>
            <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-600">1 năm</button>
          </div>
        )}
      </div>
      <div className={`${height} rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 flex items-center justify-center`}>
        <div className="text-center">
          {Icon && <Icon className="h-12 w-12 text-primary-main mx-auto mb-2" />}
          <p className="text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
