import React, { useMemo, useState } from "react";
import { Search, Filter, Phone, Mail, MessageSquare, Calendar, UserPlus, ArrowRight } from "lucide-react";
import { dummyLeads, leadStages } from "./dummyData";

export default function LeadList({ role, onSchedule, onLog, onConvert }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filtered = useMemo(() => {
    return dummyLeads.filter((l) => {
      const s = searchTerm.toLowerCase();
      const okSearch = l.name.toLowerCase().includes(s) || l.phone.includes(searchTerm) || l.email.toLowerCase().includes(s) || (l.interest || "").toLowerCase().includes(s);
      const okStage = !stageFilter || l.stage === stageFilter;
      return okSearch && okStage;
    });
  }, [searchTerm, stageFilter]);

  const getStageBadge = (stage) => {
    const map = {
      new: "bg-slate-100 text-slate-800",
      warm: "bg-yellow-100 text-yellow-800",
      hot: "bg-red-100 text-red-800",
      lost: "bg-slate-200 text-slate-600",
    };
    const label = leadStages.find((s) => s.value === stage)?.label || stage;
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[stage]}`}>{label}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, liên hệ, nhu cầu..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-button"
          >
            <option value="">Tất cả mức độ</option>
            {leadStages.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Liên hệ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nhu cầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mức độ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nguồn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                  <div className="text-xs text-slate-500">#{lead.id} • {lead.createdAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{lead.phone}</div>
                  <div className="flex items-center gap-2 text-slate-600"><Mail className="h-3 w-3" />{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{lead.interest}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStageBadge(lead.stage)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{lead.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onSchedule(lead)} className="text-slate-600 hover:text-slate-900 p-1 rounded interactive-button" title="Đặt lịch chăm sóc">
                      <Calendar className="h-4 w-4" />
                    </button>
                    <button onClick={() => onLog(lead)} className="text-slate-600 hover:text-slate-900 p-1 rounded interactive-button" title="Lưu lịch sử trao đổi">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button onClick={() => onConvert(lead)} className="text-primary-main hover:text-primary-dark p-1 rounded interactive-button" title="Chuyển thành học viên">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

