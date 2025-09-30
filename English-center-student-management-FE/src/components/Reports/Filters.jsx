import React from "react";

export default function Filters({ value, onChange }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
          <input type="date" value={value.from} onChange={(e) => onChange({ ...value, from: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
          <input type="date" value={value.to} onChange={(e) => onChange({ ...value, to: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Khóa học</label>
          <input type="text" placeholder="Ví dụ: IELTS" value={value.course} onChange={(e) => onChange({ ...value, course: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div className="flex items-end">
          <button onClick={() => onChange({ from: "", to: "", course: "" })} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">Xóa lọc</button>
        </div>
      </div>
    </div>
  );
}

