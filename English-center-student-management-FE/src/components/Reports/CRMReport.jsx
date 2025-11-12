import React from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CRMReport({ filters }) {
  const kpis = {
    leads: 320,
    contacted: 210,
    converted: 96,
  };
  const conversion = Math.round(
    (kpis.converted / Math.max(kpis.contacted, 1)) * 100
  );

  // Mock data cho Funnel - Quá trình chuyển đổi
  const funnelData = React.useMemo(() => {
    return [
      { stage: 'Tổng Leads', count: kpis.leads, fill: '#8b5cf6' },
      { stage: 'Đã liên hệ', count: kpis.contacted, fill: '#6366f1' },
      { stage: 'Đã chuyển đổi', count: kpis.converted, fill: '#10b981' },
    ];
  }, [kpis, filters]);

  // Mock data cho Pie Chart - Leads theo nguồn
  const sourceData = React.useMemo(() => {
    return [
      { source: 'Facebook', leads: 120, fill: '#3b82f6' },
      { source: 'Website', leads: 90, fill: '#6366f1' },
      { source: 'Referral', leads: 60, fill: '#8b5cf6' },
      { source: 'Google Ads', leads: 35, fill: '#10b981' },
      { source: 'Khác', leads: 15, fill: '#94a3b8' },
    ];
  }, [filters]);

  // Custom label cho Pie Chart
  const renderLabel = (entry) => {
    const percent = ((entry.leads / kpis.leads) * 100).toFixed(0);
    return `${entry.source}: ${percent}%`;
  };

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

      {/* Biểu đồ - 2 charts trong 1 hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel Chart - Quá trình chuyển đổi */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Phễu chuyển đổi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={funnelData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number"
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis 
                type="category" 
                dataKey="stage"
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value} người`, 'Số lượng']}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 8, 8, 0]}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center text-sm text-slate-600">
            Tỷ lệ chuyển đổi tổng thể: <span className="font-semibold text-green-600">{conversion}%</span>
          </div>
        </div>

        {/* Pie Chart - Leads theo nguồn */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Phân bổ Leads theo nguồn
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="leads"
              >
                {sourceData.map((entry, index) => (
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
                formatter={(value) => [`${value} leads`, 'Số lượng']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {sourceData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-slate-600">{entry.source}</span>
              </div>
            ))}
          </div>
        </div>
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
