import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import crmService from '../../services/crmService';

export default function CRMReport({ filters }) {
  const [kpis, setKpis] = useState({ leads: 0, contacted: 0, converted: 0 });
  const [funnelData, setFunnelData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // deterministic color generator from string
  const colorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h} 85% 55%)`;
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // can pass filters as params if needed (e.g., date range)
        const params = {};
        if (filters?.from) params.from = filters.from;
        if (filters?.to) params.to = filters.to;
        const data = await crmService.getLeadsReport(params);
        if (!mounted) return;

        const total = data.total_leads || 0;
        const contacted = data.contacted || 0;
        const converted = data.converted || 0;
        setKpis({ leads: total, contacted, converted });

        setFunnelData([
          { stage: 'Tổng Leads', count: total, fill: '#8b5cf6' },
          { stage: 'Đã liên hệ', count: contacted, fill: '#6366f1' },
          { stage: 'Đã chuyển đổi', count: converted, fill: '#10b981' },
        ]);

        const sources = (data.sources || []).map((s) => ({
          source: s.sourced || 'Khác',
          leads: s.count,
          fill: colorFromString(s.sourced || 'Khác')
        }));
        setSourceData(sources);
      } catch (err) {
        console.error('Error loading leads report:', err);
        setError('Không thể tải báo cáo leads');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [filters]);

  const conversion = Math.round((kpis.converted / Math.max(kpis.contacted, 1)) * 100);

  const renderLabel = (entry) => {
    const percent = kpis.leads ? ((entry.leads / kpis.leads) * 100).toFixed(0) : 0;
    return `${entry.source}: ${percent}%`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Leads</div>
          <div className="text-2xl font-bold">{loading ? '...' : kpis.leads}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã liên hệ</div>
          <div className="text-2xl font-bold">{loading ? '...' : kpis.contacted}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã chuyển đổi</div>
          <div className="text-2xl font-bold">{loading ? '...' : kpis.converted}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tỷ lệ chuyển đổi</div>
          <div className="text-2xl font-bold">{loading ? '...' : `${conversion}%`}</div>
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
            Tỷ lệ chuyển đổi tổng thể: <span className="font-semibold text-green-600">{loading ? '...' : `${conversion}%`}</span>
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
            {sourceData.map((r) => (
              <tr key={r.source}>
                <td className="px-4 py-2">{r.source}</td>
                <td className="px-4 py-2">{r.leads}</td>
                <td className="px-4 py-2">—</td>
              </tr>
            ))}
           </tbody>
         </table>
       </div>
     </div>
   );
 }
