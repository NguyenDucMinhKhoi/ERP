import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueReport({ filters }) {
  const canViewDetail = true;
  const summary = {
    totalRevenue: 325000000,
    thisMonth: 48000000,
  };
  const rows = [
    { date: "2024-09-01", course: "IELTS", amount: 12000000 },
    { date: "2024-09-05", course: "TOEIC", amount: 8000000 },
    { date: "2024-09-12", course: "General English", amount: 6000000 },
  ];

  // Mock data cho Line Chart - Doanh thu theo tuần
  const weeklyRevenueData = React.useMemo(() => {
    return [
      { week: 'Tuần 1', revenue: 28500000 },
      { week: 'Tuần 2', revenue: 35200000 },
      { week: 'Tuần 3', revenue: 42800000 },
      { week: 'Tuần 4', revenue: 38600000 },
      { week: 'Tuần 5', revenue: 45900000 },
    ];
  }, [filters]);

  // Mock data cho Bar Chart - Doanh thu theo khóa học
  const courseRevenueData = React.useMemo(() => {
    return [
      { course: 'IELTS 5.0-6.0', revenue: 85000000 },
      { course: 'TOEIC', revenue: 62000000 },
      { course: 'TOEIC 450-650', revenue: 48000000 },
      { course: 'Business', revenue: 38000000 },
      { course: 'General English A1-A2', revenue: 52000000 },
    ];
  }, [filters]);

  // Format tiền VND
  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tổng doanh thu</div>
          <div className="text-2xl font-bold">
            {summary.totalRevenue.toLocaleString()} đ
          </div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tháng này</div>
          <div className="text-2xl font-bold">
            {summary.thisMonth.toLocaleString()} đ
          </div>
        </div>
      </div>

      {/* Biểu đồ - 2 charts trong 1 hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart - Doanh thu theo tuần */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Doanh thu theo tuần
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="week" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Doanh thu theo khóa học */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            So sánh doanh thu theo khóa học
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="course" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#6366f1" 
                radius={[8, 8, 0, 0]}
                name="Doanh thu"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {canViewDetail ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Số tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{r.date}</td>
                  <td className="px-4 py-2">{r.course}</td>
                  <td className="px-4 py-2">{r.amount.toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-slate-600">
          Nhân viên chỉ xem tổng quan. Chi tiết giao dịch chỉ dành cho Admin.
        </div>
      )}
    </div>
  );
}
