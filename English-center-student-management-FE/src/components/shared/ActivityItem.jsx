import React from "react";

export default function ActivityItem({ icon, title, time, type, onClick }) {
  const typeMap = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    error: "text-error",
  };
  
  return (
    <div 
      className="flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 rounded-lg p-2 -m-2"
      onClick={onClick}
    >
      <div className={`rounded-full bg-slate-100 p-2 ${typeMap[type]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}
