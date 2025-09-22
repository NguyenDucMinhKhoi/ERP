import React from "react";

export default function ModuleCard({ title, icon, color, stats, actions, onActionClick }) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-lg p-2 text-white ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="mb-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="block w-full rounded-lg bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
            onClick={() => onActionClick?.(action, index)}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
