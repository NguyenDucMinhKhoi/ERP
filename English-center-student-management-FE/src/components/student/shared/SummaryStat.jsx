import React from 'react';

export default function SummaryStat({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color.bg}`}>
          {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-primary-main">{label}</p>
            <p className="text-2xl font-bold text-primary-main">{value}</p>
        </div>
      </div>
    </div>
  );
}


