import React from "react";

export default function QuickActionButton({ icon, title, description, color, onClick }) {
  return (
    <button 
      className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
      onClick={onClick}
    >
      <div className={`rounded-lg p-2 text-white ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </button>
  );
}
