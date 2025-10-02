import React from "react";

export default function StatusReport({ filters }) {
  const rows = [
    { status: "Chờ lớp", count: 85 },
    { status: "Đang học", count: 720 },
    { status: "Tạm dừng", count: 42 },
    { status: "Đã hoàn thành", count: 300 },
  ];
  return (
    <div className="space-y-4">
      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">[Status distribution chart placeholder]</div>
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

