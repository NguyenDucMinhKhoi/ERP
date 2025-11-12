import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatusReport({ filters }) {
  const rows = [
    { status: "Chờ lớp", count: 85 },
    { status: "Đang học", count: 720 },
    { status: "Tạm dừng", count: 42 },
    { status: "Đã hoàn thành", count: 300 },
  ];

  // Data cho Pie Chart với màu sắc
  const pieData = React.useMemo(() => {
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    return [
      { 
        status: "Đang học", 
        count: 720, 
        fill: "#10b981",
        percent: ((720 / total) * 100).toFixed(1)
      },
      { 
        status: "Đã hoàn thành", 
        count: 300, 
        fill: "#3b82f6",
        percent: ((300 / total) * 100).toFixed(1)
      },
      { 
        status: "Chờ lớp", 
        count: 85, 
        fill: "#f59e0b",
        percent: ((85 / total) * 100).toFixed(1)
      },
      { 
        status: "Tạm dừng", 
        count: 42, 
        fill: "#ef4444",
        percent: ((42 / total) * 100).toFixed(1)
      },
    ];
  }, [filters]);

  // Custom label cho Pie Chart
  const renderLabel = (entry) => {
    return `${entry.percent}%`;
  };
  return (
    <div className="space-y-4">
      {/* Pie Chart - Phân bổ trạng thái học viên */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-6 text-center">
          Phân bổ trạng thái học viên
        </h3>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Pie Chart */}
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  formatter={(value, name, props) => [
                    `${value} học viên (${props.payload.percent}%)`, 
                    'Số lượng'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend với thống kê */}
          <div className="w-full lg:w-1/2 space-y-3">
            {pieData.map((entry, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="font-medium text-slate-700">{entry.status}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-800">{entry.count}</div>
                  <div className="text-xs text-slate-500">{entry.percent}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.status}>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

