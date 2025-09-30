import React from "react";

export default function CRMReport({ filters }) {
  const kpis = {
    leads: 320,
    contacted: 210,
    converted: 96,
  };
  const conversion = Math.round(
    (kpis.converted / Math.max(kpis.contacted, 1)) * 100
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Leads</div>
          <div className="text-2xl font-bold">{kpis.leads}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã liên hệ</div>
          <div className="text-2xl font-bold">{kpis.contacted}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã chuyển đổi</div>
          <div className="text-2xl font-bold">{kpis.converted}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tỷ lệ chuyển đổi</div>
          <div className="text-2xl font-bold">{conversion}%</div>
        </div>
      </div>
      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">
        [Conversion chart placeholder: {conversion}%]
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nguồn
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Leads
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Chuyển đổi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { source: "Facebook", leads: 120, converted: 36 },
              { source: "Website", leads: 90, converted: 28 },
              { source: "Referral", leads: 60, converted: 22 },
            ].map((r) => (
              <tr key={r.source}>
                <td className="px-4 py-2">{r.source}</td>
                <td className="px-4 py-2">{r.leads}</td>
                <td className="px-4 py-2">{r.converted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
