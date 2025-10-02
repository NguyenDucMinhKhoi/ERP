import React from "react";
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

      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">
        [Revenue chart placeholder]
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
