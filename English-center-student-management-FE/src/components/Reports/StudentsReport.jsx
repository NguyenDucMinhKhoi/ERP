import React from "react";

export default function StudentsReport({ filters }) {
  const stats = {
    total: 1247,
    newThisMonth: 78,
    completed: 312,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tổng học viên</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tháng này</div>
          <div className="text-2xl font-bold">{stats.newThisMonth}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã hoàn thành</div>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </div>
      </div>
      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">[Chart placeholder]</div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Khóa học</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { course: "IELTS", count: 420 },
              { course: "TOEIC", count: 360 },
              { course: "General English", count: 220 },
            ].map((r) => (
              <tr key={r.course}>
                <td className="px-4 py-2">{r.course}</td>
                <td className="px-4 py-2">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

